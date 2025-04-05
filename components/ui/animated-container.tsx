"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

type AnimatedContainerProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale" | "bounce"
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  bounce: {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    },
    exit: { opacity: 0, y: 50 }
  }
}

export default function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  animation = "fadeIn"
}: AnimatedContainerProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={animations[animation].initial}
        animate={animations[animation].animate}
        exit={animations[animation].exit}
        transition={{
          duration,
          delay,
          ...(animations[animation]?.animate?.transition || {})
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 