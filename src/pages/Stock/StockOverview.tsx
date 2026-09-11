import { useState, useEffect } from 'react'
import { Search, TrendingUp, AlertTriangle, Package, Warehouse } from 'lucide-react'
import { productService, warehouseService } from '../../services/dataService'
import type { Product, Warehouse as WarehouseType } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Loading from '../../components/common/Loading/Loading'
import Input from '../../components/common/Input/Input'
import { getStatusConfig } from '../../utils/helpers'

const StockOverview = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, warehousesData] = await Promise.all([
          productService.getProducts(),
          warehouseService.getWarehouses()
        ])
        setProducts(productsData)
        setWarehouses(warehousesData)
      } catch (error) {
        console.error('Erreur chargement:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStock = products.filter(p => p.status === 'low_stock').length
  const outOfStock = products.filter(p => p.status === 'out_of_stock').length
  const inStock = products.filter(p => p.status === 'in_stock').length

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Vue d'ensemble des stocks</h1>
        <p className="text-secondary-500 mt-1">Gestion complète de votre inventaire</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Stock total</p>
              <p className="text-2xl font-bold text-secondary-900">{totalStock}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">En stock</p>
              <p className="text-2xl font-bold text-green-600">{inStock}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Stock faible</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Rupture</p>
              <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} className="text-secondary-400" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Tous les entrepôts</option>
              {warehouses.map(wh => (
                <option key={wh.id} value={wh.id}>{wh.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const statusConfig = getStatusConfig(product.status)
                return (
                  <tr key={product.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 font-mono">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{product.categoryId}</td>
                    <td className="px-6 py-4 text-sm text-secondary-900">{product.stock}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig.variant as any}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StockOverview