// --- 文字セット定数 ---

export const CHARSETS = {
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	digits: "0123456789",
} as const;

// biome-ignore format: Preserve manual formatting
export const DEFAULT_SYMBOLS = ["!","@","#","$","%","^","&","*","(",")","-","_","+","=","{","}","[","]","|",":",";","<",">",",",".","?","/"];

// --- パスワード生成設定 ---

export const INITIAL_PASSWORD_PLACEHOLDER = "Output Area";
export const MAX_HISTORY_COUNT = 50;
export const DEBOUNCE_MS = 200;

// --- 型定義 ---

export interface PasswordHistoryEntry {
	id: string;
	password: string;
	createdAt: string;
	isFavorite: boolean;
}

export type GeneratePasswordOptions = {
	includeUppercase?: boolean;
	includeNumbers?: boolean;
	includeSymbols?: boolean;
	customSymbols?: string[];
	length?: number;
	includeLowercase?: boolean;
};
