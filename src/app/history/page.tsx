"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PasswordHistory } from "@/components/PasswordHistory";
import { TabButton } from "@/components/TabButton";
import { Button } from "@/components/ui/button";
import { usePassword } from "@/context/PasswordContext";
import { useTheme } from "@/context/ThemeContext";

export default function HistoryPage() {
	const { isDarkMode, mounted } = useTheme();
	const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
	const { passwordHistory } = usePassword();

	return (
		<div className="min-h-screen transition-colors duration-500">
			<div className="w-full h-full absolute inset-0 z-0 bg-linear-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500" />

			<div className="container mx-auto max-w-md py-8 px-4 relative z-10">
				{/* ヘッダー */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
						パスワード履歴
					</h1>
					<Link href="/">
						<Button variant="ghost" className="flex items-center">
							<ArrowLeft className="mr-2 h-4 w-4" /> 戻る
						</Button>
					</Link>
				</div>

				{/* タブ切り替え */}
				<div className="flex space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
					<TabButton
						isActive={activeTab === "all"}
						onClick={() => setActiveTab("all")}
						icon={<Clock className="mr-2 h-4 w-4" />}
						label="全履歴"
					/>
					<TabButton
						isActive={activeTab === "favorites"}
						onClick={() => setActiveTab("favorites")}
						icon={
							<Heart
								className={`mr-2 h-4 w-4 ${
									mounted && activeTab === "favorites" && !isDarkMode
										? "fill-amber-500 text-amber-500"
										: ""
								}`}
							/>
						}
						label="お気に入り"
					/>
				</div>

				{/* コンテンツ */}
				<div className="p-6 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-500 shadow-xl">
					{passwordHistory.length === 0 ? (
						<div className="text-center py-12 rounded-lg bg-gray-50 dark:bg-gray-700">
							<p className="text-xl text-gray-600 dark:text-gray-300">
								履歴はありません
							</p>
							<p className="mt-2 text-gray-500 dark:text-gray-400">
								パスワードを生成するとここに表示されます
							</p>
						</div>
					) : (
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<PasswordHistory
								showOnlyFavorites={activeTab === "favorites"}
							/>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
