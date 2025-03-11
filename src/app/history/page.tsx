"use client";

import { useState } from "react";
import { PasswordHistory } from "@/components/PasswordHistory";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function HistoryPage() {
	const { isDarkMode } = useTheme();
	const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

	return (
		<div className="min-h-screen bg-gradient-to-br transition-colors duration-500">
			<div
				className={`w-full h-full absolute inset-0 z-0 ${
					isDarkMode
						? "from-gray-900 to-gray-800"
						: "from-blue-100 to-purple-100"
				} transition-colors duration-500`}
			/>

			<div className="container max-w-4xl mx-auto py-8 px-4 relative z-10">
				<div className="flex justify-between items-center mb-6">
					<h1
						className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
					>
						パスワード履歴
					</h1>
					<Link href="/">
						<Button variant="ghost">
							<ArrowLeft className="mr-2 h-4 w-4" /> 戻る
						</Button>
					</Link>
				</div>

				{/* タブ切り替え */}
				<div
					className={`flex space-x-2 mb-6 p-1 rounded-lg ${
						isDarkMode ? "bg-gray-800" : "bg-gray-100"
					}`}
				>
					<TabButton
						isActive={activeTab === "all"}
						onClick={() => setActiveTab("all")}
						isDarkMode={isDarkMode}
						icon={<Clock className="mr-2 h-4 w-4" />}
						label="すべての履歴"
					/>
					<TabButton
						isActive={activeTab === "favorites"}
						onClick={() => setActiveTab("favorites")}
						isDarkMode={isDarkMode}
						icon={<Heart className="mr-2 h-4 w-4" />}
						label="お気に入り"
					/>
				</div>

				{/* コンテンツ部分 */}
				<div
					className={`p-6 rounded-lg ${
						isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} transition-colors duration-500 shadow-xl`}
				>
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<PasswordHistory showOnlyFavorites={activeTab === "favorites"} />
					</motion.div>
				</div>
			</div>
		</div>
	);
}

// タブボタンコンポーネント
function TabButton({
	isActive,
	onClick,
	isDarkMode,
	icon,
	label,
}: {
	isActive: boolean;
	onClick: () => void;
	isDarkMode: boolean;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<motion.button
			onClick={onClick}
			className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-colors relative ${
				isActive
					? isDarkMode
						? "text-white"
						: "text-gray-800"
					: isDarkMode
						? "text-gray-400 hover:text-gray-200"
						: "text-gray-500 hover:text-gray-700"
			}`}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
		>
			{isActive && (
				<motion.div
					layoutId="tab-indicator"
					className={`absolute inset-0 rounded-md ${
						isDarkMode ? "bg-gray-700" : "bg-white"
					}`}
					initial={false}
					transition={{ type: "spring", duration: 0.5 }}
				/>
			)}
			<span className="relative flex items-center">
				{icon}
				{label}
			</span>
		</motion.button>
	);
}
