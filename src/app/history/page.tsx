"use client";

import { useEffect, useState, useRef } from "react";
import { PasswordHistory } from "@/components/PasswordHistory";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { usePassword } from "@/context/PasswordContext";
import { useAuth } from "@/context/AuthContext";
import AuthButton from "@/components/AuthButton";

export default function HistoryPage() {
	const { isDarkMode } = useTheme();
	const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
	const {
		passwordHistory,
		loadingHistory,
		removeFromHistory,
		toggleFavorite,
		syncWithSupabase,
	} = usePassword();
	const { isLoggedIn, user } = useAuth();
	const syncedRef = useRef(false);

	// ログイン状態に応じてSupabaseからデータを同期（重複実行を防止）
	useEffect(() => {
		// ログイン状態になって、まだ同期していない場合のみ実行
		if (isLoggedIn && user && !syncedRef.current) {
			syncedRef.current = true;
			syncWithSupabase();
		}

		// ログアウト時にフラグをリセット
		if (!isLoggedIn) {
			syncedRef.current = false;
		}
	}, [isLoggedIn]);

	return (
		<div className="min-h-screen bg-gradient-to-br transition-colors duration-500">
			<div
				className={`w-full h-full absolute inset-0 z-0 ${
					isDarkMode
						? "from-gray-900 to-gray-800"
						: "from-blue-100 to-purple-100"
				} transition-colors duration-500`}
			/>

			<div className="container mx-auto max-w-md py-8 px-4 relative z-10">
				<div className="flex justify-between items-center mb-6">
					<h1
						className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
					>
						パスワード履歴
					</h1>
					<div className="flex items-center gap-2">
						<AuthButton />
						<Link href="/">
							<Button variant="ghost" className="flex items-center">
								<ArrowLeft className="mr-2 h-4 w-4" /> 戻る
							</Button>
						</Link>
					</div>
				</div>

				{isLoggedIn ? (
					<div
						className={`p-4 mb-6 rounded-lg ${isDarkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-700"} border-l-4 border-green-500`}
					>
						<p className="font-bold">ログイン済み</p>
						<p>
							お気に入りのパスワードはクラウドに保存され、複数のデバイスで共有できます。
						</p>
					</div>
				) : (
					<div
						className={`p-4 mb-6 rounded-lg ${isDarkMode ? "bg-blue-800 text-blue-100" : "bg-blue-100 text-blue-700"} border-l-4 border-blue-500`}
					>
						<p className="font-bold">ヒント</p>
						<p>
							ログインすると、お気に入りのパスワードをクラウドに保存し、複数のデバイスで共有できます。
						</p>
					</div>
				)}

				{/* Tab switching */}
				<div
					className={`flex space-x-2 p-2 rounded-lg ${
						isDarkMode ? "bg-gray-800" : "bg-gray-100"
					}`}
				>
					<TabButton
						isActive={activeTab === "all"}
						onClick={() => setActiveTab("all")}
						isDarkMode={isDarkMode}
						icon={<Clock className="mr-2 h-4 w-4" />}
						label="全履歴"
					/>
					<TabButton
						isActive={activeTab === "favorites"}
						onClick={() => setActiveTab("favorites")}
						isDarkMode={isDarkMode}
						icon={
							<Heart
								className={`mr-2 h-4 w-4 ${
									activeTab === "favorites"
										? isDarkMode
											? ""
											: "fill-amber-500 text-amber-500 "
										: ""
								}`}
							/>
						}
						label="お気に入り"
					/>
				</div>

				{/* Content section */}
				<div
					className={`p-6 rounded-lg ${
						isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} transition-colors duration-500 shadow-xl`}
				>
					{loadingHistory && (
						<div className="flex justify-center my-8">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
						</div>
					)}

					{!loadingHistory && passwordHistory.length === 0 ? (
						<div
							className={`text-center py-12 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
						>
							<p
								className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
							>
								履歴はありません
							</p>
							<p
								className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
							>
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
							<PasswordHistory showOnlyFavorites={activeTab === "favorites"} />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}

// Tab button component
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
