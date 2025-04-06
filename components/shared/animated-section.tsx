"use client"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { ReactNode, useRef, useEffect } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale" | "rotate" | "bounce" | "wave" | "float" | "pulse"
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  },
  slideIn: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  },
  rotate: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 }
  },
  bounce: {
    initial: { y: -10 },
    animate: { 
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 1
      }
    }
  },
  wave: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 14, -8, 14, -4, 10, 0],
      transition: {
        repeat: Infinity,
        duration: 2.5
      }
    }
  },
  float: {
    initial: { y: 0 },
    animate: {
      y: [-20, 0, -20],
      transition: {
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut"
      }
    }
  },
  pulse: {
    initial: { opacity: 1 },
    animate: {
      opacity: [1, 0.5, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  }
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fadeIn"
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("animate")
    }
  }, [isInView, controls])

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        variants={animations[animation]}
        initial="initial"
        animate={controls}
        exit="initial"
        transition={{
          duration: 0.7,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
} 