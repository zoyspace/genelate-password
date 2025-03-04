import { useState, useRef, useEffect } from 'react';

interface PasswordOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  customSymbols: string[];
}

interface PasswordHistoryEntry {
  id: string;
  password: string;
  createdAt: string;
  isFavorite: boolean;
}

export const usePasswordGenerator = (initialOptions: PasswordOptions) => {
  const [password, setPassword] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 履歴から最新のパスワードを取得
    const storedHistory = sessionStorage.getItem("passwordHistory");
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      if (history.length > 0) {
        setPassword(history[0].password);
      } else {
        setPassword("Output Area");
      }
    } else {
      setPassword("Output Area");
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const savePasswordToHistory = (newPassword: string) => {
    const newEntry: PasswordHistoryEntry = {
      id: crypto.randomUUID(),
      password: newPassword,
      createdAt: new Date().toLocaleString(),
      isFavorite: false,
    };

    const storedHistory = sessionStorage.getItem("passwordHistory");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.unshift(newEntry);
    sessionStorage.setItem(
      "passwordHistory",
      JSON.stringify(history.slice(0, 10))
    );
  };

  const generatePassword = (options?: Partial<PasswordOptions>) => {
    // 以前のタイマーをキャンセル
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentOptions = {
      length: options?.length ?? initialOptions.length,
      includeLowercase: options?.includeLowercase ?? initialOptions.includeLowercase,
      includeUppercase: options?.includeUppercase ?? initialOptions.includeUppercase,
      includeNumbers: options?.includeNumbers ?? initialOptions.includeNumbers,
      includeSymbols: options?.includeSymbols ?? initialOptions.includeSymbols,
      customSymbols: options?.customSymbols ?? initialOptions.customSymbols,
    };

    // パスワード生成処理を非同期化
    timerRef.current = setTimeout(() => {
      let charset = "";
      if (currentOptions.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (currentOptions.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (currentOptions.includeNumbers) charset += "0123456789";
      if (currentOptions.includeSymbols && currentOptions.customSymbols.length > 0) {
        charset += currentOptions.customSymbols.join("");
      }
      
      // 有効な文字セットがあるか確認
      if (charset.length === 0) {
        const paddingChar = "*".repeat(currentOptions.length);
        setPassword(paddingChar);
        return;
      }

      let newPassword = "";
      for (let i = 0; i < currentOptions.length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      setPassword(newPassword);
      savePasswordToHistory(newPassword);
      timerRef.current = null;
    }, 200);
  };

  return {
    password,
    generatePassword,
    isClient
  };
};
