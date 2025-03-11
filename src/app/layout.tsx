import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { PasswordProvider } from "../context/PasswordContext";

export const metadata: Metadata = {
	title: "v0 App",
	description: "Created with v0",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<ThemeProvider>
					<AuthProvider>
						<PasswordProvider>{children}</PasswordProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
