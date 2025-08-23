"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FloatingProps {
  children: ReactNode
  className?: string
  duration?: number
  y?: number
}

export default function Floating({ 
  children, 
  className = "",
  duration = 6,
  y = 10
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [0, y, 0],
        rotate: [0, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
