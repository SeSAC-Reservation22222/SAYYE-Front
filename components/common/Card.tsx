import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

