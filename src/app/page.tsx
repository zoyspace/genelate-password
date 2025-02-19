"use client";

import { useState, useEffect, useCallback } from "react";
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

	
	const [length, setLength] = useState(() => {
		const storedValue = sessionStorage.getItem("passwordLength");
		return storedValue !== null ? Number.parseInt(storedValue, 10) : 12;
	});
	
	const [includeUppercase, setIncludeUppercase] = useState(() => {
		const storedValue = sessionStorage.getItem("includeUppercase");
		return storedValue !== null ? JSON.parse(storedValue) : true;
	});
	
	const [includeNumbers, setIncludeNumbers] = useState(() => {
		const storedValue = sessionStorage.getItem("includeNumbers");
		return storedValue !== null ? JSON.parse(storedValue) : true;
	});
	
	const [includeSymbols, setIncludeSymbols] = useState(() => {
		const storedValue = sessionStorage.getItem("includeSymbols");
		return storedValue !== null ? JSON.parse(storedValue) : false;
	});
	
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const storedValue = sessionStorage.getItem("isDarkMode");
		return storedValue !== null ? JSON.parse(storedValue) : false;
	});
	
	const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
		const storedValue = sessionStorage.getItem("customSymbols");
		return storedValue !== null ? JSON.parse(storedValue) : DEFAULT_SYMBOLS;
	});
	const [shouldGeneratePassword, setShouldGeneratePassword] = useState(() => {// sessionStorage から値を取得し、存在すればパースして使用
		const storedValue = sessionStorage.getItem("shouldGeneratePassword");
		return storedValue !== null ? JSON.parse(storedValue) : true;
	  });
	

	const [isClient, setIsClient] = useState(false);

	

	

	useEffect(() => {
		setIsClient(true);
	  }, []);
	  
	useEffect(() => {
		if (isClient){
		sessionStorage.setItem("passwordLength", length.toString());
		sessionStorage.setItem("includeUppercase", includeUppercase.toString());
		sessionStorage.setItem("includeNumbers", includeNumbers.toString());
		sessionStorage.setItem("isDarkMode", isDarkMode.toString());
		sessionStorage.setItem("customSymbols", JSON.stringify(customSymbols));
		sessionStorage.setItem("includeSymbols", includeSymbols.toString());
		sessionStorage.setItem("shouldGeneratePassword",shouldGeneratePassword.toString());
		

		}
	}, [
		length,
		includeUppercase,
		includeNumbers,
		isDarkMode,
		customSymbols,
		includeSymbols,
		shouldGeneratePassword,
		isClient
	]);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDarkMode);
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prev: boolean) => !prev);
	};

	const handleStateChange = useCallback(() => {
		setShouldGeneratePassword(true);
	}, []);

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
							length={length}
							includeUppercase={includeUppercase}
							includeNumbers={includeNumbers}
							includeSymbols={includeSymbols}
							isDarkMode={isDarkMode}
							customSymbols={customSymbols}
							shouldGeneratePassword={shouldGeneratePassword}
							onStateChange={handleStateChange}
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
									setShouldGeneratePassword(true);
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
									setShouldGeneratePassword(true);
								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span>Include Numbers</span>
							<Switch
								checked={includeNumbers}
								onCheckedChange={(checked) => {
									setIncludeNumbers(checked);
									setShouldGeneratePassword(true);
								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<span>Include Symbols</span>
							<Switch
								checked={includeSymbols}
								onCheckedChange={(checked) => {
									setIncludeSymbols(checked);
									setShouldGeneratePassword(true);
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
									setShouldGeneratePassword(true);
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
