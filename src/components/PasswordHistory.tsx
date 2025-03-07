"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Heart, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { usePassword } from "@/context/PasswordContext";

export function PasswordHistory() {
	const { isDarkMode } = useTheme();
	const { passwordHistory, toggleFavorite, removeFromHistory } = usePassword();
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const handleCopy = (password: string, id: string) => {
		navigator.clipboard.writeText(password);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	return (
		<div className="space-y-5 mt-8">
			<AnimatePresence initial={false}>
				{passwordHistory.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-center py-12 rounded-xl border border-dashed"
					>
						<p
							className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} font-medium`}
						>
							履歴はまだありません
						</p>
					</motion.div>
				) : (
					passwordHistory.map((entry) => (
						<motion.div
							key={entry.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, height: 0, marginBottom: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className={`p-5 rounded-lg ${
								isDarkMode
									? "bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg shadow-gray-900/30"
									: "bg-gradient-to-br from-white to-gray-50 shadow-md shadow-gray-200/60"
							} relative overflow-hidden border ${
								entry.isFavorite
									? isDarkMode
										? "border-amber-500/30"
										: "border-amber-400/40"
									: isDarkMode
										? "border-gray-600"
										: "border-gray-100"
							} hover:scale-[1.01] transition-transform`}
						>
							<div className="flex flex-col gap-3">
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<Clock className="h-3 w-3 mr-1" />
										<p className="text-xs text-gray-500">{entry.createdAt}</p>
										{entry.isFavorite && (
											<span
												className={`text-xs px-2 py-0.5 rounded-full ${
													isDarkMode
														? "bg-amber-500/20 text-amber-300"
														: "bg-amber-100 text-amber-700"
												} font-medium`}
											>
												お気に入り
											</span>
										)}
									</div>
									<div className="flex space-x-2">
										<Button
											variant={isDarkMode ? "ghost" : "outline"}
											size="icon"
											onClick={() => handleCopy(entry.password, entry.id)}
											className={`relative rounded-full hover:bg-opacity-80 ${
												copiedId === entry.id
													? isDarkMode
														? "bg-green-700/30 text-green-300"
														: "bg-green-100 text-green-700"
													: ""
											} transition-all duration-200`}
										>
											<Copy className="h-4 w-4" />
											{copiedId === entry.id && (
												<motion.span
													initial={{ opacity: 0, y: 5 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0 }}
													className={`absolute -top-8 right-0 text-xs ${
														isDarkMode ? "bg-gray-800" : "bg-gray-900"
													} text-white px-2.5 py-1 rounded-lg shadow-md`}
												>
													コピー完了
												</motion.span>
											)}
										</Button>
										<Button
											variant={isDarkMode ? "ghost" : "outline"}
											size="icon"
											onClick={() => toggleFavorite(entry.id)}
											className={`rounded-full ${
												entry.isFavorite
													? isDarkMode
														? "bg-amber-700/30 text-amber-300"
														: "bg-amber-100 text-amber-600"
													: ""
											} transition-all duration-200`}
										>
											<Heart
												className={`h-4 w-4 transition-all duration-300 ${
													entry.isFavorite
														? "fill-amber-500 text-amber-500 scale-110"
														: ""
												}`}
											/>
										</Button>
										<Button
											variant={isDarkMode ? "ghost" : "outline"}
											size="icon"
											onClick={() => removeFromHistory(entry.id)}
											className="rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition-all duration-200"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="mt-2">
									<p
										className={`font-mono text-lg ${
											isDarkMode ? "text-gray-100" : "text-gray-800"
										} ${entry.isFavorite ? "font-semibold" : ""} tracking-wide break-all`}
									>
										{entry.password}
									</p>
								</div>
							</div>
						</motion.div>
					))
				)}
			</AnimatePresence>
		</div>
	);
}
