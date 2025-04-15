import { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-amber-700 text-white hover:bg-amber-800',
  secondary: 'bg-white text-amber-700 hover:bg-amber-50',
  outline: 'border border-gray-300 hover:border-amber-700 text-black hover:text-amber-700'
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition';
  const disabledClasses = disabled ? 'bg-gray-400 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function LinkButton({ 
  href, 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = ''
}: LinkButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition text-center inline-block';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {children}
    </Link>
  );
}