import { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, Edit3 } from 'lucide-react'
import { inventoryService, productService } from '../../services/dataService'
import type{ PhysicalInventoryRecord, Product } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Button from '../../components/common/Button/Button'
import Loading from '../../components/common/Loading/Loading'
import Input from '../../components/common/Input/Input'
import Modal from '../../components/common/Modal/Modal'
import { formatDate } from '../../utils/helpers'

const PhysicalInventory = () => {
  const [inventories, setInventories] = useState<PhysicalInventoryRecord[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingInventory, setEditingInventory] = useState<PhysicalInventoryRecord | null>(null)
  const [formData, setFormData] = useState({
    productId: '',
    realStock: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoriesData, productsData] = await Promise.all([
          inventoryService.getInventories(),
          productService.getProducts()
        ])
        setInventories(inventoriesData)
        setProducts(productsData)
      } catch (error) {
        console.error('Erreur chargement:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredInventories = inventories.filter(i =>
    (i.productName || i.sku).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = (inventory?: PhysicalInventoryRecord) => {
    if (inventory) {
      setEditingInventory(inventory)
      const product = products.find(p => p.id === inventory.productId)
      setFormData({
        productId: inventory.productId,
        realStock: inventory.realStock
      })
    } else {
      setEditingInventory(null)
      setFormData({
        productId: '',
        realStock: 0
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingInventory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const product = products.find(p => p.id === formData.productId)
      
      if (editingInventory) {
        // Mettre à jour l'inventaire existant
        const updatedInventories = inventories.map(i => 
          i.id === editingInventory.id 
            ? {
                ...i,
                realStock: formData.realStock,
                difference: formData.realStock - i.systemStock
              }
            : i
        )
        setInventories(updatedInventories)
      } else {
        // Créer un nouvel inventaire
        const newInventory = await inventoryService.createInventory({
          productId: formData.productId,
          sku: product?.sku || '',
          systemStock: product?.stock || 0,
          realStock: formData.realStock,
          difference: formData.realStock - (product?.stock || 0),
          status: 'pending',
          date: new Date().toISOString(),
          userId: 'user1',
          productName: product?.name,
        })
        setInventories([...inventories, newInventory])
      }
      
      handleCloseModal()
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleValidate = async (id: string) => {
    try {
      await inventoryService.validateInventory(id)
      const updatedInventories = await inventoryService.getInventories()
      setInventories(updatedInventories)
    } catch (error) {
      console.error('Erreur validation:', error)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { label: 'En attente', variant: 'warning' as const },
      completed: { label: 'Validé', variant: 'success' as const },
      cancelled: { label: 'Annulé', variant: 'danger' as const },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Inventaire physique</h1>
          <p className="text-secondary-500 mt-1">{inventories.length} inventaires au total</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Edit3 size={18} className="mr-2" />
          Nouvel inventaire
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <Input
          placeholder="Rechercher un inventaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} className="text-secondary-400" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Système</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Réel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Différence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventories.map((inventory) => {
                const statusConfig = getStatusConfig(inventory.status)
                return (
                  <tr key={inventory.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-secondary-900">{inventory.productName || inventory.sku}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 font-mono">{inventory.sku}</td>
                    <td className="px-6 py-4 text-sm text-secondary-900">{inventory.systemStock}</td>
                    <td className="px-6 py-4 text-sm text-secondary-900">{inventory.realStock}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={inventory.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {inventory.difference >= 0 ? '+' : ''}{inventory.difference}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{formatDate(inventory.date)}</td>
                    <td className="px-6 py-4">
                      {inventory.status === 'pending' && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleValidate(inventory.id)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-green-400 hover:text-green-600 transition-colors"
                            title="Valider"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(inventory)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-primary-400 hover:text-primary-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 size={16} />
                          </button>
                        </div>
                      )}
                      {inventory.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-xs">Validé</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredInventories.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-secondary-500">
                    Aucun inventaire trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingInventory ? 'Modifier l\'inventaire' : 'Nouvel inventaire physique'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingInventory && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Produit *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="">Sélectionnez un produit</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) - Stock: {p.stock}
                  </option>
                ))}
              </select>
            </div>
          )}

          {editingInventory && (
            <div className="bg-secondary-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-secondary-600">
                Produit: <span className="font-medium text-secondary-900">{editingInventory.productName}</span>
              </p>
              <p className="text-sm text-secondary-600">
                Stock système: <span className="font-medium text-secondary-900">{editingInventory.systemStock}</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Stock réel *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.realStock}
              onChange={(e) => setFormData({ ...formData, realStock: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {formData.productId && !editingInventory && (
            <div className="bg-secondary-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-700">Différence calculée:</span>
                <span className={`text-lg font-bold ${
                  (formData.realStock - (products.find(p => p.id === formData.productId)?.stock || 0)) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.realStock - (products.find(p => p.id === formData.productId)?.stock || 0) >= 0 ? '+' : ''}
                  {formData.realStock - (products.find(p => p.id === formData.productId)?.stock || 0)}
                </span>
              </div>
            </div>
          )}

          {editingInventory && (
            <div className="bg-secondary-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-700">Différence calculée:</span>
                <span className={`text-lg font-bold ${
                  (formData.realStock - editingInventory.systemStock) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.realStock - editingInventory.systemStock >= 0 ? '+' : ''}
                  {formData.realStock - editingInventory.systemStock}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingInventory ? 'Mettre à jour' : 'Créer l\'inventaire'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PhysicalInventory