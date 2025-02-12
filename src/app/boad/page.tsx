"use client";

import { PasswordHistory } from "@/components/PasswordHistory";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";

export default function HistoryPage() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setIsDarkMode(isDark);
	}, []);

	const handleBackToGenerator = () => {
		localStorage.setItem("shouldGeneratePassword", "false");
	};

	return (
		<div
			className={`min-h-screen flex  flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? "from-gray-900 to-gray-800" : "from-blue-100 to-purple-100"} transition-colors duration-500`}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div
					className={`w-[448px] m-4 p-8 pb-20 rounded-xl shadow-2xl ${
						isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
					} transition-colors duration-500`}
				>
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Password History</h1>
						<Link href="/" onClick={handleBackToGenerator}>
							<Button variant="outline">Back</Button>
						</Link>
					</div>
					<PasswordHistory />
				</div>
			</motion.div>
		</div>
	);
}
