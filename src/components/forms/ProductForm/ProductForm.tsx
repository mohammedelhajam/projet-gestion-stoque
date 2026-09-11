import { useForm } from 'react-hook-form'
import type { Product } from '../../../types'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'

interface ProductFormData {
  name: string
  sku: string
  description: string
  price: number
  categoryId: string
  stock: number
  image: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
  categories: { id: string; name: string }[]
}

const ProductForm = ({ initialData, onSubmit, isLoading, categories }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      sku: initialData.sku,
      description: initialData.description,
      price: initialData.price,
      categoryId: initialData.categoryId,
      stock: initialData.stock,
      image: initialData.image,
      status: initialData.status,
    } : {
      name: '',
      sku: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      image: '',
      status: 'in_stock',
    }
  })

  const watchPrice = watch('price')
  const watchStock = watch('stock')
  const watchStatus = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Nom du produit *"
            placeholder="Entrez le nom du produit"
            {...register('name', { 
              required: 'Le nom est obligatoire',
              minLength: { value: 2, message: 'Minimum 2 caractères' }
            })}
            error={errors.name?.message}
          />
        </div>

        <div>
          <Input
            label="SKU *"
            placeholder="Entrez le SKU"
            {...register('sku', { 
              required: 'Le SKU est obligatoire',
              minLength: { value: 3, message: 'Minimum 3 caractères' }
            })}
            error={errors.sku?.message}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
            placeholder="Description du produit"
            {...register('description')}
          />
        </div>

        <div>
          <Input
            label="Prix (€) *"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('price', { 
              required: 'Le prix est obligatoire',
              min: { value: 0.01, message: 'Le prix doit être positif' }
            })}
            error={errors.price?.message}
          />
        </div>

        <div>
          <Input
            label="Stock initial *"
            type="number"
            step="1"
            placeholder="0"
            {...register('stock', { 
              required: 'Le stock est obligatoire',
              min: { value: 0, message: 'Le stock doit être positif' }
            })}
            error={errors.stock?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Catégorie *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            {...register('categoryId', { required: 'La catégorie est obligatoire' })}
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <Input
            label="URL de l'image"
            placeholder="https://example.com/image.jpg"
            {...register('image')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Statut</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            {...register('status')}
          >
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>
        </div>
      </div>

      <div className="bg-secondary-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-secondary-700 mb-2">Résumé</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-secondary-500">Prix:</span>
            <span className="ml-2 font-medium">{watchPrice ? `${watchPrice} €` : '-'}</span>
          </div>
          <div>
            <span className="text-secondary-500">Stock:</span>
            <span className="ml-2 font-medium">{watchStock || 0} unités</span>
          </div>
          <div>
            <span className="text-secondary-500">Statut:</span>
            <span className="ml-2 font-medium">
              {watchStatus === 'in_stock' ? 'En stock' : 
               watchStatus === 'low_stock' ? 'Stock faible' : 'Rupture'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {initialData ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm