"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface FadeInUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export default function FadeInUp({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = "",
  once = true,
  amount = 0.3
}: FadeInUpProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      custom={{ delay, duration }}
      className={className}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}
