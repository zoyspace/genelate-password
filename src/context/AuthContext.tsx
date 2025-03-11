"use client";

import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
	user: any;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<any>;
	signUp: (email: string, password: string) => Promise<any>;
	signOut: () => Promise<void>;
	isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// セッションチェック
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user || null);
			setIsLoggedIn(!!session);
			setLoading(false);
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
