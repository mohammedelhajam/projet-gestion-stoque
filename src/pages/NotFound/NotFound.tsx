import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Button from '../../components/common/Button/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-secondary-700 mb-2">Page non trouvée</h2>
        <p className="text-secondary-500 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button onClick={() => navigate('/')}>
          <Home size={18} className="mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}

export default NotFound