"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type TabButtonProps = {
	isActive: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
};

export function TabButton({ isActive, onClick, icon, label }: TabButtonProps) {
	const { isDarkMode } = useTheme();

	const textColor = isActive
		? isDarkMode
			? "text-white"
			: "text-gray-800"
		: isDarkMode
			? "text-gray-400 hover:text-gray-200"
			: "text-gray-500 hover:text-gray-700";

	return (
		<motion.button
			onClick={onClick}
			className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-colors relative ${textColor}`}
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
