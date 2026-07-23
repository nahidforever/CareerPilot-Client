"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  amount?: number;
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface MotionItemProps {
  children: ReactNode;
  className?: string;
}

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 28,
  amount = 0.2,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, x, y }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: 0.09,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? undefined : variants}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className }: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -7,
              scale: 1.012,
            }
      }
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

export function SoftFloat({ children, className }: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              y: [0, -7, 0],
              rotate: [0, 1.5, 0],
            }
      }
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulseGlow({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              opacity: [0.22, 0.42, 0.22],
              scale: [0.96, 1.05, 0.96],
            }
      }
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
