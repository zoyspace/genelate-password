"use client";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function AuthButton() {
	const { user, isLoggedIn, signOut } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// ログアウト処理
	const handleLogout = async () => {
		await signOut();
		setIsDropdownOpen(false);
	};

	// ドロップダウンの表示/非表示を切り替え
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	if (isLoggedIn && user) {
		return (
			<div className="relative">
				<button
					type="button"
					onClick={toggleDropdown}
					className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
				>
					<span className="mr-2">
						{user.email?.split("@")[0] || "ユーザー"}
					</span>
					<ChevronDown size={16} />
				</button>

				{isDropdownOpen && (
					<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
						<div className="py-2 px-4 text-sm text-gray-700 border-b">
							{user.email}
						</div>
						<button
							type="button"
							onClick={handleLogout}
							className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
						>
							ログアウト
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<Link
			href="/login"
			className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
		>
			ログイン
		</Link>
	);
}
