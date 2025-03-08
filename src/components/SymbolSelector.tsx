"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// biome-ignore format:
const DEFAULT_SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', ':', ';', '<', '>', ',', '.', '?', '/'];

interface SymbolSelectorProps {
	selectedSymbols: string[];
	onSymbolsChange: (symbols: string[]) => void;
	disabled: boolean;
}

export function SymbolSelector({
	selectedSymbols,
	onSymbolsChange,
	disabled,
}: SymbolSelectorProps) {
	const handleSymbolToggle = (symbol: string) => {
		if (disabled) return;
		
		const newSymbols = selectedSymbols.includes(symbol)
			? selectedSymbols.filter((s) => s !== symbol)
			: [...selectedSymbols, symbol];
		onSymbolsChange(newSymbols);
	};

	const handleSelectAll = () => {
		if (disabled) return;
		onSymbolsChange([...DEFAULT_SYMBOLS]);
	};

	const handleDeselectAll = () => {
		if (disabled) return;
		onSymbolsChange([]);
	};

	const allSelected = DEFAULT_SYMBOLS.length === selectedSymbols.length;
	const noneSelected = selectedSymbols.length === 0;

	return (
		<div className="w-full space-y-4 ml-3 mb-2">
			<div className="flex justify-center gap-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handleSelectAll}
					disabled={disabled || allSelected}
					className={disabled ? "opacity-50 cursor-not-allowed" : ""}
				>
					All Select
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleDeselectAll}
					disabled={disabled || noneSelected}
					className={disabled ? "opacity-50 cursor-not-allowed" : ""}
				>
					None Select
				</Button>
			</div>
			<div className={`grid grid-cols-5 gap-4 ${disabled ? "opacity-50" : ""}`}>
				{DEFAULT_SYMBOLS.map((symbol) => (
					<div key={symbol} className="flex items-center space-x-2">
						<Checkbox
							id={`symbol-${symbol}`}
							checked={selectedSymbols.includes(symbol)}
							onCheckedChange={() => handleSymbolToggle(symbol)}
							disabled={disabled}
						/>
						<Label
							htmlFor={`symbol-${symbol}`}
							className={disabled ? "cursor-not-allowed" : ""}
						>
							{symbol}
						</Label>
					</div>
				))}
			</div>
		</div>
	);
}
