"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Star, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTheme } from "@/context/ThemeContext"

interface PasswordEntry {
  id: string
  password: string
  createdAt: string
  isFavorite: boolean
}

export function PasswordHistory() {
  const { isDarkMode } = useTheme(); // ThemeContextから取得
  const [history, setHistory] = useState<PasswordEntry[]>([])
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const storedHistory = sessionStorage.getItem("passwordHistory")
    if (storedHistory) {
      try {
        const parsedHistory: PasswordEntry[] = JSON.parse(storedHistory)
        const updatedHistory = parsedHistory.map((entry) => ({
          ...entry,
          id: entry.id || crypto.randomUUID(),
          isFavorite: entry.isFavorite || false,
        }))
        setHistory(updatedHistory)
        sessionStorage.setItem("passwordHistory", JSON.stringify(updatedHistory))
      } catch (error) {
        console.error("Failed to parse history:", error)
        setHistory([])
      }
    } else {
      setHistory([])
    }
  }

  const clearHistory = () => {
    const updatedHistory = history.filter((entry) => entry.isFavorite)
    setHistory(updatedHistory)
    sessionStorage.setItem("passwordHistory", JSON.stringify(updatedHistory))
    setShowClearDialog(false)
  }

  const deleteEntry = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id)
    setHistory(updatedHistory)
    sessionStorage.setItem("passwordHistory", JSON.stringify(updatedHistory))
  }

  const toggleFavorite = (id: string) => {
    const updatedHistory = history.map((entry) =>
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    )
    setHistory(updatedHistory)
    sessionStorage.setItem("passwordHistory", JSON.stringify(updatedHistory))
  }

  const copyToClipboard = (id: string, password: string) => {
    navigator.clipboard.writeText(password)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="destructive" onClick={() => setShowClearDialog(true)}>
          Clear History
        </Button>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            History is empty
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${entry.isFavorite ? "bg-yellow-50 dark:bg-yellow-900/30" : "bg-secondary"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    overflow: "hidden"
                  }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center pl-4">
                      <span className="text-sm text-muted-foreground flex itemsCenter gap-2">
                        {entry.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                        {entry.createdAt}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(entry.id)}>
                          <Star className={`h-4 w-4 ${entry.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} p-4 rounded`}>
                      <div className="font-mono text-sm break-all flex-grow">{entry.password}</div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(entry.id, entry.password)}>
                        <Copy className={`h-4 w-4 ${copiedId === entry.id ? "text-green-500" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear history?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Favorited passwords will be kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearHistory}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

