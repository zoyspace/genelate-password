"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import {
	DEFAULT_SYMBOLS,
	DEBOUNCE_MS,
	INITIAL_PASSWORD_PLACEHOLDER,
	type GeneratePasswordOptions,
	type PasswordHistoryEntry,
} from "@/lib/constants";
import { buildCharset, generateSecurePassword } from "@/lib/generatePassword";
import { usePasswordHistory } from "@/hooks/usePasswordHistory";

// --- Context の型 ---

interface PasswordContextType {
	// パスワード生成設定
	length: number;
	setLength: (length: number) => void;
	includeUppercase: boolean;
	setIncludeUppercase: (v: boolean) => void;
	includeNumbers: boolean;
	setIncludeNumbers: (v: boolean) => void;
	includeSymbols: boolean;
	setIncludeSymbols: (v: boolean) => void;
	includeLowercase: boolean;
	setIncludeLowercase: (v: boolean) => void;
	customSymbols: string[];
	setCustomSymbols: (symbols: string[]) => void;

	// パスワード
	password: string;

	// 履歴
	passwordHistory: PasswordHistoryEntry[];

	// アクション
	generatePassword: (options?: GeneratePasswordOptions) => void;
	toggleFavorite: (id: string) => void;
	removeFromHistory: (id: string) => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(
	undefined,
);

// --- Provider ---

export function PasswordProvider({ children }: { children: ReactNode }) {
	// パスワード生成設定
	const [length, setLength] = useState(16);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);
	const [includeLowercase, setIncludeLowercase] = useState(true);
	const [customSymbols, setCustomSymbols] = useState<string[]>(DEFAULT_SYMBOLS);

	// パスワード表示
	const [password, setPassword] = useState(INITIAL_PASSWORD_PLACEHOLDER);

	// 履歴（カスタムフック）
	const { passwordHistory, addToHistory, toggleFavorite, removeFromHistory } =
		usePasswordHistory();

	// debounce 用タイマー
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const generatePassword = (options: GeneratePasswordOptions = {}) => {
		const resolved = {
			includeLowercase: options.includeLowercase ?? includeLowercase,
			includeUppercase: options.includeUppercase ?? includeUppercase,
			includeNumbers: options.includeNumbers ?? includeNumbers,
			includeSymbols: options.includeSymbols ?? includeSymbols,
			customSymbols: options.customSymbols ?? customSymbols,
			length: options.length ?? length,
		};

		// 前回のタイマーをキャンセル
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			const charset = buildCharset(resolved);
			const newPassword = generateSecurePassword(charset, resolved.length);

			setPassword(newPassword);
			addToHistory(newPassword);
			timerRef.current = null;
		}, DEBOUNCE_MS);
	};

	// アンマウント時のクリーンアップ
	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
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
				passwordHistory,
				generatePassword,
				toggleFavorite,
				removeFromHistory,
			}}
		>
			{children}
		</PasswordContext.Provider>
	);
}

// --- カスタムフック ---

export function usePassword() {
	const context = useContext(PasswordContext);
	if (context === undefined) {
		throw new Error("usePassword must be used within a PasswordProvider");
	}
	return context;
}
