import React from 'react'
import { Package } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
        {icon || <Package className="w-8 h-8 text-secondary-400" />}
      </div>
      <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
      <p className="text-secondary-500 mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState