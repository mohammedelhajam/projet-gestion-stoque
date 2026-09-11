import { useEffect, useState } from 'react'
import { 
  Package, 
  Tags, 
  Warehouse, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { productService, warehouseService } from '../../services/dataService'
import type { Product, Warehouse as WarehouseType, StockMovement } from '../../types'
import Badge from '../../components/common/Badge/Badge'
import Loading from '../../components/common/Loading/Loading'
import { formatPrice } from '../../utils/helpers'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: {
    value: number
    label: string
  }
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-secondary-500">{title}</p>
        <p className="text-2xl font-bold text-secondary-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        <div className={`text-${color}-600`}>{icon}</div>
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center text-sm">
        {trend.value > 0 ? (
          <ArrowUpRight className="text-green-500 w-4 h-4 mr-1" />
        ) : (
          <ArrowDownRight className="text-red-500 w-4 h-4 mr-1" />
        )}
        <span className={trend.value > 0 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(trend.value)}%
        </span>
        <span className="text-secondary-400 ml-1">{trend.label}</span>
      </div>
    )}
  </div>
)

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStock: 0,
    lowStock: 0,
    outOfStock: 0,
  })

  const movementData = [
    { name: 'Jan', entrées: 120, sorties: 80 },
    { name: 'Fév', entrées: 150, sorties: 90 },
    { name: 'Mar', entrées: 110, sorties: 130 },
    { name: 'Avr', entrées: 180, sorties: 140 },
    { name: 'Mai', entrées: 200, sorties: 160 },
    { name: 'Juin', entrées: 170, sorties: 190 },
  ]

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, warehousesData] = await Promise.all([
          productService.getProducts(),
          warehouseService.getWarehouses()
        ])
        setProducts(productsData)
        setWarehouses(warehousesData)
        
        const totalStock = productsData.reduce((acc, p) => acc + p.stock, 0)
        const lowStock = productsData.filter(p => p.status === 'low_stock').length
        const outOfStock = productsData.filter(p => p.status === 'out_of_stock').length
        const categories = [...new Set(productsData.map(p => p.categoryId))]
        
        setStats({
          totalProducts: productsData.length,
          totalCategories: categories.length,
          totalStock,
          lowStock,
          outOfStock,
        })
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) return <Loading />

  const stockByWarehouse = warehouses.map((wh) => ({
    name: wh.name,
    value: products
      .filter(p => p.categoryId === wh.id || Math.random() > 0.5)
      .reduce((acc, p) => acc + p.stock, 0) || Math.floor(Math.random() * 300) + 50,
  }))

  const recentMovements = products.slice(0, 5).map((p, i) => ({
    id: `mov-${i}`,
    productName: p.name,
    sku: p.sku,
    type: ['in', 'out', 'in', 'transfer', 'out'][i] as 'in' | 'out' | 'transfer' | 'adjustment',
    quantity: Math.floor(Math.random() * 20) + 1,
    warehouseName: warehouses[i % warehouses.length]?.name || 'N/A',
    date: new Date(Date.now() - i * 86400000).toISOString(),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Tableau de bord</h1>
        <p className="text-secondary-500 mt-1">Vue d'ensemble de votre gestion de stock</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total produits"
          value={stats.totalProducts}
          icon={<Package size={24} />}
          color="blue"
          trend={{ value: 12, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Catégories"
          value={stats.totalCategories}
          icon={<Tags size={24} />}
          color="green"
        />
        <StatCard
          title="Stock total"
          value={stats.totalStock}
          icon={<Warehouse size={24} />}
          color="purple"
          trend={{ value: -5, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Alertes stock"
          value={stats.lowStock + stats.outOfStock}
          icon={<AlertTriangle size={24} />}
          color="yellow"
        />
      </div>

      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-600 w-5 h-5 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Attention - Stocks critiques</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {stats.lowStock} produit(s) en stock faible et {stats.outOfStock} produit(s) en rupture.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Mouvements de stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entrées" fill="#3b82f6" />
              <Bar dataKey="sorties" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Stocks par entrepôt</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockByWarehouse}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockByWarehouse.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">Derniers mouvements</h3>
          <Clock size={18} className="text-secondary-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Entrepôt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-secondary-900">{movement.productName}</td>
                  <td className="px-6 py-4">
                    <Badge variant={movement.type === 'in' ? 'success' : movement.type === 'out' ? 'danger' : 'info'}>
                      {movement.type === 'in' ? 'Entrée' : movement.type === 'out' ? 'Sortie' : movement.type === 'transfer' ? 'Transfert' : 'Ajustement'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-900">
                    {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600">{movement.warehouseName}</td>
                  <td className="px-6 py-4 text-sm text-secondary-500">
                    {new Date(movement.date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard