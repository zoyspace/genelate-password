"use client";

import { createContext, useState, useContext, useRef, useEffect } from "react";
import type { ReactElement, ReactNode } from "react";
import {
	saveFavoritePassword,
	fetchPasswordHistory,
	removePassword,
} from "../lib/supabase";
import { useAuth } from "./AuthContext";

// パスワード履歴のエントリー型
export interface PasswordHistoryEntry {
	id: string;
	password: string;
	createdAt: string;
	isFavorite: boolean;
}

// コンテキストの型定義
interface PasswordContextType {
	// 状態
	length: number;
	setLength: (length: number) => void;
	includeUppercase: boolean;
	setIncludeUppercase: (include: boolean) => void;
	includeNumbers: boolean;
	setIncludeNumbers: (include: boolean) => void;
	includeSymbols: boolean;
	setIncludeSymbols: (include: boolean) => void;
	includeLowercase: boolean;
	setIncludeLowercase: (include: boolean) => void;
	customSymbols: string[];
	setCustomSymbols: (symbols: string[]) => void;
	password: string;
	setPassword: (password: string) => void;
	passwordHistory: PasswordHistoryEntry[];
	loadingHistory: boolean;

	// 関数
	generatePassword: (options?: {
		_includeUppercase?: boolean;
		_includeNumbers?: boolean;
		_includeSymbols?: boolean;
		_customSymbols?: string[];
		_length?: number;
		_includeLowercase?: boolean;
	}) => void;
	toggleFavorite: (id: string) => void;
	removeFromHistory: (id: string) => void;
	syncWithSupabase: () => Promise<void>;
}
// biome-ignore format: Preserve manual formatting
const DEFAULT_SYMBOLS = ["!","@","#","$","%","^","&","*","(",")","-","_","+","=","{","}","[","]","|",":",";","<",">",",",".","?","/",
];

// コンテキストの作成
const PasswordContext = createContext<PasswordContextType | undefined>(
	undefined,
);

// プロバイダーコンポーネント
export function PasswordProvider({ children }: { children: ReactElement }) {
	const [length, setLength] = useState(16);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);
	const [includeLowercase, setIncludeLowercase] = useState(true);
	const [customSymbols, setCustomSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
	const [password, setPassword] = useState<string>("");
	const [passwordHistory, setPasswordHistory] = useState<
		PasswordHistoryEntry[]
	>([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const [loadingHistory, setLoadingHistory] = useState(false);

	const { user, isLoggedIn } = useAuth();
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Supabaseとの同期
	const syncWithSupabase = async () => {
		if (!isLoggedIn || !user) return;

		setLoadingHistory(true);
		try {
			const fetchedHistory = await fetchPasswordHistory(user.id);
			console.log("fetchedHistory", fetchedHistory);
			console.log("before passwordHistory", passwordHistory);
			const combinedHistory = [...fetchedHistory, ...passwordHistory];
			const uniqueByIdHistory = Array.from(
				new Map(combinedHistory.map((obj) => [obj.id, obj])).values(),
			);
			setPasswordHistory(uniqueByIdHistory);
		} catch (error) {
			console.error("Failed to sync with Supabase:", error);
		} finally {
			setLoadingHistory(false);
		}
	};

	// パスワード履歴に保存
	const savePasswordToHistory = (newPassword: string) => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const MM = String(now.getMonth() + 1).padStart(2, "0"); // 月（0ベースなので+1）
		const dd = String(now.getDate()).padStart(2, "0");
		const hh = String(now.getHours()).padStart(2, "0");
		const mm = String(now.getMinutes()).padStart(2, "0");
		const ss = String(now.getSeconds()).padStart(2, "0");
		const SSS = String(now.getMilliseconds()).padStart(3, "0"); // ミリ秒（3桁）

		const newEntry: PasswordHistoryEntry = {
			id: crypto.randomUUID(),
			// id: `${yyyy}-${MM}-${dd}-${hh}-${mm}-${ss}-${SSS}`,
			password: newPassword,
			createdAt: now.toLocaleString(),
			isFavorite: false,
		};

		setPasswordHistory((prevHistory) => {
			const updatedHistory = [newEntry, ...prevHistory];
			return updatedHistory.slice(0, 10); // 最大10件まで保持
		});
	};

	// パスワード生成関数
	const generatePassword = (
		options: {
			_includeUppercase?: boolean;
			_includeNumbers?: boolean;
			_includeSymbols?: boolean;
			_customSymbols?: string[];
			_length?: number;
			_includeLowercase?: boolean;
		} = {},
	) => {
		const {
			_includeUppercase = includeUppercase,
			_includeNumbers = includeNumbers,
			_includeSymbols = includeSymbols,
			_customSymbols = customSymbols,
			_length = length,
			_includeLowercase = includeLowercase,
		} = options;

		// 以前のタイマーをキャンセル
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// パスワード生成処理を非同期化
		timerRef.current = setTimeout(() => {
			let charset = "";
			if (_includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
			if (_includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			if (_includeNumbers) charset += "0123456789";
			if (_includeSymbols && _customSymbols.length > 0) {
				charset += _customSymbols.join("");
			}

			// 有効な文字セットがあるか確認
			if (charset.length === 0) {
				const paddingChar = "*".repeat(_length);
				setPassword(paddingChar);
				return;
			}

			let newPassword = "";
			for (let i = 0; i < _length; i++) {
				newPassword += charset.charAt(
					Math.floor(Math.random() * charset.length),
				);
			}

			setPassword(newPassword);
			savePasswordToHistory(newPassword);
			timerRef.current = null;

			// パスワード生成後、履歴に追加
			const historyItem = {
				password: newPassword,
				timestamp: new Date().toISOString(),
			};

			// 既存の履歴を取得
			const existingHistory = localStorage.getItem("passwordHistory");
			let history = existingHistory ? JSON.parse(existingHistory) : [];

			// 新しいパスワードを先頭に追加 (最大50個まで)
			history = [historyItem, ...history.slice(0, 49)];

			// 履歴を保存
			localStorage.setItem("passwordHistory", JSON.stringify(history));

			setPassword(newPassword);
			return newPassword;
		}, 200);
	};

	// お気に入り切り替え - ログイン時のみSupabaseと同期
	const toggleFavorite = async (id: string) => {
		// ログインしていない場合は何もしない
		if (!isLoggedIn || !user) return;

		setPasswordHistory((prevHistory) => {
			const updatedHistory = prevHistory.map((entry) => {
				if (entry.id === id) {
					const updatedEntry = { ...entry, isFavorite: !entry.isFavorite };

					// ログインしている場合はSupabaseに保存
					if (updatedEntry.isFavorite) {
						saveFavoritePassword({
							...updatedEntry,
							userId: user.id,
						});
					}

					return updatedEntry;
				}
				return entry;
			});

			return updatedHistory;
		});
	};

	// 履歴から削除 - Supabaseからも削除
	const removeFromHistory = async (id: string) => {
		// ログインしている場合はSupabaseからも削除
		if (isLoggedIn) {
			await removePassword(id);
		}

		setPasswordHistory((prevHistory) =>
			prevHistory.filter((entry) => entry.id !== id),
		);
	};

	// 初期化時にsessionStorageから状態を復元（一回のみ実行）
	useEffect(() => {
		if (typeof window !== "undefined" && !isInitialized) {
			// 初期パスワード生成
			if (password === "") {
				setPassword("Output Area");
			}

			setIsInitialized(true);
		}
	}, [isInitialized, password]);

	// ログイン状態が変わったらSupabaseと同期
	useEffect(() => {
		if (isLoggedIn && user) {
			syncWithSupabase();
		}
	}, [isLoggedIn, user]);

	// コンポーネントのアンマウント時にタイマーをクリーンアップ
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	return (
		<PasswordContext.Provider
			value={{
				length,
				setLength,
				includeUppercase,
				setIncludeUppercase,
				includeNumbers,
				setIncludeNumbers,
				includeSymbols,
				setIncludeSymbols,
				includeLowercase,
				setIncludeLowercase,
				customSymbols,
				setCustomSymbols,
				password,
				setPassword,
				passwordHistory,
				loadingHistory,
				generatePassword,
				toggleFavorite,
				removeFromHistory,
				syncWithSupabase,
			}}
		>
			{children}
		</PasswordContext.Provider>
	);
}

// カスタムフック
export function usePassword() {
	const context = useContext(PasswordContext);
	if (context === undefined) {
		throw new Error("usePassword must be used within a PasswordProvider");
	}
	return context;
}
