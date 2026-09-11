import { cn } from '../../../utils/helpers'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Loading = ({ size = 'md', className }: LoadingProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className={cn(
        `${sizes[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`,
        className
      )} />
    </div>
  )
}

export default Loading