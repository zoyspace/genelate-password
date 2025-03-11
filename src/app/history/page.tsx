"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PasswordHistory } from "@/components/PasswordHistory";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function HistoryPage() {
	const { isDarkMode } = useTheme();
	const [showFavorites, setShowFavorites] = useState(false);

	return (
		<div
			className={`w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? "from-background/90 to-background/70" : "from-slate-50 to-blue-200"} transition-colors duration-500 p-4`}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full h-full max-w-md relative"
			>
				<div
					className={`min-h-screen w-full max-w-md p-6 rounded-2xl shadow-xl backdrop-blur-sm
            ${
							isDarkMode
								? "bg-card/90 border-border"
								: "bg-white/90 border-border/50"
						} 
            text-foreground border transition-all duration-500`}
				>
					<div className="flex justify-between items-center mb-6">
						<motion.h1
							className="text-3xl font-bold text-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.8 }}
						>
							Password History
						</motion.h1>
						<Link href="/">
							<Button
								variant="outline"
								className="rounded-lg px-4 transition-all hover:bg-muted/50"
							>
								Back
							</Button>
						</Link>
					</div>

					<Button
						className={` mb-3 px-6 rounded-lg font-medium transition-all duration-300 ${
							showFavorites
								? "bg-white text-primary shadow-sm border-b-2 border-primary hover:bg-slate-100"
								: "bg-white  text-muted-foreground hover:bg-slate-100"
						}`}
						onClick={() => setShowFavorites(!showFavorites)}
					>
						Favorites {showFavorites ? "ON" : "OFF"}
					</Button>

					<motion.div
						key={String(showFavorites)}
						initial={{ opacity: 0, x: 0 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="relative"
					>
						<PasswordHistory showOnlyFavorites={showFavorites} />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
