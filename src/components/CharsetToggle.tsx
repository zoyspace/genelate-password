"use client";

import { Switch } from "@/components/ui/switch";

type CharsetToggleProps = {
	id: string;
	label: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
};

export function CharsetToggle({
	id,
	label,
	checked,
	onCheckedChange,
}: CharsetToggleProps) {
	return (
		<div
			className={`${checked ? "border-4 p-2" : "border p-[11px]"} rounded-2xl flex-1 flex flex-col items-center transition-opacity duration-300 ${!checked ? "opacity-50" : ""}`}
		>
			<label htmlFor={id} className="row">
				<span className="text-xs">Include </span>
				{label}
			</label>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</div>
	);
}
