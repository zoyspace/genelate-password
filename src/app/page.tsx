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

export default function PasswordGeneratorPage() {
	// biome-ignore format:
	const DEFAULT_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/'];
	const [length, setLength] = useState(16);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSymbols, setIncludeSymbols] = useState(false);
	const { isDarkMode, toggleDarkMode } = useTheme();
	const [customSymbols, setCustomSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
	const [password, setPassword] = useState<string>("");
	const [includeLowercase, setIncludeLowercase] = useState(true); // 追加: 小文字の有効/無効

	const [isClient, setIsClient] = useState(false);
	const [initialRender, setInitialRender] = useState(true);

	
	  
	  
	// パスワード履歴保存用のヘルパー関数 - useCallbackを削除
	const savePasswordToHistory = (newPassword: string) => {
		const newEntry = {
			id: crypto.randomUUID(),
			password: newPassword,
			createdAt: new Date().toLocaleString(),
			isFavorite: false,
		};

		// パスワード履歴を更新
		const storedHistory = sessionStorage.getItem("passwordHistory");
		const history = storedHistory ? JSON.parse(storedHistory) : [];
		history.unshift(newEntry);
		sessionStorage.setItem(
			"passwordHistory",
			JSON.stringify(history.slice(0, 10)),
		);
	};

	// パスワード生成関数 
	const generatePassword = (
			options: {
				_includeUppercase?: boolean;
				_includeNumbers?: boolean;
				_includeSymbols?: boolean;
				_customSymbols?: string[];
				_length?: number;
				_includeLowercase?: boolean; // 追加: 小文字を含むか
			} = {}
		  ) => {
			const {
				_includeUppercase = includeUppercase,
				_includeNumbers = includeNumbers,
				_includeSymbols = includeSymbols,
				_customSymbols = customSymbols,
				_length = length,
				_includeLowercase = includeLowercase, // 追加
			} = options;
		let charset = "";
		if (_includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"; // 変更: 小文字は条件付き
		if (_includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (_includeNumbers) charset += "0123456789";
		if (_includeSymbols && _customSymbols.length > 0) {
		  charset += _customSymbols.join("");
		}
	  
		let newPassword = "";
		for (let i = 0; i < _length; i++) {
		  newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
		}
	  
		setPassword(newPassword);
		savePasswordToHistory(newPassword);
	  };

	// 初期化 - この処理は一度だけ実行
	useEffect(() => {
		// この処理は一度だけ実行されるべき
		const storedLength = sessionStorage.getItem("passwordLength");
		const storedIncludeUppercase = sessionStorage.getItem("includeUppercase");
		const storedIncludeNumbers = sessionStorage.getItem("includeNumbers");
		const storedIncludeSymbols = sessionStorage.getItem("includeSymbols");
		const storedCustomSymbols = sessionStorage.getItem("customSymbols");
		const storedIncludeLowercase = sessionStorage.getItem("includeLowercase"); // 追加

		if (storedLength !== null) setLength(Number.parseInt(storedLength, 10));
		if (storedIncludeUppercase !== null)
			setIncludeUppercase(JSON.parse(storedIncludeUppercase));
		if (storedIncludeNumbers !== null)
			setIncludeNumbers(JSON.parse(storedIncludeNumbers));
		if (storedIncludeSymbols !== null)
			setIncludeSymbols(JSON.parse(storedIncludeSymbols));
		if (storedCustomSymbols !== null)
			setCustomSymbols(JSON.parse(storedCustomSymbols));
		if (storedIncludeLowercase !== null)
			setIncludeLowercase(JSON.parse(storedIncludeLowercase)); // 追加

		// 履歴から最新のパスワードを取得
		const storedHistory = sessionStorage.getItem("passwordHistory");
		if (storedHistory) {
			const history = JSON.parse(storedHistory);
			if (history.length > 0) {
				// 最新のパスワードを表示
				setPassword(history[0].password);
			} else {
				// 履歴が空の場合は新しいパスワードを生成して設定
				setPassword("empty history");
			}
		} else {
			setPassword("Output Area ");
			// const newPassword = generatePassword(true,true,false,[]);
			// setPassword(newPassword);
			//  generateWithHistory();
		}

		setIsClient(true);
		setInitialRender(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // 初期化は一度だけ実行するので空の依存配列

	// 設定を保存するEffect
	useEffect(() => {
		// 初期レンダリング時は何もしない
		if (!isClient || initialRender) return;

		// 設定をsessionStorageに保存
		sessionStorage.setItem("passwordLength", length.toString());
		sessionStorage.setItem(
			"includeUppercase",
			JSON.stringify(includeUppercase),
		);
		sessionStorage.setItem("includeNumbers", JSON.stringify(includeNumbers));
		sessionStorage.setItem("customSymbols", JSON.stringify(customSymbols));
		sessionStorage.setItem("includeSymbols", JSON.stringify(includeSymbols));
		sessionStorage.setItem("includeLowercase", JSON.stringify(includeLowercase)); // 追加
	}, [
		length,
		includeUppercase,
		includeNumbers,
		customSymbols,
		includeSymbols,
		includeLowercase,
		isClient,
		initialRender,
	]);

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
							// isDarkMode={isDarkMode}
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
									generatePassword({_length: value[0]});
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
								<div className="row">
									<span className="text-xs">Include </span>Lowercase
								</div>
								<Switch
									checked={includeLowercase}
									onCheckedChange={(checked) => {
										setIncludeLowercase(checked);
										generatePassword({_includeLowercase: checked});
									}}
								/>
							</div>
							<div
								className={`${includeUppercase ? "border-4 p-2" : "border p-[11px]"}  rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!includeUppercase ? "opacity-50" : ""}`}
							>
								<div className="row">
									<span className="text-xs">Include </span>Uppercase
								</div>
								<Switch
									checked={includeUppercase}
									onCheckedChange={(checked) => {
										setIncludeUppercase(checked);
										generatePassword({_includeUppercase: checked});
									}}
								/>
							</div>
							<div
								className={`${includeNumbers ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!includeNumbers ? "opacity-50" : ""}`}
							>
								<div className="row">
									<span className="text-xs">Include </span>Numbers
								</div>
								<Switch
									checked={includeNumbers}
									onCheckedChange={(checked) => {
										setIncludeNumbers(checked);
										generatePassword({_includeNumbers: checked});
									}}
								/>
							</div>
						</div>
						<div
							className={` ${includeSymbols ? "border-4 p-2" : "border p-[11px]"} rounded-2xl mt-4`}
						>
							<div
								className={`flex-col  items-center justify-between ${!includeSymbols ? "opacity-50" : ""} transition-opacity duration-300`}
							>
								<div className="row">
									<span className="text-xs">Include </span>Symbols
								</div>
								<Switch
									className="ml-4"
									checked={includeSymbols}
									onCheckedChange={(checked) => {
										setIncludeSymbols(checked);
										generatePassword({_includeSymbols: checked});
									}}
								/>
							</div>

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
