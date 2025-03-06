"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PasswordHistory } from "@/components/PasswordHistory";
import { FavoritePasswords } from "@/components/FavoritePasswords";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function HistoryPage() {
	const { isDarkMode } = useTheme();
	const [activeTab, setActiveTab] = useState<"history" | "favorites">(
		"history",
	);

	return (
		<div
			className={`w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? "from-gray-950 to-gray-900" : "from-gray-50 to-slate-100"} transition-colors duration-500 p-4`}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-md relative"
			>
				<div
					className={`w-full max-w-md p-6 rounded-2xl shadow-xl backdrop-blur-sm
            ${
							isDarkMode
								? "bg-gray-800/90 text-white border border-gray-700"
								: "bg-white/90 text-gray-800 border border-gray-200"
						} 
            transition-all duration-500`}
				>
					<div className="flex justify-between items-center mb-6">
						<motion.h1
							className="text-3xl font-bold"
							style={{
								color: isDarkMode ? "#e2e8f0" : "#1e293b",
							}}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							Password History
						</motion.h1>
						<Link href="/">
							<Button
								variant="outline"
								className={`rounded-lg px-4 transition-all ${
									isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
								}`}
							>
								Back
							</Button>
						</Link>
					</div>

					<motion.div
						className="flex mb-8 bg-opacity-20 rounded-lg p-1"
						style={{
							backgroundColor: isDarkMode
								? "rgba(30, 41, 59, 0.4)"
								: "rgba(241, 245, 249, 0.7)",
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<Button
							className={`py-2.5 px-6 rounded-lg font-medium transition-all duration-300 flex-1 ${
								activeTab === "history"
									? isDarkMode
										? "bg-gray-700 text-gray-100 shadow-sm"
										: "bg-gray-200 text-gray-800 shadow-sm"
									: isDarkMode
										? "text-gray-400 hover:bg-gray-700/50"
										: "text-gray-600 hover:bg-gray-100/70"
							}`}
							onClick={() => setActiveTab("history")}
						>
							History
						</Button>
						<Button
							className={`py-2.5 px-6 rounded-lg font-medium transition-all duration-300 flex-1 ${
								activeTab === "favorites"
									? isDarkMode
										? "bg-gray-700 text-gray-100 shadow-sm"
										: "bg-gray-200 text-gray-800 shadow-sm"
									: isDarkMode
										? "text-gray-400 hover:bg-gray-700/50"
										: "text-gray-600 hover:bg-gray-100/70"
							}`}
							onClick={() => setActiveTab("favorites")}
						>
							Favorites
						</Button>
					</motion.div>

					<motion.div
						key={activeTab}
						initial={{ opacity: 0, x: activeTab === "history" ? -20 : 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="relative"
					>
						{activeTab === "history" ? (
							<PasswordHistory />
						) : (
							<FavoritePasswords />
						)}
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
