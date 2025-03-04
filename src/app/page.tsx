"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordDisplay from "@/components/PasswordDisplay";
import { SymbolSelector } from "@/components/SymbolSelector";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { usePassword } from "@/context/PasswordContext";

export default function PasswordGeneratorPage() {
	const { 
		length, 
		setLength,
		includeUppercase, 
		setIncludeUppercase,
		includeNumbers, 
		setIncludeNumbers,
		includeSymbols, 
		setIncludeSymbols,
		includeLowercase, 
		setIncludeLowercase,
		customSymbols, 
		setCustomSymbols,
		password,
		generatePassword
	} = usePassword();
	
	const { isDarkMode, toggleDarkMode } = useTheme();
	// const [isClient, setIsClient] = useState(false);

	// クライアントサイド処理を有効化
	useEffect(() => {
		// setIsClient(true)
		
		// 初回アクセス時にパスワードがセットされていない場合は生成
		if (!password || password === "Output Area") {
			// 少し遅延させてアニメーション効果を適用
			const timer = setTimeout(() => {
				generatePassword();
			}, 500);
			
			return () => clearTimeout(timer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleToggleDarkMode = () => {
		toggleDarkMode();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br transition-colors duration-500 overflow-hidden">
			<div
				className={`w-full h-full absolute inset-0 z-0 ${isDarkMode ? "from-gray-900 to-gray-800" : "from-blue-100 to-purple-100"} transition-colors duration-500`}
			/>
			<AnimatePresence mode="wait">
				<motion.div
					key={isDarkMode ? "dark" : "light"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className={`w-full max-w-md p-8 rounded-xl shadow-2xl relative z-10 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} transition-colors duration-5000`}
				>
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Password Generator</h1>
						<Button variant="ghost" size="icon" onClick={handleToggleDarkMode}>
							{isDarkMode ? (
								<Sun className="h-6 w-6" />
							) : (
								<Moon className="h-6 w-6" />
							)}
						</Button>
					</div>
					<div className="space-y-4">
						<PasswordDisplay
							password={password}
							generatePass={generatePassword}
						/>
						<div>
							<label htmlFor="password-length-slider" className="block mb-2">
								Password Length: <span className="text-xl">{length}</span>
							</label>
							<Slider
								id="password-length-slider"
								value={[length]}
								onValueChange={(value) => {
									setLength(value[0]);
									generatePassword({ _length: value[0] });
								}}
								max={32}
								min={8}
								step={1}
							/>
						</div>
						<div className="mt-4 flex gap-4">
							<div
								className={`${includeLowercase ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!includeLowercase ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-lowercase-switch" className="row">
									<span className="text-xs">Include </span>Lowercase
								</label>
								<Switch
									id="include-lowercase-switch"
									checked={includeLowercase}
									onCheckedChange={(checked) => {
										setIncludeLowercase(checked);
										generatePassword({ _includeLowercase: checked });
									}}
								/>
							</div>
							<div
								className={`${includeUppercase ? "border-4 p-2" : "border p-[11px]"}  rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!includeUppercase ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-uppercase-switch" className="row">
									<span className="text-xs">Include </span>Uppercase
								</label>
								<Switch
									id="include-uppercase-switch"
									checked={includeUppercase}
									onCheckedChange={(checked) => {
										setIncludeUppercase(checked);
										generatePassword({ _includeUppercase: checked });
									}}
								/>
							</div>
							<div
								className={`${includeNumbers ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!includeNumbers ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-numbers-switch" className="row">
									<span className="text-xs">Include </span>Numbers
								</label>
								<Switch
									id="include-numbers-switch"
									checked={includeNumbers}
									onCheckedChange={(checked) => {
										setIncludeNumbers(checked);
										generatePassword({ _includeNumbers: checked });
									}}
								/>
							</div>
						</div>
						<div
							className={`  ${includeSymbols ? "border-4 p-2" : "border p-[11px]"} rounded-2xl mt-4`}
						>
							<div
								className={`flex flex-col  mb-1  ${!includeSymbols ? "opacity-50" : ""} transition-opacity duration-300`}
							>
								<label htmlFor="include-symbols-switch" className="row">
									<span className="text-xs">Include </span>Symbols
								</label>
								<Switch
									id="include-symbols-switch"
									className="ml-4"
									checked={includeSymbols}
									onCheckedChange={(checked) => {
										setIncludeSymbols(checked);
										generatePassword({ _includeSymbols: checked });
									}}
								/>
							</div>

							<SymbolSelector
								selectedSymbols={customSymbols}
								onSymbolsChange={(symbols) => {
									setCustomSymbols(symbols);
									if (includeSymbols) {
										generatePassword({ _customSymbols: symbols });
									}
								}}
								disabled={!includeSymbols}
							/>
						</div>
						<div className="mt-6 text-center">
							<Link href="/history">
								<Button variant="outline">View Password History</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
