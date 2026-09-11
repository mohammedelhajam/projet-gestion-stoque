import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Package, DollarSign } from 'lucide-react'
import { productService, categoryService, movementService } from '../../services/dataService'
import type { Product, Category, StockMovement } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Button from '../../components/common/Button/Button'
import Loading from '../../components/common/Loading/Loading'
import { formatPrice, formatDate, getStatusConfig } from '../../utils/helpers'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productService.getProductById(id!)
        setProduct(productData)
        
        const categoryData = await categoryService.getCategoryById(productData.categoryId)
        setCategory(categoryData)
        
        const movementsData = await movementService.getMovementsByProduct(id!)
        setMovements(movementsData)
      } catch (error) {
        console.error('Erreur chargement:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(id!)
        navigate('/products')
      } catch (error) {
        console.error('Erreur suppression:', error)
      }
    }
  }

  if (loading) return <Loading />

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900">Produit non trouvé</h2>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    )
  }

  const statusConfig = getStatusConfig(product.status)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{product.name}</h1>
            <p className="text-secondary-500">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            <Edit size={16} className="mr-2" />
            Modifier
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/64748b/ffffff?text=No+Image'
              }}
            />
            {product.images && product.images.length > 0 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-16 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/64748b/ffffff?text=No+Image'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Nom</p>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">SKU</p>
                <p className="font-medium font-mono">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Catégorie</p>
                <p className="font-medium">{category?.name || product.categoryId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Prix</p>
                <p className="font-medium text-lg text-primary-600">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Stock</p>
                <p className="font-medium">{product.stock} unités</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Statut</p>
                <Badge variant={statusConfig.variant as any}>
                  {statusConfig.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Créé le</p>
                <p className="text-sm">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Modifié le</p>
                <p className="text-sm">{formatDate(product.updatedAt)}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-secondary-500">Description</p>
              <p className="mt-1">{product.description || 'Aucune description'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-secondary-900">
              Historique des mouvements
            </h3>
          </div>
          <div className="overflow-x-auto">
            {movements.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                Aucun mouvement pour ce produit
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Quantité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Entrepôt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Commentaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant={movement.type === 'in' ? 'success' : movement.type === 'out' ? 'danger' : 'info'}>
                          {movement.type === 'in' ? 'Entrée' : movement.type === 'out' ? 'Sortie' : movement.type === 'transfer' ? 'Transfert' : 'Ajustement'}
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
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails