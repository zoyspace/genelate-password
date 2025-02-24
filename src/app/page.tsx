"use client";

import { useState, useEffect,  } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordDisplay from "@/components/PasswordDisplay";
import { SymbolSelector } from "@/components/SymbolSelector";
import Link from "next/link";

export default function PasswordGeneratorPage() {
	// biome-ignore format:
	const DEFAULT_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/'];
	const [length, setLength] = useState(12);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [customSymbols, setCustomSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
	const [password, setPassword] = useState<string>("");
	
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
			const storedLength = sessionStorage.getItem("passwordLength");
			const storedIncludeUppercase = sessionStorage.getItem("includeUppercase");
			const storedIncludeNumbers = sessionStorage.getItem("includeNumbers");
			const storedIncludeSymbols = sessionStorage.getItem("includeSymbols");
			const storedIsDarkMode = sessionStorage.getItem("isDarkMode");
			const storedCustomSymbols = sessionStorage.getItem("customSymbols");

			setLength(storedLength !== null ? Number.parseInt(storedLength, 10) : 12);
			setIncludeUppercase(storedIncludeUppercase !== null ? JSON.parse(storedIncludeUppercase) : true);
			setIncludeNumbers(storedIncludeNumbers !== null ? JSON.parse(storedIncludeNumbers) : true);
			setIncludeSymbols(storedIncludeSymbols !== null ? JSON.parse(storedIncludeSymbols) : false);
			setIsDarkMode(storedIsDarkMode !== null ? JSON.parse(storedIsDarkMode) : false);
			setCustomSymbols(storedCustomSymbols !== null ? JSON.parse(storedCustomSymbols) : DEFAULT_SYMBOLS);
		
	}, []);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (isClient) {
			sessionStorage.setItem("passwordLength", length.toString());
			sessionStorage.setItem("includeUppercase", includeUppercase.toString());
			sessionStorage.setItem("includeNumbers", includeNumbers.toString());
			sessionStorage.setItem("isDarkMode", isDarkMode.toString());
			sessionStorage.setItem("customSymbols", JSON.stringify(customSymbols));
			sessionStorage.setItem("includeSymbols", includeSymbols.toString());

			handleGeneratePassword();
			sessionStorage.setItem("shouldGeneratePassword", "true")
		}
	}, [
		length,
		includeUppercase,
		includeNumbers,
		isDarkMode,
		customSymbols,
		includeSymbols,
		isClient,
	]);

	const toggleDarkMode = () => {
		sessionStorage.setItem("shouldGeneratePassword", "false");
		setIsDarkMode((prev: boolean) => {
			const newMode = !prev;
			document.documentElement.classList.toggle("dark", newMode);
			return newMode;
		});
	};

	// useEffect(() => {
	// 	handleGeneratePassword();
	// }, []);

	const handleGeneratePassword = () => {
		const storedShouldGeneratePassword = sessionStorage.getItem("shouldGeneratePassword");
		if (storedShouldGeneratePassword === "false") {
			const storedHistory = sessionStorage.getItem("passwordHistory");
			const history = storedHistory ? JSON.parse(storedHistory) : [];
			const latestHIstory = history.length > 0 ? history[0] : "password"
			setPassword(latestHIstory.password);
		}else{
			generatePass();
		}
	}
	
	const generatePass = () => {
		let charset = 'abcdefghijklmnopqrstuvwxyz'
		if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		if (includeNumbers) charset += '0123456789'
		if (includeSymbols) charset += customSymbols.join('')
	  
		let newPassword = ''
		for (let i = 0; i < length; i++) {
		  newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
		}
	  
		setPassword(newPassword);

		const newEntry = {
			id: crypto.randomUUID(),
			password: newPassword,
			createdAt: new Date().toLocaleString(),
			isFavorite: false,
		  }
		const storedHistory = sessionStorage.getItem("passwordHistory")
      	const history = storedHistory ? JSON.parse(storedHistory) : []
      	history.unshift(newEntry)
      	sessionStorage.setItem("passwordHistory", JSON.stringify(history.slice(0, 10))) // Keep only the last 10 passwords
	}


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
							password	={password}
							generatePass={generatePass} 
							isDarkMode ={isDarkMode}
						/>
						<div>
							<label htmlFor="password-length-slider" className="block mb-2">
								Password Length: {length}
							</label>
							<Slider
								id="password-length-slider"
								value={[length]}
								onValueChange={(value) => {
									setLength(value[0]);
							

								}}
								max={32}
								min={8}
								step={1}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span>Include Uppercase</span>
							<Switch
								checked={includeUppercase}
								onCheckedChange={(checked) => {
									setIncludeUppercase(checked);

								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span>Include Numbers</span>
							<Switch
								checked={includeNumbers}
								onCheckedChange={(checked) => {
									setIncludeNumbers(checked);
								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span>Include Symbols</span>
							<Switch
								checked={includeSymbols}
								onCheckedChange={(checked) => {
									setIncludeSymbols(checked);
								}}
							/>
						</div>
						<div>
							<label htmlFor="custom-symbols-selector" className="block mb-2">
								Custom Symbols
							</label>
							<SymbolSelector
								selectedSymbols={customSymbols}
								onSymbolsChange={(symbols) => {
									setCustomSymbols(symbols);
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
