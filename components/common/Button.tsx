import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-primary/20 text-text-light-primary hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


