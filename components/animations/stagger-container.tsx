"use client"

import { motion } from "framer-motion"
import type { HTMLAttributes } from "react"

interface StaggerContainerProps extends HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number
}

export function StaggerContainer({ children, staggerDelay = 0.1, ...props }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
