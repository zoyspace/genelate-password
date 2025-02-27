"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PasswordHistory } from "@/components/PasswordHistory"
import { motion } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"

export default function HistoryPage() {
  const { isDarkMode } = useTheme();

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
            <h1 className="text-3xl font-bold mr-12">Password History</h1>
            <Link href="/">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
          <PasswordHistory />
        </div>
      </motion.div>
    </div>
  )
}

