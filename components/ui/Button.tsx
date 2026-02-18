'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-mflix-red focus-visible:ring-offset-2 focus-visible:ring-offset-mflix-black disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-mflix-red text-white hover:bg-mflix-red-hover active:scale-[0.98]',
      secondary:
        'bg-mflix-gray-500 text-white hover:bg-mflix-gray-400 active:scale-[0.98]',
      ghost:
        'bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]',
      outline:
        'border-2 border-mflix-gray-400 text-white hover:border-mflix-gray-300 hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <motion.div
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className="inline-block"
      >
        <button
          ref={ref}
          type={props.type ?? 'button'}
          className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <>
              {leftIcon}
              {children}
              {rightIcon}
            </>
          )}
        </button>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export default Button;
