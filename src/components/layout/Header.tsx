import { useState } from 'react'
import { Menu, Bell, Search, User, ChevronDown, LogOut, Settings } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=3b82f6&color=fff&size=32',
    role: 'Administrateur'
  }

  const notifications = [
    { id: 1, title: 'Stock faible: AirPods Pro 2', time: 'Il y a 2h', read: false },
    { id: 2, title: 'Nouveau transfert créé', time: 'Il y a 4h', read: false },
    { id: 3, title: 'Inventaire terminé', time: 'Il y a 1j', read: true },
  ]

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-secondary-100 transition-colors lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center flex-1 max-w-xl ml-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={cn(
                      'p-3 hover:bg-secondary-50 cursor-pointer border-b border-gray-100 last:border-0',
                      !notif.read && 'bg-primary-50'
                    )}>
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-secondary-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-secondary-400">{user.role}</p>
              </div>
              <ChevronDown size={16} className="hidden lg:block text-secondary-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-secondary-400">{user.email}</p>
                </div>
                <div className="p-1">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors">
                    <User size={16} />
                    <span>Profil</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors">
                    <Settings size={16} />
                    <span>Paramètres</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors text-red-600">
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header