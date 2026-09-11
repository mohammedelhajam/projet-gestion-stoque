import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { movementService, productService, warehouseService } from '../../services/dataService'
import type { StockMovement, Product, Warehouse } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Loading from '../../components/common/Loading/Loading'
import Input from '../../components/common/Input/Input'
import Pagination from '../../components/common/Pagination/Pagination'
import { formatDate } from '../../utils/helpers'

const StockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movementsData, productsData, warehousesData] = await Promise.all([
          movementService.getMovements(),
          productService.getProducts(),
          warehouseService.getWarehouses()
        ])
        setMovements(movementsData)
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

  const filteredMovements = movements.filter(m => {
    const matchesSearch = 
      (m.productName || m.sku).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || m.type === filterType
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage)

  const getTypeLabel = (type: string) => {
    const labels = {
      in: 'Entrée',
      out: 'Sortie',
      transfer: 'Transfert',
      adjustment: 'Ajustement'
    }
    return labels[type as keyof typeof labels] || type
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Mouvements de stock</h1>
        <p className="text-secondary-500 mt-1">Historique complet des mouvements</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} className="text-secondary-400" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Tous les types</option>
              <option value="in">Entrées</option>
              <option value="out">Sorties</option>
              <option value="transfer">Transferts</option>
              <option value="adjustment">Ajustements</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Entrepôt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-secondary-900">{movement.productName || movement.sku}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600 font-mono">{movement.sku}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      movement.type === 'in' ? 'success' : 
                      movement.type === 'out' ? 'danger' : 
                      'info'
                    }>
                      {getTypeLabel(movement.type)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {movement.type === 'out' || movement.type === 'adjustment' ? '-' : '+'}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{movement.warehouseName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-secondary-500">{formatDate(movement.date)}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{movement.comment || '-'}</td>
                </tr>
              ))}
              {paginatedMovements.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-secondary-500">
                    Aucun mouvement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredMovements.length}
          />
        </div>
      </div>
    </div>
  )
}

export default StockMovements