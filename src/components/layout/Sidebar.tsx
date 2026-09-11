import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Tags, 
  Warehouse, 
  Move, 
  ArrowLeftRight, 
  Settings2, 
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/helpers'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'products', 'stock'
  ])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      id: 'products',
      title: 'Produits',
      icon: Package,
      items: [
        { title: 'Liste des produits', path: '/products', icon: Package },
        { title: 'Ajouter un produit', path: '/products/create', icon: PlusCircle },
        { title: 'Catégories', path: '/categories', icon: Tags },
      ]
    },
    {
      id: 'stock',
      title: 'Stock',
      icon: Warehouse,
      items: [
        { title: 'Vue d\'ensemble', path: '/stock', icon: TrendingUp },
        { title: 'Mouvements', path: '/stock/movements', icon: Move },
        { title: 'Transferts', path: '/stock/transfers', icon: ArrowLeftRight },
        { title: 'Ajustements', path: '/stock/adjustments', icon: Settings2 },
        { title: 'Inventaire', path: '/stock/inventory', icon: ClipboardList },
      ]
    }
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300',
          isOpen ? 'w-64' : 'w-20',
          'lg:w-64'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ERP
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-secondary-900">
                Gestion Stock
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-secondary-100 transition-colors hidden lg:block"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.items ? (
                <>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors',
                      !isOpen && 'lg:hidden'
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon size={20} />
                      {isOpen && <span>{item.title}</span>}
                    </div>
                    {isOpen && (
                      expandedSections.includes(item.id) 
                        ? <ChevronUp size={16} /> 
                        : <ChevronDown size={16} />
                    )}
                  </button>
                  
                  {isOpen && expandedSections.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors',
                              isActive
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-secondary-600 hover:bg-secondary-50'
                            )
                          }
                        >
                          <subItem.icon size={16} />
                          <span>{subItem.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path || '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-600 hover:bg-secondary-50',
                      !isOpen && 'lg:justify-center'
                    )
                  }
                >
                  <item.icon size={20} />
                  {isOpen && <span>{item.title}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar