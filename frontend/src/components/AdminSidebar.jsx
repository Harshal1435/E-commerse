import { NavLink, Link } from 'react-router-dom';
import { MdDashboard, MdPeople, MdStorefront, MdInventory, MdShoppingBag, MdCategory } from 'react-icons/md';

const links = [
  { to: '/admin/dashboard', icon: <MdDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/users', icon: <MdPeople size={18} />, label: 'Users' },
  { to: '/admin/vendors', icon: <MdStorefront size={18} />, label: 'Vendors' },
  { to: '/admin/products', icon: <MdInventory size={18} />, label: 'Products' },
  { to: '/admin/orders', icon: <MdShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/categories', icon: <MdCategory size={18} />, label: 'Categories' },
];

const AdminSidebar = () => (
  <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
    <Link to="/" className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 bg-[#2874f0]">
      <span className="text-white font-bold text-lg">ShopZone</span>
      <span className="text-[#ffe500] text-xs font-medium">Admin</span>
    </Link>
    <nav className="py-2">
      {links.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 text-sm transition border-l-2 ${isActive
            ? 'border-[#2874f0] text-[#2874f0] bg-blue-50 font-semibold'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#2874f0]'}`
        }>
          {icon} {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
