"use client";

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<ThemeInternalProvider>{children}</ThemeInternalProvider>
		</NextThemeProvider>
	);
}

function ThemeInternalProvider({ children }: { children: React.ReactNode }) {
	const { resolvedTheme, setTheme } = useNextTheme();
	const [mounted, setMounted] = useState(false);

	// クライアントサイドでのマウントを確認するまでレンダリングを調整（FoUC対策）
	useEffect(() => {
		setMounted(true);
	}, []);

	const isDarkMode = resolvedTheme === "dark";

	const toggleDarkMode = () => {
		setTheme(isDarkMode ? "light" : "dark");
	};

	// マウント前はハイドレーションエラーを避けるためにnullまたはプレースホルダーを返すことも検討できますが、
	// ここではコンテキストを提供し続けるためにマウント状態に関わらず値を渡します。
	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			<div style={{ visibility: mounted ? "visible" : "hidden" }}>
				{children}
			</div>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
