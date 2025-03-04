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
import { usePasswordGenerator } from "@/hooks/usePasswordGenerator";
import { usePasswordSettings, DEFAULT_SYMBOLS } from "@/hooks/usePasswordSettings";

export default function PasswordGeneratorPage() {
	const { isDarkMode, toggleDarkMode } = useTheme();
	const { settings, updateSetting } = usePasswordSettings();
	const { password, generatePassword } = usePasswordGenerator(settings);
	
	// 設定が変わったときにパスワードを再生成
	const handleSettingChange = <K extends keyof typeof settings>(
		key: K,
		value: typeof settings[K]
	) => {
		const updatedSettings = updateSetting(key, value);
		generatePassword({ [key]: value });
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
						<Button variant="ghost" size="icon" onClick={toggleDarkMode}>
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
								Password Length: <span className="text-xl">{settings.length}</span>
							</label>
							<Slider
								id="password-length-slider"
								value={[settings.length]}
								onValueChange={(value) => {
									handleSettingChange('length', value[0]);
								}}
								max={32}
								min={8}
								step={1}
							/>
						</div>
						<div className="mt-4 flex gap-4">
							<div
								className={`${settings.includeLowercase ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!settings.includeLowercase ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-lowercase-switch" className="row">
									<span className="text-xs">Include </span>Lowercase
								</label>
								<Switch
									id="include-lowercase-switch"
									checked={settings.includeLowercase}
									onCheckedChange={(checked) => {
										handleSettingChange('includeLowercase', checked);
									}}
								/>
							</div>
							<div
								className={`${settings.includeUppercase ? "border-4 p-2" : "border p-[11px]"}  rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!settings.includeUppercase ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-uppercase-switch" className="row">
									<span className="text-xs">Include </span>Uppercase
								</label>
								<Switch
									id="include-uppercase-switch"
									checked={settings.includeUppercase}
									onCheckedChange={(checked) => {
										handleSettingChange('includeUppercase', checked);
									}}
								/>
							</div>
							<div
								className={`${settings.includeNumbers ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!settings.includeNumbers ? "opacity-50" : ""}`}
							>
								<label htmlFor="include-numbers-switch" className="row">
									<span className="text-xs">Include </span>Numbers
								</label>
								<Switch
									id="include-numbers-switch"
									checked={settings.includeNumbers}
									onCheckedChange={(checked) => {
										handleSettingChange('includeNumbers', checked);
									}}
								/>
							</div>
						</div>
						<div
							className={`  ${settings.includeSymbols ? "border-4 p-2" : "border p-[11px]"} rounded-2xl mt-4`}
						>
							<div
								className={`flex flex-col  mb-1  ${!settings.includeSymbols ? "opacity-50" : ""} transition-opacity duration-300`}
							>
								<label htmlFor="include-symbols-switch" className="row">
									<span className="text-xs">Include </span>Symbols
								</label>
								<Switch
									id="include-symbols-switch"
									className="ml-4"
									checked={settings.includeSymbols}
									onCheckedChange={(checked) => {
										handleSettingChange('includeSymbols', checked);
									}}
								/>
							</div>

							<SymbolSelector
								selectedSymbols={settings.customSymbols}
								onSymbolsChange={(symbols) => {
									handleSettingChange('customSymbols', symbols);
								}}
								disabled={!settings.includeSymbols}
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
