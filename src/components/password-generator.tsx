"use client"

import { useEffect, useState } from "react"
function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  customSymbols: string[]
): string {
  let charset = 'abcdefghijklmnopqrstuvwxyz'
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeNumbers) charset += '0123456789'
  if (includeSymbols) charset += customSymbols.join('')

  let newPassword = ''
  for (let i = 0; i < length; i++) {
    newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return newPassword
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
  const displayedPassword = sessionStorage.getItem("currentPassword") ?? "";
  const [password, setPassword] = useState<string>(displayedPassword)

  useEffect(() => {
    const fetchPassword = async () => {
      if (shouldGeneratePassword) {
        const newPassword =  generatePassword(
          length,
          includeUppercase,
          includeNumbers,
          includeSymbols,
          customSymbols,
        )
        setPassword(newPassword)
        onPasswordGenerate(newPassword)
        sessionStorage.setItem("currentPassword", newPassword)
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

