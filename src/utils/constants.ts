export const PRODUCT_STATUSES = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
} as const

export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
} as const

export const TRANSFER_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const ITEMS_PER_PAGE = 10