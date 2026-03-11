"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HistoryEntryCard } from "@/components/HistoryEntryCard";
import { usePassword } from "@/context/PasswordContext";
import { useTheme } from "@/context/ThemeContext";

export function PasswordHistory({
	showOnlyFavorites = false,
}: {
	showOnlyFavorites?: boolean;
}) {
	const { isDarkMode } = useTheme();
	const { passwordHistory, toggleFavorite, removeFromHistory } = usePassword();
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const filteredPasswords = showOnlyFavorites
		? passwordHistory.filter((entry) => entry.isFavorite)
		: passwordHistory;

	const handleCopy = (password: string, id: string) => {
		navigator.clipboard.writeText(password);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 1000);
	};

	return (
		<div className="space-y-4">
			<AnimatePresence initial={false}>
				{filteredPasswords.length === 0 ? (
					<p
						className={`text-center py-12 rounded-xl border border-dashed ${isDarkMode ? "text-gray-300" : "text-gray-500"} font-medium`}
					>
						{showOnlyFavorites
							? "お気に入りに登録したパスワードはありません"
							: "履歴はまだありません"}
					</p>
				) : (
					filteredPasswords.map((entry) => (
						<HistoryEntryCard
							key={entry.id}
							entry={entry}
							onCopy={handleCopy}
							onToggleFavorite={toggleFavorite}
							onDelete={removeFromHistory}
							isCopied={copiedId === entry.id}
						/>
					))
				)}
			</AnimatePresence>
		</div>
	);
}
