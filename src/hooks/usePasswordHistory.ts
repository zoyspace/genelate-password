"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	MAX_HISTORY_COUNT,
	type PasswordHistoryEntry,
} from "@/lib/constants";

const STORAGE_KEY = "passwordHistory";

/** localStorage から旧形式含む履歴データを読み込み、正規化する */
function loadHistoryFromStorage(): PasswordHistoryEntry[] {
	if (typeof window === "undefined") return [];

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];

	const history: unknown[] = JSON.parse(raw);
	return history.map(
		(entry: any) =>
			({
				id: entry.id || crypto.randomUUID(),
				password: entry.password ?? "",
				createdAt:
					entry.createdAt ||
					entry.timestamp ||
					new Date().toLocaleString(),
				isFavorite: !!entry.isFavorite,
			}) as PasswordHistoryEntry,
	);
}

/** 履歴を localStorage に永続化する */
function persistHistory(history: PasswordHistoryEntry[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * パスワード履歴の管理フック。
 * 状態管理 (useState) と永続化 (localStorage) を一元的に担う。
 */
export function usePasswordHistory() {
	const [history, setHistory] = useState<PasswordHistoryEntry[]>([]);
	const isInitialized = useRef(false);

	// 初期化: localStorage から読み込み
	useEffect(() => {
		if (!isInitialized.current) {
			setHistory(loadHistoryFromStorage());
			isInitialized.current = true;
		}
	}, []);

	/** 新しいパスワードを履歴の先頭に追加する */
	const addToHistory = useCallback((password: string) => {
		const newEntry: PasswordHistoryEntry = {
			id: crypto.randomUUID(),
			password,
			createdAt: new Date().toLocaleString(),
			isFavorite: false,
		};

		setHistory((prev) => {
			const updated = [newEntry, ...prev.slice(0, MAX_HISTORY_COUNT - 1)];
			persistHistory(updated);
			return updated;
		});
	}, []);

	/** お気に入り状態をトグルする */
	const toggleFavorite = useCallback((id: string) => {
		setHistory((prev) => {
			const updated = prev.map((entry) =>
				entry.id === id
					? { ...entry, isFavorite: !entry.isFavorite }
					: entry,
			);
			persistHistory(updated);
			return updated;
		});
	}, []);

	/** 指定の履歴エントリを削除する */
	const removeFromHistory = useCallback((id: string) => {
		setHistory((prev) => {
			const updated = prev.filter((entry) => entry.id !== id);
			persistHistory(updated);
			return updated;
		});
	}, []);

	return {
		passwordHistory: history,
		addToHistory,
		toggleFavorite,
		removeFromHistory,
	} as const;
}
