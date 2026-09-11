import rawMockData from '../data/mockData.json'
import type {
  Product,
  Category,
  StockMovement,
  StockTransfer,
  StockAdjustment,
  PhysicalInventoryRecord,
  Warehouse,
  User
} from '../types'

interface MockData {
  products: Product[]
  categories: Category[]
  movements: StockMovement[]
  transfers: StockTransfer[]
  adjustments: StockAdjustment[]
  inventories: PhysicalInventoryRecord[]
  warehouses: Warehouse[]
  users: User[]
}

const mockData = rawMockData as unknown as MockData

// Simuler un délai réseau
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================
// 1. CATÉGORIES
// ============================================
export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    await delay()
    return [...mockData.categories]
  },

  getCategoryById: async (id: string): Promise<Category> => {
    await delay()
    const category = mockData.categories.find(c => c.id === id)
    if (!category) throw new Error('Catégorie non trouvée')
    return { ...category }
  },

  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'productCount'>): Promise<Category> => {
    await delay()
    const newCategory: Category = {
      ...data,
      id: `cat${mockData.categories.length + 1}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
    }
    mockData.categories.push(newCategory)
    return { ...newCategory }
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    await delay()
    const index = mockData.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Catégorie non trouvée')
    mockData.categories[index] = { ...mockData.categories[index], ...data }
    return { ...mockData.categories[index] }
  },

  deleteCategory: async (id: string): Promise<void> => {
    await delay()
    const index = mockData.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Catégorie non trouvée')
    mockData.categories.splice(index, 1)
  }
}

// ============================================
// 2. PRODUITS
// ============================================
export const productService = {
  getProducts: async (): Promise<Product[]> => {
    await delay()
    return [ ...mockData.products]
  },

  getProductById: async (id: string): Promise<Product> => {
    await delay()
    const product = mockData.products.find(p => p.id === id)
    if (!product) throw new Error('Produit non trouvé')
    return { ...product }
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay()
    const newProduct: Product = {
      ...data,
      id: `prod${mockData.products.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockData.products.push(newProduct)
    return { ...newProduct }
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay()
    const index = mockData.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Produit non trouvé')
    mockData.products[index] = {
      ...mockData.products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return { ...mockData.products[index] }
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay()
    const index = mockData.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Produit non trouvé')
    mockData.products.splice(index, 1)
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await delay()
    return mockData.products.filter(p => p.categoryId === categoryId)
  },

  getProductsByStatus: async (status: Product['status']): Promise<Product[]> => {
    await delay()
    return mockData.products.filter(p => p.status === status)
  }
}

// ============================================
// 3. MOUVEMENTS
// ============================================
export const movementService = {
  getMovements: async (): Promise<StockMovement[]> => {
    await delay()
    return [...mockData.movements]
  },

  getMovementsByProduct: async (productId: string): Promise<StockMovement[]> => {
    await delay()
    return mockData.movements.filter(m => m.productId === productId)
  },

  getMovementsByType: async (type: StockMovement['type']): Promise<StockMovement[]> => {
    await delay()
    return mockData.movements.filter(m => m.type === type)
  },

  createMovement: async (data: Omit<StockMovement, 'id'>): Promise<StockMovement> => {
    await delay()
    const newMovement: StockMovement = {
      ...data,
      id: `mov${mockData.movements.length + 1}`,
    }
    mockData.movements.push(newMovement)
    return { ...newMovement }
  },

  getMovementsByWarehouse: async (warehouseId: string): Promise<StockMovement[]> => {
    await delay()
    return mockData.movements.filter(m => m.warehouseId === warehouseId)
  }
}

// ============================================
// 4. TRANSFERTS
// ============================================
export const transferService = {
  getTransfers: async (): Promise<StockTransfer[]> => {
    await delay()
    return [...mockData.transfers]
  },

  getTransferById: async (id: string): Promise<StockTransfer> => {
    await delay()
    const transfer = mockData.transfers.find(t => t.id === id)
    if (!transfer) throw new Error('Transfert non trouvé')
    return { ...transfer }
  },

  createTransfer: async (data: Omit<StockTransfer, 'id'>): Promise<StockTransfer> => {
    await delay()
    const newTransfer: StockTransfer = {
      ...data,
      id: `trf${mockData.transfers.length + 1}`,
    }
    mockData.transfers.push(newTransfer)
    return { ...newTransfer }
  },

  updateTransferStatus: async (id: string, status: StockTransfer['status']): Promise<StockTransfer> => {
    await delay()
    const index = mockData.transfers.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Transfert non trouvé')
    mockData.transfers[index].status = status
    return { ...mockData.transfers[index] }
  },

  getTransfersByStatus: async (status: StockTransfer['status']): Promise<StockTransfer[]> => {
    await delay()
    return mockData.transfers.filter(t => t.status === status)
  }
}

// ============================================
// 5. AJUSTEMENTS
// ============================================
export const adjustmentService = {
  getAdjustments: async (): Promise<StockAdjustment[]> => {
    await delay()
    return [...mockData.adjustments]
  },

  getAdjustmentById: async (id: string): Promise<StockAdjustment> => {
    await delay()
    const adjustment = mockData.adjustments.find(a => a.id === id)
    if (!adjustment) throw new Error('Ajustement non trouvé')
    return { ...adjustment }
  },

  createAdjustment: async (data: Omit<StockAdjustment, 'id'>): Promise<StockAdjustment> => {
    await delay()
    const newAdjustment: StockAdjustment = {
      ...data,
      id: `adj${mockData.adjustments.length + 1}`,
    }
    mockData.adjustments.push(newAdjustment)
    return { ...newAdjustment }
  },

  getAdjustmentsByProduct: async (productId: string): Promise<StockAdjustment[]> => {
    await delay()
    return mockData.adjustments.filter(a => a.productId === productId)
  }
}

// ============================================
// 6. INVENTAIRE
// ============================================
export const inventoryService = {
  getInventories: async (): Promise<PhysicalInventoryRecord[]> => {
    await delay()
    return [...mockData.inventories]
  },

  getInventoryById: async (id: string): Promise<PhysicalInventoryRecord> => {
    await delay()
    const inventory = mockData.inventories.find(i => i.id === id)
    if (!inventory) throw new Error('Inventaire non trouvé')
    return { ...inventory }
  },

  createInventory: async (data: Omit<PhysicalInventoryRecord, 'id'>): Promise<PhysicalInventoryRecord> => {
    await delay()
    const newInventory: PhysicalInventoryRecord = {
      ...data,
      id: `inv${mockData.inventories.length + 1}`,
    }
    mockData.inventories.push(newInventory)
    return { ...newInventory }
  },

  validateInventory: async (id: string): Promise<PhysicalInventoryRecord> => {
    await delay()
    const index = mockData.inventories.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Inventaire non trouvé')
    mockData.inventories[index].status = 'completed'
    return {...mockData.inventories[index] }
  },

  getInventoriesByStatus: async (status: PhysicalInventoryRecord['status']): Promise<PhysicalInventoryRecord[]> => {
    await delay()
    return mockData.inventories.filter(i => i.status === status)
  }
}

// ============================================
// 7. ENTREPÔTS
// ============================================
export const warehouseService = {
  getWarehouses: async (): Promise<Warehouse[]> => {
    await delay()
    return [...mockData.warehouses]
  },

  getWarehouseById: async (id: string): Promise<Warehouse> => {
    await delay()
    const warehouse = mockData.warehouses.find(w => w.id === id)
    if (!warehouse) throw new Error('Entrepôt non trouvé')
    return { ...warehouse }
  },

  getWarehouseStock: async (warehouseId: string): Promise<number> => {
    await delay()
    const products = mockData.products
    return products.reduce((acc, p) => acc + p.stock, 0)
  }
}

// ============================================
// 8. UTILISATEURS
// ============================================
export const userService = {
  getUsers: async (): Promise<User[]> => {
    await delay()
    return [...mockData.users]
  },

  getUserById: async (id: string): Promise<User> => {
    await delay()
    const user = mockData.users.find(u => u.id === id)
    if (!user) throw new Error('Utilisateur non trouvé')
    return { ...user }
  },

  getUserRole: async (id: string): Promise<User['role']> => {
    await delay()
    const user = mockData.users.find(u => u.id === id)
    if (!user) throw new Error('Utilisateur non trouvé')
    return user.role
  }
}

// ============================================
// 9. STATISTIQUES
// ============================================
export const statsService = {
  getGlobalStats: async () => {
    await delay()
    const products = mockData.products
    const totalProducts = products.length
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
    const lowStock = products.filter(p => p.status === 'low_stock').length
    const outOfStock = products.filter(p => p.status === 'out_of_stock').length
    const categories = [...new Set(products.map(p => p.categoryId))]

    return {
      totalProducts,
      totalCategories: categories.length,
      totalStock,
      lowStock,
      outOfStock,
      inStock: totalProducts - lowStock - outOfStock,
    }
  },

  getCategoryStats: async () => {
    await delay()
    const products = mockData.products
    const categories = mockData.categories
    
    return categories.map(cat => ({
      ...cat,
      productCount: products.filter(p => p.categoryId === cat.id).length,
      totalStock: products
        .filter(p => p.categoryId === cat.id)
        .reduce((acc, p) => acc + p.stock, 0)
    }))
  },

  getRecentMovements: async (limit: number = 5) => {
    await delay()
    return mockData.movements
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
}

// ============================================
// EXPORT PRINCIPAL
// ============================================
export default {
  categoryService,
  productService,
  movementService,
  transferService,
  adjustmentService,
  inventoryService,
  warehouseService,
  userService,
  statsService,
}