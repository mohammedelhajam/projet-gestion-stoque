import { useState, useEffect } from 'react'
import { Search, Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import { transferService, productService, warehouseService } from '../../services/dataService'
import type { StockTransfer, Product, Warehouse } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Button from '../../components/common/Button/Button'
import Loading from '../../components/common/Loading/Loading'
import Input from '../../components/common/Input/Input'
import Modal from '../../components/common/Modal/Modal'
import { formatDate } from '../../utils/helpers'

const StockTransfers = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    quantity: 1,
    comment: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transfersData, productsData, warehousesData] = await Promise.all([
          transferService.getTransfers(),
          productService.getProducts(),
          warehouseService.getWarehouses()
        ])
        setTransfers(transfersData)
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

  const filteredTransfers = transfers.filter(t =>
    (t.productName || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenModal = () => {
    setFormData({
      productId: '',
      sourceWarehouseId: '',
      destinationWarehouseId: '',
      quantity: 1,
      comment: ''
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const product = products.find(p => p.id === formData.productId)
      const source = warehouses.find(w => w.id === formData.sourceWarehouseId)
      const dest = warehouses.find(w => w.id === formData.destinationWarehouseId)
      
      await transferService.createTransfer({
        ...formData,
        date: new Date().toISOString(),
        status: 'pending',
        productName: product?.name,
        sourceWarehouseName: source?.name,
        destinationWarehouseName: dest?.name,
      })
      
      const updatedTransfers = await transferService.getTransfers()
      setTransfers(updatedTransfers)
      handleCloseModal()
    } catch (error) {
      console.error('Erreur création transfert:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: StockTransfer['status']) => {
    try {
      await transferService.updateTransferStatus(id, status)
      const updatedTransfers = await transferService.getTransfers()
      setTransfers(updatedTransfers)
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { label: 'En attente', variant: 'warning' as const },
      completed: { label: 'Terminé', variant: 'success' as const },
      cancelled: { label: 'Annulé', variant: 'danger' as const },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Transferts</h1>
          <p className="text-secondary-500 mt-1">{transfers.length} transferts au total</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus size={18} className="mr-2" />
          Nouveau transfert
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <Input
          placeholder="Rechercher un transfert..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => {
                const statusConfig = getStatusConfig(transfer.status)
                return (
                  <tr key={transfer.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-secondary-900">{transfer.productName || ""}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{transfer.sourceWarehouseName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{transfer.destinationWarehouseName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900">{transfer.quantity}</td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{formatDate(transfer.date)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {transfer.status === 'pending' && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleUpdateStatus(transfer.id, 'completed')}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-green-400 hover:text-green-600 transition-colors"
                            title="Valider"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(transfer.id, 'cancelled')}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 text-red-400 hover:text-red-600 transition-colors"
                            title="Annuler"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                      {transfer.status === 'completed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-xs">Validé</span>
                        </div>
                      )}
                      {transfer.status === 'cancelled' && (
                        <div className="flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" />
                          <span className="text-xs">Annulé</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredTransfers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-secondary-500">
                    Aucun transfert trouvé
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
        title="Nouveau transfert"
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
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez un produit</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Entrepôt source *
            </label>
            <select
              required
              value={formData.sourceWarehouseId}
              onChange={(e) => setFormData({ ...formData, sourceWarehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez l'entrepôt source</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Entrepôt destination *
            </label>
            <select
              required
              value={formData.destinationWarehouseId}
              onChange={(e) => setFormData({ ...formData, destinationWarehouseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez l'entrepôt destination</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Quantité *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Commentaire
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
              placeholder="Raison du transfert..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={submitting}>
              Créer le transfert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default StockTransfers