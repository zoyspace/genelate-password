"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { DEFAULT_SYMBOLS } from "@/lib/constants";

type SymbolSelectorProps = {
	selectedSymbols: string[];
	onSymbolsChange: (symbols: string[]) => void;
	disabled: boolean;
};

export function SymbolSelector({
	selectedSymbols,
	onSymbolsChange,
	disabled,
}: SymbolSelectorProps) {
	const handleSymbolToggle = (symbol: string) => {
		const newSymbols = selectedSymbols.includes(symbol)
			? selectedSymbols.filter((s) => s !== symbol)
			: [...selectedSymbols, symbol];
		onSymbolsChange(newSymbols);
	};

	const allSelected = DEFAULT_SYMBOLS.every((s) => selectedSymbols.includes(s));
	const noneSelected = selectedSymbols.length === 0;

	return (
		<div className="w-full space-y-4 ml-3 mb-2">
			<div className="flex justify-center gap-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onSymbolsChange([...DEFAULT_SYMBOLS])}
					disabled={disabled || allSelected}
				>
					All Select
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onSymbolsChange([])}
					disabled={disabled || noneSelected}
				>
					None Select
				</Button>
			</div>
			<div className={cn("grid grid-cols-5 gap-4", disabled && "opacity-50")}>
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
							className={cn(disabled && "cursor-not-allowed")}
						>
							{symbol}
						</Label>
					</div>
				))}
			</div>
		</div>
	);
}
