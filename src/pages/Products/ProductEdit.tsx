import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService, categoryService } from '../../services/dataService'
import type { Product, Category } from '../../types'
import ProductForm from '../../components/forms/ProductForm/ProductForm'
import Loading from '../../components/common/Loading/Loading'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/common/Button/Button'

const ProductEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          productService.getProductById(id!),
          categoryService.getCategories()
        ])
        setProduct(productData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Erreur chargement:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const onSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      await productService.updateProduct(id!, data)
      navigate(`/products/${id}`)
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    } finally {
      setSubmitting(false)
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

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/products/${id}`)}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Modifier le produit</h1>
          <p className="text-secondary-500 mt-1">{product?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {product && (
          <ProductForm
            initialData={product}
            onSubmit={onSubmit}
            isLoading={submitting}
            categories={categories.map(c => ({ id: c.id, name: c.name }))}
          />
        )}
      </div>
    </div>
  )
}

export default ProductEdit