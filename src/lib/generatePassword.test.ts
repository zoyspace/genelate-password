import { describe, expect, it } from "bun:test";
import { buildCharset, generateSecurePassword } from "@/lib/generatePassword";
import { CHARSETS, DEFAULT_SYMBOLS } from "@/lib/constants";

// --- buildCharset ---

describe("buildCharset", () => {
	it("全オプション OFF のとき空文字を返す", () => {
		const result = buildCharset({
			includeLowercase: false,
			includeUppercase: false,
			includeNumbers: false,
			includeSymbols: false,
			customSymbols: [],
		});
		expect(result).toBe("");
	});

	it("lowercase のみ ON", () => {
		const result = buildCharset({
			includeLowercase: true,
			includeUppercase: false,
			includeNumbers: false,
			includeSymbols: false,
			customSymbols: [],
		});
		expect(result).toBe(CHARSETS.lowercase);
	});

	it("uppercase のみ ON", () => {
		const result = buildCharset({
			includeLowercase: false,
			includeUppercase: true,
			includeNumbers: false,
			includeSymbols: false,
			customSymbols: [],
		});
		expect(result).toBe(CHARSETS.uppercase);
	});

	it("digits のみ ON", () => {
		const result = buildCharset({
			includeLowercase: false,
			includeUppercase: false,
			includeNumbers: true,
			includeSymbols: false,
			customSymbols: [],
		});
		expect(result).toBe(CHARSETS.digits);
	});

	it("lowercase + digits", () => {
		const result = buildCharset({
			includeLowercase: true,
			includeUppercase: false,
			includeNumbers: true,
			includeSymbols: false,
			customSymbols: [],
		});
		expect(result).toBe(CHARSETS.lowercase + CHARSETS.digits);
	});

	it("シンボル ON かつ customSymbols が空のとき、シンボルは追加されない", () => {
		const result = buildCharset({
			includeLowercase: false,
			includeUppercase: false,
			includeNumbers: false,
			includeSymbols: true,
			customSymbols: [],
		});
		expect(result).toBe("");
	});

	it("シンボル ON かつ customSymbols に値があるとき追加される", () => {
		const result = buildCharset({
			includeLowercase: false,
			includeUppercase: false,
			includeNumbers: false,
			includeSymbols: true,
			customSymbols: ["!", "@"],
		});
		expect(result).toBe("!@");
	});

	it("全オプション ON（DEFAULT_SYMBOLS 使用）", () => {
		const result = buildCharset({
			includeLowercase: true,
			includeUppercase: true,
			includeNumbers: true,
			includeSymbols: true,
			customSymbols: DEFAULT_SYMBOLS,
		});
		expect(result).toContain(CHARSETS.lowercase);
		expect(result).toContain(CHARSETS.uppercase);
		expect(result).toContain(CHARSETS.digits);
		for (const sym of DEFAULT_SYMBOLS) {
			expect(result).toContain(sym);
		}
	});
});

// --- generateSecurePassword ---

describe("generateSecurePassword", () => {
	it("charset が空のとき '*' を length 個返す", () => {
		expect(generateSecurePassword("", 10)).toBe("**********");
		expect(generateSecurePassword("", 1)).toBe("*");
		expect(generateSecurePassword("", 0)).toBe("");
	});

	it("生成されたパスワードは指定の length になる", () => {
		const charset = CHARSETS.lowercase + CHARSETS.digits;
		expect(generateSecurePassword(charset, 8)).toHaveLength(8);
		expect(generateSecurePassword(charset, 16)).toHaveLength(16);
		expect(generateSecurePassword(charset, 32)).toHaveLength(32);
	});

	it("生成されたパスワードは charset の文字のみから構成される", () => {
		const charset = CHARSETS.digits; // "0123456789"
		const password = generateSecurePassword(charset, 20);
		for (const char of password) {
			expect(charset).toContain(char);
		}
	});

	it("uppercase のみの charset では大文字のみが生成される", () => {
		const charset = CHARSETS.uppercase;
		const password = generateSecurePassword(charset, 20);
		expect(password).toMatch(/^[A-Z]+$/);
	});

	it("同じ charset で2回生成した結果は異なる（確率的テスト）", () => {
		const charset = CHARSETS.lowercase + CHARSETS.uppercase + CHARSETS.digits;
		const p1 = generateSecurePassword(charset, 16);
		const p2 = generateSecurePassword(charset, 16);
		// 16文字で一致する確率は無視できるほど低い
		expect(p1).not.toBe(p2);
	});

	it("length が 0 のとき空文字を返す", () => {
		expect(generateSecurePassword("abc", 0)).toBe("");
	});

	it("length が 1 のとき1文字を返す", () => {
		const result = generateSecurePassword("abc", 1);
		expect(result).toHaveLength(1);
		expect("abc").toContain(result);
	});
});
