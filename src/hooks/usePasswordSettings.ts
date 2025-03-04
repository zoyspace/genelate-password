import { useState, useEffect } from 'react';

export const DEFAULT_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/'];

interface PasswordSettings {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  customSymbols: string[];
}

export const usePasswordSettings = () => {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: false,
    customSymbols: DEFAULT_SYMBOLS,
  });
  
  const [isClient, setIsClient] = useState(false);

  // 初期化
  useEffect(() => {
    const storedLength = sessionStorage.getItem("passwordLength");
    const storedIncludeUppercase = sessionStorage.getItem("includeUppercase");
    const storedIncludeNumbers = sessionStorage.getItem("includeNumbers");
    const storedIncludeSymbols = sessionStorage.getItem("includeSymbols");
    const storedCustomSymbols = sessionStorage.getItem("customSymbols");
    const storedIncludeLowercase = sessionStorage.getItem("includeLowercase");

    const newSettings = { ...settings };
    
    if (storedLength !== null) newSettings.length = Number.parseInt(storedLength, 10);
    if (storedIncludeUppercase !== null) newSettings.includeUppercase = JSON.parse(storedIncludeUppercase);
    if (storedIncludeNumbers !== null) newSettings.includeNumbers = JSON.parse(storedIncludeNumbers);
    if (storedIncludeSymbols !== null) newSettings.includeSymbols = JSON.parse(storedIncludeSymbols);
    if (storedCustomSymbols !== null) newSettings.customSymbols = JSON.parse(storedCustomSymbols);
    if (storedIncludeLowercase !== null) newSettings.includeLowercase = JSON.parse(storedIncludeLowercase);

    setSettings(newSettings);
    setIsClient(true);
  }, []);

  // 設定を保存
  useEffect(() => {
    if (!isClient) return;

    sessionStorage.setItem("passwordLength", settings.length.toString());
    sessionStorage.setItem("includeUppercase", JSON.stringify(settings.includeUppercase));
    sessionStorage.setItem("includeNumbers", JSON.stringify(settings.includeNumbers));
    sessionStorage.setItem("includeSymbols", JSON.stringify(settings.includeSymbols));
    sessionStorage.setItem("customSymbols", JSON.stringify(settings.customSymbols));
    sessionStorage.setItem("includeLowercase", JSON.stringify(settings.includeLowercase));
  }, [settings, isClient]);

  const updateSetting = <K extends keyof PasswordSettings>(
    key: K,
    value: PasswordSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    return { ...settings, [key]: value };
  };

  return {
    settings,
    updateSetting,
    isClient
  };
};
