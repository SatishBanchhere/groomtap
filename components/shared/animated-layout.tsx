"use client"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedLayoutProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3
    }
  }
}

export default function AnimatedLayout({ children, className = "" }: AnimatedLayoutProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`min-h-screen bg-background ${className}`}
    >
      {children}
    </motion.div>
  )
} 