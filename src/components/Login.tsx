"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signIn, signUp } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (isSignUp) {
				await signUp(email, password);
			} else {
				await signIn(email, password);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "認証中にエラーが発生しました");
			} else {
				setError("認証中にエラーが発生しました");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-center text-3xl font-extrabold text-gray-900">
					{isSignUp ? "アカウント作成" : "ログイン"}
				</h2>

				{error && (
					<div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
						{error}
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							メールアドレス
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							パスワード
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							{loading ? "処理中..." : isSignUp ? "登録する" : "ログイン"}
						</button>
					</div>
				</form>

				<div className="text-sm text-center mt-4">
					<button
						type="button"
						onClick={() => setIsSignUp(!isSignUp)}
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{isSignUp
							? "既にアカウントをお持ちの方はこちら"
							: "新規登録はこちら"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
