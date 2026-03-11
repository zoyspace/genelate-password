"use client";

import { motion } from "framer-motion";

type TabButtonProps = {
	isActive: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
};

export function TabButton({ isActive, onClick, icon, label }: TabButtonProps) {
	return (
		<motion.button
			onClick={onClick}
			className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-colors relative ${
				isActive
					? "text-gray-800 dark:text-white"
					: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
			}`}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
		>
			{isActive && (
				<motion.div
					layoutId="tab-indicator"
					className="absolute inset-0 rounded-md bg-white dark:bg-gray-700"
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
