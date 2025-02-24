"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PasswordDisplayProps {
  password: string
  generatePass: () => void // ここに generatePass プロパティを追加
  isDarkMode: boolean
}

export default function PasswordDisplay({
  password: displayedPassword,
  generatePass,
  isDarkMode,
}: PasswordDisplayProps) {
  // const [key, setKey] = useState(0)
  // const [isPending, setIsPending] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isIconClicked, setIsIconClicked] = useState(false)
  // const [currentPassword, setCurrentPassword] = useState<string>("")

  // useEffect(() => {
  //   if (currentPassword) {
  //     const newEntry = {
  //       id: crypto.randomUUID(),
  //       password: currentPassword,
  //       createdAt: new Date().toLocaleString(),
  //       isFavorite: false,
  //     }
  //     const storedHistory = sessionStorage.getItem("passwordHistory")
  //     const history = storedHistory ? JSON.parse(storedHistory) : []
  //     history.unshift(newEntry)
  //     sessionStorage.setItem("passwordHistory", JSON.stringify(history.slice(0, 10))) // Keep only the last 10 passwords
  //   }
  // }, [currentPassword])

  // const handleGeneratePassword = () => {
  //   setIsPending(true)
  //   setTimeout(() => {
  //     setKey((prevKey) => prevKey + 1)
  //     setIsPending(false)
  //   }, 1200)
  // }

  const copyToClipboard = () => {
    const passwordElement = document.querySelector(".password-text")
    if (passwordElement) {
      navigator.clipboard.writeText(passwordElement.textContent || "")
      setIsCopied(true)
      setIsIconClicked(true)
      setTimeout(() => {
        setIsCopied(false)
        setIsIconClicked(false)
      }, 1000) // 1秒後にリセット
    }
  }

  return (
    <motion.div
      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-between overflow-visible relative`}
      // animate={
      //   shake
      //     ? {
      //         y: [0, -3, 3, -2, 2, -1, 1, 0],
      //         transition: { duration: 1.2, ease: "easeInOut" },
      //       }
      //     : {}
      // }
      animate={{
        scaleX: [1, 1, 1.1, 1],       // 横方向の縮みと拡大
        rotateZ: [0, -1, 1, 0],        // Z軸（2D回転）のひねり
        rotateY: [0, 2, -2, 0],        // Y軸（3D奥行き回転）のひねり
      }}
    >
      <div className="password-text flex-grow mr-4 min-h-16 flex items-center overflow-hidden" style={{ perspective:1000}}>
        <AnimatePresence mode="wait">
          {/* {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center"
            >
              生成中...
            </motion.div>
          ) : ( */}
            <motion.div
              // key={`password-${key}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full break-all text-lg"
            >
              <span className="font-mono">{displayedPassword}</span>
            
            </motion.div>
          {/* )} */}
        </AnimatePresence>
      </div>
      <div className="flex space-x-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={generatePass}
            // disabled={isPending}
            className="hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <RefreshCw
              className="h-4 w-4  group-hover:text-primary transition-colors duration-200"
            />
          </Button>
        </motion.div>
        
        {/* copyボタン */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isCopied ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5 ,ease: "easeInOut"  }}
          className="relative"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            // disabled={isPending}
            className="hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Copy
              className={`h-4 w-4 group-hover:text-primary transition-colors duration-200 ${isCopied ? "text-green-500" : ""} ${isIconClicked ? "stroke-[3px]" : "stroke-[2px]"}`}
            />
          </Button>
          <AnimatePresence>
            {isCopied && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

