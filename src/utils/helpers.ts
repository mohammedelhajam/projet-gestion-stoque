import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatDateShort = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export const getStatusConfig = (status: string) => {
  const configs = {
    in_stock: { label: 'En stock', variant: 'success' as const },
    low_stock: { label: 'Stock faible', variant: 'warning' as const },
    out_of_stock: { label: 'Rupture', variant: 'danger' as const },
    pending: { label: 'En attente', variant: 'warning' as const },
    completed: { label: 'Terminé', variant: 'success' as const },
    cancelled: { label: 'Annulé', variant: 'danger' as const },
  }
  return configs[status as keyof typeof configs] || { label: status, variant: 'secondary' as const }
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}