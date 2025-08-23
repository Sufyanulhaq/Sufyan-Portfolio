"use client"

import { motion, useInView } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ScrollAnimateProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  once?: boolean
  amount?: number
}

export default function ScrollAnimate({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.6,
  once = true,
  amount = 0.3
}: ScrollAnimateProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  const getDirectionalVariants = () => {
    const baseVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    }

    switch (direction) {
      case "up":
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: distance },
          visible: { ...baseVariants.visible, y: 0 }
        }
      case "down":
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: -distance },
          visible: { ...baseVariants.visible, y: 0 }
        }
      case "left":
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: distance },
          visible: { ...baseVariants.visible, x: 0 }
        }
      case "right":
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -distance },
          visible: { ...baseVariants.visible, x: 0 }
        }
      default:
        return baseVariants
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={getDirectionalVariants()}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}
