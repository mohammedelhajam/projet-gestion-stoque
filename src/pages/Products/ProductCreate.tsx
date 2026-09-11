import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService, categoryService } from '../../services/dataService'
import type { Category } from '../../types'
import ProductForm from '../../components/forms/ProductForm/ProductForm'
import Loading from '../../components/common/Loading/Loading'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/common/Button/Button'

const ProductCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Erreur chargement catégories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await productService.createProduct(data)
      navigate('/products')
    } catch (error) {
      console.error('Erreur création produit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loadingCategories) return <Loading />

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Ajouter un produit</h1>
          <p className="text-secondary-500 mt-1">Créez un nouveau produit dans votre catalogue</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ProductForm
          onSubmit={onSubmit}
          isLoading={loading}
          categories={categories.map(c => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  )
}

export default ProductCreate