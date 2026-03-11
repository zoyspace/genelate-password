"use client";

import { AnimatePresence, motion } from "framer-motion";
import { History, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CharsetToggle } from "@/components/CharsetToggle";
import PasswordDisplay from "@/components/PasswordDisplay";
import { SymbolSelector } from "@/components/SymbolSelector";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePassword } from "@/context/PasswordContext";
import { useTheme } from "@/context/ThemeContext";
import { INITIAL_PASSWORD_PLACEHOLDER } from "@/lib/constants";

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
		generatePassword,
	} = usePassword();

	const { isDarkMode, toggleDarkMode, mounted } = useTheme();

	// biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行したいため
	useEffect(() => {
		if (!password || password === INITIAL_PASSWORD_PLACEHOLDER) {
			generatePassword();
		}
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center transition-colors duration-500 overflow-hidden">
			<div className="w-full h-full absolute inset-0 z-0 bg-linear-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500" />
			<AnimatePresence mode="wait">
				<motion.div
					key="card"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full max-w-md p-8 rounded-xl shadow-2xl relative z-10 bg-white text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300"
				>
					{/* ヘッダー */}
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Password Generator</h1>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleDarkMode}
							>
								{mounted ? (
									isDarkMode ? (
										<Sun className="h-6 w-6" />
									) : (
										<Moon className="h-6 w-6" />
									)
								) : (
									<div className="h-6 w-6" /> // プレースホルダー
								)}
							</Button>
							<Link href="/history">
								<Button variant="ghost" size="icon">
									<History className="h-6 w-6" />
								</Button>
							</Link>
						</div>
					</div>

					{/* パスワード表示 & 設定 */}
					<div className="mb-4">
						<PasswordDisplay
							password={password}
							generatePass={generatePassword}
						/>

						{/* パスワード長スライダー */}
						<div className="mb-10">
							<label
								htmlFor="password-length-slider"
								className="block mb-4"
							>
								Password Length:{" "}
								<span className="text-xl">{length}</span>
							</label>
							<Slider
								id="password-length-slider"
								value={[length]}
								onValueChange={(value) => {
									setLength(value[0]);
									generatePassword({ length: value[0] });
								}}
								max={32}
								min={8}
								step={1}
							/>
						</div>

						{/* 文字種トグル */}
						<div className="flex gap-4">
							<CharsetToggle
								id="include-lowercase-switch"
								label="Lowercase"
								checked={includeLowercase}
								onCheckedChange={(checked) => {
									setIncludeLowercase(checked);
									generatePassword({ includeLowercase: checked });
								}}
							/>
							<CharsetToggle
								id="include-uppercase-switch"
								label="Uppercase"
								checked={includeUppercase}
								onCheckedChange={(checked) => {
									setIncludeUppercase(checked);
									generatePassword({ includeUppercase: checked });
								}}
							/>
							<CharsetToggle
								id="include-numbers-switch"
								label="Numbers"
								checked={includeNumbers}
								onCheckedChange={(checked) => {
									setIncludeNumbers(checked);
									generatePassword({ includeNumbers: checked });
								}}
							/>
						</div>

						{/* シンボル設定 */}
						<div
							className={`${includeSymbols ? "border-4 p-2" : "border p-[11px]"} rounded-2xl mt-4`}
						>
							<div
								className={`flex flex-col mb-1 ml-1 transition-opacity duration-300 ${!includeSymbols ? "opacity-50" : ""}`}
							>
								<label
									htmlFor="include-symbols-switch"
									className="row"
								>
									<span className="text-xs">Include </span>
									Symbols
								</label>
								<Switch
									id="include-symbols-switch"
									className="ml-4"
									checked={includeSymbols}
									onCheckedChange={(checked) => {
										setIncludeSymbols(checked);
										generatePassword({ includeSymbols: checked });
									}}
								/>
							</div>

							<SymbolSelector
								selectedSymbols={customSymbols}
								onSymbolsChange={(symbols) => {
									setCustomSymbols(symbols);
									if (includeSymbols) {
										generatePassword({ customSymbols: symbols });
									}
								}}
								disabled={!includeSymbols}
							/>
						</div>

						{/* 履歴リンク */}
						<div className="mt-6 text-center">
							<Link href="/history">
								<Button variant="outline">
									View Password History
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
