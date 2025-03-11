"use client";

import Login from "@/components/Login";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // すでにログインしている場合はホームページにリダイレクト
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, router]);

  return <Login />;
}
