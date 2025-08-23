"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text: string
  speed?: number
  className?: string
  delay?: number
  repeat?: boolean
}

export default function TypingAnimation({
  text,
  speed = 100,
  className = "",
  delay = 0,
  repeat = false
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (repeat) {
      const timer = setTimeout(() => {
        setDisplayText("")
        setCurrentIndex(0)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed, repeat])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-current ml-1"
      />
    </motion.span>
  )
}
