"use client"

import { motion } from "framer-motion"
import type { HTMLAttributes } from "react"

interface FadeInUpProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number
  duration?: number
  distance?: number
}

export function FadeInUp({ children, delay = 0, duration = 0.6, distance = 60, ...props }: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
