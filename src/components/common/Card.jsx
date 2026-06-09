import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const Card = ({
  children,
  hoverEffect = false,
  glow = false,
  glowColor = "primary", // "primary" | "secondary" | "accent"
  className = "",
  onClick,
  ...props
}) => {
  const CardComponent = onClick ? motion.div : "div";

  const glowStyles = {
    primary: "shadow-[0_0_20px_rgba(0,200,150,0.15)] border-primary/20",
    secondary: "shadow-[0_0_20px_rgba(26,115,232,0.15)] border-secondary/20",
    accent: "shadow-[0_0_20px_rgba(255,215,0,0.15)] border-accent/20"
  };

  const interactiveProps = onClick
    ? {
        whileHover: hoverEffect ? { scale: 1.015, y: -2 } : {},
        whileTap: { scale: 0.99 },
        onClick,
        style: { cursor: "pointer" }
      }
    : {};

  return (
    <CardComponent
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
        glow ? glowStyles[glowColor] : "",
        hoverEffect && !onClick ? "hover:translate-y-[-4px] hover:shadow-xl hover:border-white/15 dark:hover:border-white/15" : "",
        className
      )}
      {...interactiveProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
