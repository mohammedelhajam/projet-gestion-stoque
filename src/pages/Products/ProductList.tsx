import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye
} from 'lucide-react'
import { productService, categoryService } from '../../services/dataService'
import type { Product, Category } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Loading from '../../components/common/Loading/Loading'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import { formatPrice, formatDateShort, getStatusConfig } from '../../utils/helpers'

const ProductList = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(id)
        await loadData()
      } catch (error) {
        console.error('Erreur suppression:', error)
      }
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : categoryId
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Produits</h1>
          <p className="text-secondary-500 mt-1">{products.length} produits au total</p>
        </div>
        <Button onClick={() => navigate('/products/create')}>
          <Plus size={18} className="mr-2" />
          Ajouter un produit
        </Button>
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
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">Tous statuts</option>
              <option value="in_stock">En stock</option>
              <option value="low_stock">Stock faible</option>
              <option value="out_of_stock">Rupture</option>
            </select>
          </div>
        </div>
      </div>

      {paginatedProducts.length === 0 ? (
        <EmptyState
          title="Aucun produit trouvé"
          description="Aucun produit ne correspond à vos critères de recherche"
          action={
            <Button variant="secondary" onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedStatus('all')
            }}>
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Créé le</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map((product) => {
                  const statusConfig = getStatusConfig(product.status)
                  return (
                    <tr key={product.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-4 py-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/64748b/ffffff?text=No+Image'
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-secondary-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-secondary-600 font-mono">{product.sku}</td>
                      <td className="px-4 py-3 text-sm text-secondary-600">{getCategoryName(product.categoryId)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-secondary-900">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3 text-sm text-secondary-900">{product.stock}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig.variant as any}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-500">{formatDateShort(product.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-400 hover:text-secondary-600 transition-colors"
                            title="Voir"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/products/${product.id}/edit`)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-primary-400 hover:text-primary-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-red-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredProducts.length}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList