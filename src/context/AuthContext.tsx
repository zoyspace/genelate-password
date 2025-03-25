"use client";

import { createContext, useState, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<any>;
	signUp: (email: string, password: string) => Promise<any>;
	signOut: () => Promise<void>;
	isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	// 最後のSupabaseアクセス時間を記録するref
	const lastAccessTimeRef = useRef<number>(0);

	// アクセス頻度をチェックする関数
	const checkAccessRate = () => {
		const now = Date.now();
		const timeSinceLastAccess = now - lastAccessTimeRef.current;

		// 2秒（2000ミリ秒）以内に再アクセスしようとした場合
		if (lastAccessTimeRef.current > 0 && timeSinceLastAccess < 2000) {
			throw new Error(
				"アクセス頻度が高すぎます。少なくとも2秒間待ってから再試行してください。",
			);
		}

		// 今回のアクセス時間を記録
		lastAccessTimeRef.current = now;
	};

	useEffect(() => {
		// セッションチェック
		const checkSession = async () => {
			try {
				checkAccessRate(); // アクセス頻度チェック
				
				const {
					data: { session },
				} = await supabase.auth.getSession();

				setUser(session?.user || null);
				setIsLoggedIn(!!session);
				setLoading(false);
			} catch (error) {
				console.error("Session check error:", error);
				setLoading(false);
			}
		};

		checkSession();

		// 認証状態変更を購読
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user || null);
			setIsLoggedIn(!!session);
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	// ログイン関数
	async function signIn(email: string, password: string) {
		try {
			checkAccessRate(); // アクセス頻度チェック
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error logging in:", error);
			throw error;
		}
	}

	// サインアップ関数
	async function signUp(email: string, password: string) {
		try {
			checkAccessRate(); // アクセス頻度チェック
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Error signing up:", error);
			throw error;
		}
	}

	// ログアウト関数
	async function signOut() {
		try {
			checkAccessRate(); // アクセス頻度チェック
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Error signing out:", error);
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signIn,
				signUp,
				signOut,
				isLoggedIn,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// カスタムフック
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
