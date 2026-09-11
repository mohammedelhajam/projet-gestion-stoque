import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard/Dashboard'
import ProductList from '../pages/Products/ProductList'
import ProductDetails from '../pages/Products/ProductDetails'
import ProductCreate from '../pages/Products/ProductCreate'
import ProductEdit from '../pages/Products/ProductEdit'
import CategoryList from '../pages/Categories/CategoryList'
import StockOverview from '../pages/Stock/StockOverview'
import StockMovements from '../pages/Stock/StockMovements'
import StockTransfers from '../pages/Stock/StockTransfers'
import StockAdjustments from '../pages/Stock/StockAdjustments'
import PhysicalInventory from '../pages/Stock/PhysicalInventory'
import NotFound from '../pages/NotFound/NotFound'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="stock" element={<StockOverview />} />
        <Route path="stock/movements" element={<StockMovements />} />
        <Route path="stock/transfers" element={<StockTransfers />} />
        <Route path="stock/adjustments" element={<StockAdjustments />} />
        <Route path="stock/inventory" element={<PhysicalInventory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRouter