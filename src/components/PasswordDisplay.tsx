"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"

interface PasswordDisplayProps {
  password: string
  generatePass: () => void
}

export default function PasswordDisplay({
  password: displayedPassword,
  generatePass,
}: PasswordDisplayProps) {
  const { isDarkMode } = useTheme();
  const [isCopied, setIsCopied] = useState(false)
  const [isIconClicked, setIsIconClicked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const copyToClipboard = () => {
    if (displayedPassword) {
      navigator.clipboard.writeText(displayedPassword)
      setIsCopied(true)
      setIsIconClicked(true)
      setTimeout(() => {
        setIsCopied(false)
        setIsIconClicked(false)
      }, 1000) // 1秒後にリセット
    }
  }

  const handleGenerateClick = () => {
    setIsAnimating(true)
    generatePass()
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <motion.div
      className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-between overflow-visible relative min-h-[80px]`}
      animate={isAnimating ? {
        scaleX: [1, 0.98, 1.02, 1],
        rotateZ: [0, -1, 1, 0],
        rotateY: [0, 2, -2, 0],
      } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="password-text flex-grow mr-4 min-h-16 flex items-center overflow-hidden" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedPassword}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full break-all text-lg"
          >
            <span className="font-mono">{displayedPassword}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex space-x-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateClick}
            className={`hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${isAnimating ? "pointer-events-none" : ""}`}
          >
            <RefreshCw
              className="h-4 w-4 group-hover:text-primary transition-colors duration-200"
            />
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isCopied ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            disabled={!displayedPassword}
            className="hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Copy
              className={`h-4 w-4 group-hover:text-primary transition-colors duration-200 ${isCopied ? "text-green-500" : ""} ${isIconClicked ? "stroke-[3px]" : "stroke-[2px]"}`}
            />
          </Button>
          <AnimatePresence>
            {isCopied && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
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

