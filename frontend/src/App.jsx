import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';

import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import VendorDashboard from './pages/dashboards/VendorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

import VendorProducts from './pages/vendor/VendorProducts';
import VendorAddProduct from './pages/vendor/VendorAddProduct';
import VendorOrders from './pages/vendor/VendorOrders';

import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
            <Route path="/payment/:orderId" element={<ProtectedRoute role="user"><Payment /></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<ProtectedRoute role="user"><OrderSuccess /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute role="user"><OrderHistory /></ProtectedRoute>} />
            <Route path="/orders/:id/track" element={<ProtectedRoute role="user"><OrderTracking /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute role="user"><CustomerDashboard /></ProtectedRoute>} />

            <Route path="/vendor/dashboard" element={<RoleRoute role="vendor"><VendorDashboard /></RoleRoute>} />
            <Route path="/vendor/products" element={<RoleRoute role="vendor"><VendorProducts /></RoleRoute>} />
            <Route path="/vendor/products/add" element={<RoleRoute role="vendor"><VendorAddProduct /></RoleRoute>} />
            <Route path="/vendor/products/edit/:id" element={<RoleRoute role="vendor"><VendorAddProduct /></RoleRoute>} />
            <Route path="/vendor/orders" element={<RoleRoute role="vendor"><VendorOrders /></RoleRoute>} />

            <Route path="/admin/dashboard" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsers /></RoleRoute>} />
            <Route path="/admin/vendors" element={<RoleRoute role="admin"><AdminVendors /></RoleRoute>} />
            <Route path="/admin/products" element={<RoleRoute role="admin"><AdminProducts /></RoleRoute>} />
            <Route path="/admin/orders" element={<RoleRoute role="admin"><AdminOrders /></RoleRoute>} />
            <Route path="/admin/categories" element={<RoleRoute role="admin"><AdminCategories /></RoleRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
