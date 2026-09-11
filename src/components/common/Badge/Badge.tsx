import React from 'react'
import { cn } from '../../../utils/helpers'

export interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary'
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md'
}

const Badge = ({ variant, children, className, size = 'md' }: BadgeProps) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      variants[variant],
      sizes[size],
      className
    )}>
      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {children}
    </span>
  )
}

export default Badge