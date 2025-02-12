"use client"

import { useEffect, useState } from "react"

interface GeneratePasswordOptions {
  length: number
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  customSymbols: string[]
}

const generatePassword = (options: GeneratePasswordOptions): string => {
  const {
    length,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    customSymbols,
  } = options

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''
  const numberChars = includeNumbers ? '0123456789' : ''
  const symbolChars = includeSymbols ? customSymbols.join('') : ''

  const allChars = lowercaseChars + uppercaseChars + numberChars + symbolChars

  if (!allChars.length) {
    throw new Error('At least one character type must be selected')
  }

  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length)
    password += allChars[randomIndex]
  }

  return password
}

interface PasswordGeneratorProps {
  length: number
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  customSymbols: string[]
  onPasswordGenerate: (password: string) => void
  shouldGeneratePassword: boolean
}

export default function PasswordGenerator({
  length,
  includeUppercase,
  includeNumbers,
  includeSymbols,
  customSymbols,
  onPasswordGenerate,
  shouldGeneratePassword,
}: PasswordGeneratorProps) {
  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentPassword") || ""
    }
    return ""
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const fetchPassword = async () => {
      if (shouldGeneratePassword) {
        const newPassword = generatePassword({
          length,
          includeUppercase,
          includeNumbers,
          includeSymbols,
          customSymbols,
        })
        setPassword(newPassword)
        onPasswordGenerate(newPassword)
        localStorage.setItem("currentPassword", newPassword)
      }
    }
    fetchPassword()
  }, [
    length,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    customSymbols,
    onPasswordGenerate,
    shouldGeneratePassword,
  ])

  return <span className="font-mono">{password}</span>
}

