"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { usePassword } from "@/context/PasswordContext";

export function PasswordHistory() {
  const { isDarkMode } = useTheme();
  const { passwordHistory, toggleFavorite, removeFromHistory } = usePassword();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 mt-6">
      <AnimatePresence initial={false}>
        {passwordHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              No password history yet
            </p>
          </motion.div>
        ) : (
          passwordHistory.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg flex justify-between items-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} relative overflow-hidden`}
            >
              <div className="flex-grow mr-2">
                <p className={`font-mono break-all ${entry.isFavorite ? "font-bold" : ""}`}>{entry.password}</p>
                <p className="text-xs text-gray-500">{entry.createdAt}</p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(entry.password, entry.id)}
                  className="relative"
                >
                  <Copy className="h-4 w-4" />
                  {copiedId === entry.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-8 right-0 text-xs bg-black text-white px-2 py-1 rounded"
                    >
                      Copied!
                    </motion.span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(entry.id)}
                >
                  <Heart className={`h-4 w-4 ${entry.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromHistory(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

