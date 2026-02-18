import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface VariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 active:translate-y-px focus-visible:ring-brand-400",
  secondary:
    "bg-white/12 text-text-50 hover:bg-white/20 active:translate-y-px focus-visible:ring-white/60",
  ghost:
    "bg-transparent text-text-200 hover:bg-white/10 hover:text-white focus-visible:ring-white/60",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const buttonClassName = ({ variant = "primary", size = "md" }: VariantOptions = {}) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
  );

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantOptions {}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => (
  <button className={cn(buttonClassName({ variant, size }), className)} {...props} />
);
