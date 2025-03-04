"use client";

import { createContext, useState, useContext, useRef, useEffect, ReactNode } from "react";

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
}

const DEFAULT_SYMBOLS = [
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=',
  '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/'
];

// コンテキストの作成
const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function PasswordProvider({ children }: { children: ReactNode }) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [customSymbols, setCustomSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [password, setPassword] = useState<string>("");
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistoryEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // パスワード履歴に保存
  const savePasswordToHistory = (newPassword: string) => {
    const newEntry = {
      id: crypto.randomUUID(),
      password: newPassword,
      createdAt: new Date().toLocaleString(),
      isFavorite: false,
    };
    
    setPasswordHistory(prevHistory => {
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
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      setPassword(newPassword);
      savePasswordToHistory(newPassword);
      timerRef.current = null;
    }, 200);
  };
  
  // お気に入り切り替え
  const toggleFavorite = (id: string) => {
    setPasswordHistory(prevHistory =>
      prevHistory.map(entry =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };
  
  // 履歴から削除
  const removeFromHistory = (id: string) => {
    setPasswordHistory(prevHistory =>
      prevHistory.filter(entry => entry.id !== id)
    );
  };
  
  // 初期化時にsessionStorageから状態を復元（一回のみ実行）
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      // この部分を完全に削除し、sessionStorageに依存しない初期化に置き換える
      
      // 初期パスワード生成（必要な場合のみ）
      if (password === "") {
        // 初回アクセス時の適切な初期値を設定
        setPassword("Output Area");
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized, password]);
  
  // コンポーネントのアンマウント時にタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  return (
    <PasswordContext.Provider value={{
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
      generatePassword,
      toggleFavorite,
      removeFromHistory,
    }}>
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
