"use client";

import { useEffect, useState } from "react";
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

	// ログイン状態に応じてSupabaseからデータを同期
	useEffect(() => {
		if (isLoggedIn && user) {
			syncWithSupabase();
		}
	}, [isLoggedIn, user, syncWithSupabase]);

	return (
		<div className="min-h-screen bg-gradient-to-br transition-colors duration-500">
			<div
				className={`w-full h-full absolute inset-0 z-0 ${
					isDarkMode
						? "from-gray-900 to-gray-800"
						: "from-blue-100 to-purple-100"
				} transition-colors duration-500`}
			/>

			<div className="  max-w-md mx-auto py-8 px-4 relative z-10">
				<div className="flex justify-between items-center mb-6">
					<h1
						className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
					>
						Password History
					</h1>
					<Link href="/">
						<Button variant="ghost">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back
						</Button>
					</Link>
				</div>

				{/* Tab switching */}
				<div
					className={`flex space-x-2   p-2 rounded-lg ${
						isDarkMode ? "bg-gray-800" : "bg-gray-100"
					}`}
				>
					<TabButton
						isActive={activeTab === "all"}
						onClick={() => setActiveTab("all")}
						isDarkMode={isDarkMode}
						icon={<Clock className="mr-2 h-4 w-4" />}
						label="All History"
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
						label="Favorites"
					/>
				</div>

				{/* Content section */}
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

			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">パスワード履歴</h1>
					<div className="flex items-center gap-4">
						<AuthButton />
						<Link
							href="/"
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
						>
							ホームに戻る
						</Link>
					</div>
				</div>

				{isLoggedIn ? (
					<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
						<p className="font-bold">ログイン済み</p>
						<p>
							お気に入りのパスワードはクラウドに保存され、複数のデバイスで共有できます。
						</p>
					</div>
				) : (
					<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
						<p className="font-bold">ヒント</p>
						<p>
							ログインすると、お気に入りのパスワードをクラウドに保存し、複数のデバイスで共有できます。
						</p>
					</div>
				)}

				{loadingHistory && (
					<div className="flex justify-center my-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
					</div>
				)}

				{!loadingHistory && passwordHistory.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg">
						<p className="text-xl text-gray-600">履歴はありません</p>
						<p className="mt-2 text-gray-500">
							パスワードを生成するとここに表示されます
						</p>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2">
						{passwordHistory.map((entry) => (
							<div
								key={entry.id}
								className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
							>
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-500">
										{entry.createdAt}
									</span>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => toggleFavorite(entry.id)}
											className="text-gray-400 hover:text-yellow-500"
											title={
												entry.isFavorite
													? "お気に入りから削除"
													: "お気に入りに追加"
											}
										>
											{entry.isFavorite ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="currentColor"
													stroke="currentColor"
													strokeWidth="2"
													className="text-yellow-500"
												>
													<title>Favorite</title>
													<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<title>Not Favorite</title>
													<title>Not Favorite</title>
													<title>Delete</title>
													<title>Not Favorite</title>
													<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
												</svg>
											)}
										</button>
										<button
											type="button"
											onClick={() => removeFromHistory(entry.id)}
											className="text-gray-400 hover:text-red-500"
											title="削除"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
											</svg>
										</button>
									</div>
								</div>
								<div className="font-mono bg-gray-50 p-2 rounded border select-all overflow-x-auto">
									{entry.password}
								</div>
							</div>
						))}
					</div>
				)}
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
