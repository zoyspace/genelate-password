"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PasswordHistory } from "@/components/PasswordHistory"
import { FavoritePasswords } from "@/components/FavoritePasswords"
import { motion } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"
import { useState } from "react"

export default function HistoryPage() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center bg-gradient-to-br ${isDarkMode ? "from-gray-900 to-gray-800" : "from-blue-100 to-purple-100"} transition-colors duration-500 p-2`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className={`w-full max-w-md p-4 pt-8 pb-28 rounded-xl shadow-2xl 
            ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} transition-colors duration-500`}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">パスワード履歴</h1>
            <Link href="/">
              <Button variant="outline">戻る</Button>
            </Link>
          </div>
          
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 ${activeTab === 'history' ? 
                (isDarkMode ? 'border-b-2 border-blue-500 text-blue-500' : 'border-b-2 border-blue-600 text-blue-600') : 
                ''} font-medium`}
              onClick={() => setActiveTab('history')}
            >
              履歴
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'favorites' ? 
                (isDarkMode ? 'border-b-2 border-red-500 text-red-500' : 'border-b-2 border-red-600 text-red-600') : 
                ''} font-medium`}
              onClick={() => setActiveTab('favorites')}
            >
              お気に入り
            </button>
          </div>
          
          {activeTab === 'history' ? <PasswordHistory /> : <FavoritePasswords />}
        </div>
      </motion.div>
    </div>
  )
}

