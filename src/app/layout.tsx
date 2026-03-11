import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

import { PasswordProvider } from "../context/PasswordContext";

export const metadata: Metadata = {
	title: "generate password",
	description: "generate random word"	,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<PasswordProvider>{children}</PasswordProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
