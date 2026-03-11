"use client";

import { motion } from "framer-motion";
import type { PasswordHistoryEntry } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Heart, Trash2 } from "lucide-react";

type HistoryEntryCardProps = {
	entry: PasswordHistoryEntry;
	onCopy: (password: string, id: string) => void;
	onToggleFavorite: (id: string) => void;
	onDelete: (id: string) => void;
	isCopied: boolean;
};

export function HistoryEntryCard({
	entry,
	onCopy,
	onToggleFavorite,
	onDelete,
	isCopied,
}: HistoryEntryCardProps) {
	const borderColor = entry.isFavorite
		? "border-amber-400/40 dark:border-amber-500/30"
		: "border-gray-100 dark:border-gray-600";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, height: 0, marginBottom: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className={`p-5 rounded-lg bg-linear-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-md shadow-gray-200/60 dark:shadow-lg dark:shadow-gray-900/30 relative overflow-hidden border ${borderColor} hover:scale-[1.01] transition-transform`}
		>
			<div className="flex flex-col gap-1">
				{/* ヘッダー: 日時 & アクションボタン */}
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<Clock className="h-3 w-3 pr-1" />
						<p className="text-xs text-gray-500">{entry.createdAt}</p>
					</div>
					<div className="flex space-x-2">
						{/* コピーボタン */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => onCopy(entry.password, entry.id)}
							className={`relative rounded-full hover:bg-opacity-80 transition-all duration-200 ${
								isCopied
									? "bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 dark:bg-green-700/30 dark:text-green-300 dark:hover:bg-green-700/30 dark:hover:text-green-300"
									: ""
							}`}
						>
							<Copy className="h-4 w-4" />
							{isCopied && (
								<motion.span
									initial={{ opacity: 0, x: 0, y: 0 }}
									animate={{ opacity: 1, x: -35, y: -15 }}
									exit={{ opacity: 0 }}
									className="absolute right-0 text-xs text-white px-2.5 py-1 rounded-lg shadow-md duration-100 bg-gray-900 dark:bg-gray-800"
								>
									コピー完了
								</motion.span>
							)}
						</Button>

						{/* お気に入りボタン */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => onToggleFavorite(entry.id)}
							className={`relative rounded-full transition-all duration-200 ${
								entry.isFavorite
									? "bg-amber-100 text-amber-600 dark:bg-amber-700/30 dark:text-amber-300"
									: ""
							}`}
						>
							<Heart
								className={`h-4 w-4 transition-all duration-300 ${
									entry.isFavorite
										? "fill-amber-500 text-amber-500 scale-110"
										: ""
								}`}
							/>
						</Button>

						{/* 削除ボタン */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => onDelete(entry.id)}
							className="rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition-all duration-200"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* パスワード表示 */}
				<div className="mt-1">
					<p
						className={`font-mono text-lg text-gray-800 dark:text-gray-100 tracking-wide break-all ${
							entry.isFavorite ? "font-semibold" : ""
						}`}
					>
						{entry.password}
					</p>
				</div>
			</div>
		</motion.div>
	);
}
