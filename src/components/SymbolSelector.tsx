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
	// useState を削除し、props から受け取った selectedSymbols を使用します

	const handleSymbolToggle = (symbol: string) => {
		const newSymbols = selectedSymbols.includes(symbol)
			? selectedSymbols.filter((s) => s !== symbol)
			: [...selectedSymbols, symbol];
		onSymbolsChange(newSymbols);
	};

	const handleSelectAll = () => {
		onSymbolsChange(DEFAULT_SYMBOLS);
	};

	const handleDeselectAll = () => {
		onSymbolsChange([]);
	};

	return (
		<div
			className={`w-full space-y-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
		>
			<div className="flex justify-center mb-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handleSelectAll}
					disabled={disabled}
				>
					全て選択
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleDeselectAll}
					disabled={disabled}
				>
					全て解除
				</Button>
			</div>
			<div className="grid grid-cols-5 gap-4">
				{DEFAULT_SYMBOLS.map((symbol) => (
					<div key={symbol} className="flex items-center space-x-2">
						<Checkbox
							id={`symbol-${symbol}`}
							checked={selectedSymbols.includes(symbol)}
							onCheckedChange={() => handleSymbolToggle(symbol)}
							disabled={disabled}
						/>
						<Label htmlFor={`symbol-${symbol}`}>{symbol}</Label>
					</div>
				))}
			</div>
		</div>
	);
}
