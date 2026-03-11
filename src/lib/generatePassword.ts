import { CHARSETS } from "./constants";

/**
 * 有効な文字種から文字セットを構築する。
 */
export function buildCharset(options: {
	includeLowercase: boolean;
	includeUppercase: boolean;
	includeNumbers: boolean;
	includeSymbols: boolean;
	customSymbols: string[];
}): string {
	let charset = "";
	if (options.includeLowercase) charset += CHARSETS.lowercase;
	if (options.includeUppercase) charset += CHARSETS.uppercase;
	if (options.includeNumbers) charset += CHARSETS.digits;
	if (options.includeSymbols && options.customSymbols.length > 0) {
		charset += options.customSymbols.join("");
	}
	return charset;
}

/**
 * 暗号論的に安全な乱数を使用してパスワードを生成する。
 * charset が空の場合は "*" を length 個返す。
 */
export function generateSecurePassword(
	charset: string,
	length: number,
): string {
	if (charset.length === 0) {
		return "*".repeat(length);
	}

	const array = new Uint32Array(length);
	crypto.getRandomValues(array);

	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(array[i] % charset.length);
	}
	return password;
}
