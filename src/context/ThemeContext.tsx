"use client";

import { useEffect, useState } from "react";
import {
	ThemeProvider as NextThemeProvider,
	useTheme as useNextTheme,
} from "next-themes";

/** dark: バリアント対応のテーマプロバイダー。next-themes で html.class を管理する。 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</NextThemeProvider>
	);
}

/** テーマの切り替え用フック。isDarkMode / toggleDarkMode を提供する。 */
export function useTheme() {
	const { resolvedTheme, setTheme } = useNextTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDarkMode = mounted && resolvedTheme === "dark";
	const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

	return { isDarkMode, toggleDarkMode, mounted };
}
