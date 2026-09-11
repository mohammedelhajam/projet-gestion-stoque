import { useState, useEffect } from 'react'
import { Search, Calculator } from 'lucide-react'
import { adjustmentService, productService, warehouseService } from '../../services/dataService'
import type { StockAdjustment, Product, Warehouse } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Button from '../../components/common/Button/Button'
import Loading from '../../components/common/Loading/Loading'
import Input from '../../components/common/Input/Input'
import Modal from '../../components/common/Modal/Modal'
import { formatDate } from '../../utils/helpers'

const StockAdjustments = () => {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    systemStock: 0,
    realStock: 0,
    reason: ''
  })
  const [calculatedDifference, setCalculatedDifference] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adjustmentsData, productsData, warehousesData] = await Promise.all([
          adjustmentService.getAdjustments(),
          productService.getProducts(),
          warehouseService.getWarehouses()
        ])
        setAdjustments(adjustmentsData || [])
        setProducts(productsData || [])
        setWarehouses(warehousesData || [])
      } catch (error) {
        console.error('Erreur chargement:', error)
        // Données par défaut si erreur
        setAdjustments([])
        setProducts([])
        setWarehouses([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.systemStock >= 0 && formData.realStock >= 0) {
      setCalculatedDifference(formData.realStock - formData.systemStock)
    } else {
      setCalculatedDifference(0)
    }
  }, [formData.systemStock, formData.realStock])

  const filteredAdjustments = Array.isArray(adjustments) ? adjustments.filter(a =>
    (a.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleOpenModal = () => {
    setFormData({
      productId: '',
      warehouseId: '',
      systemStock: 0,
      realStock: 0,
      reason: ''
    })
    setCalculatedDifference(0)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId)
    setFormData({
      ...formData,
      productId,
      systemStock: product?.stock || 0
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const product = products.find(p => p.id === formData.productId)
      const warehouse = warehouses.find(w => w.id === formData.warehouseId)
      
      await adjustmentService.createAdjustment({
        ...formData,
        difference: calculatedDifference,
        date: new Date().toISOString(),
        userId: 'user1',
        productName: product?.name || '',
        warehouseName: warehouse?.name || '',
      })
      
      const updatedAdjustments = await adjustmentService.getAdjustments()
      setAdjustments(updatedAdjustments || [])
      handleCloseModal()
    } catch (error) {
      console.error('Erreur création ajustement:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Ajustements de stock</h1>
          <p className="text-secondary-500 mt-1">{adjustments.length} ajustements au total</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Calculator size={18} className="mr-2" />
          Nouvel ajustement
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <Input
          placeholder="Rechercher un ajustement..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Entrepôt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Système</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Réel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Différence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Raison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdjustments.map((adjustment) => (
                <tr key={adjustment.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-secondary-900">{adjustment.productName || '-'}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{adjustment.warehouseName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-secondary-900">{adjustment.systemStock || 0}</td>
                  <td className="px-6 py-4 text-sm text-secondary-900">{adjustment.realStock || 0}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={(adjustment.difference || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {(adjustment.difference || 0) >= 0 ? '+' : ''}{adjustment.difference || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-500">{formatDate(adjustment.date)}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{adjustment.reason || '-'}</td>
                </tr>
              ))}
              {filteredAdjustments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-secondary-500">
                    Aucun ajustement trouvé
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
        title="Nouvel ajustement de stock"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Produit *
            </label>
            <select
              required
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez un produit</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku}) - Stock: {p.stock}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Entrepôt *
            </label>
            <select
              required
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez un entrepôt</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Stock système
              </label>
              <input
                type="number"
                value={formData.systemStock}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
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
          </div>

          <div className="bg-secondary-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Différence calculée:</span>
              <span className={`text-lg font-bold ${calculatedDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedDifference >= 0 ? '+' : ''}{calculatedDifference}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Raison *
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
              placeholder="Raison de l'ajustement..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={submitting}>
              Valider l'ajustement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default StockAdjustments