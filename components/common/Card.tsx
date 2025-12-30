import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

