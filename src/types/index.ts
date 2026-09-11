export interface Category {
  id: string
  name: string
  description: string
  productCount: number
  createdAt: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  code: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'manager' | 'user' | string 
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  categoryId: string
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  sku: string
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  warehouseId: string
  userId: string
  date: string
  comment: string
  productName?: string
  warehouseName?: string
}

export interface StockTransfer {
  id: string
  productId: string
  sourceWarehouseId: string
  destinationWarehouseId: string
  quantity: number
  date: string
  status: 'pending' | 'completed' | 'cancelled'
  comment: string
  productName?: string
  sourceWarehouseName?: string
  destinationWarehouseName?: string
}

export interface StockAdjustment {
  id: string
  productId: string
  warehouseId: string
  systemStock: number
  realStock: number
  difference: number
  reason: string
  date: string
  userId: string
  productName?: string
  warehouseName?: string
}

export interface PhysicalInventoryRecord {
  id: string
  productId: string
  sku: string
  systemStock: number
  realStock: number
  difference: number
  status: 'pending' | 'completed' | 'cancelled'
  date: string
  userId: string
  productName?: string
}