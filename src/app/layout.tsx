import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { PasswordProvider } from '@/context/PasswordContext';

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
		<html lang="en">
			<body>
				<ThemeProvider>
					<PasswordProvider>
						{children}
					</PasswordProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
