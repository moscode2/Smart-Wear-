import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAdminAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-blush-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-plum-900 flex flex-col flex-shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-plum-700">
          <p className="text-xs text-blush-300 uppercase tracking-widest mb-1">Admin Panel</p>
          <p className="text-white font-display font-bold text-lg leading-tight">Smart Wear</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                isActive(to)
                  ? "bg-plum-700 text-white"
                  : "text-blush-200 hover:bg-plum-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-plum-700 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blush-200 hover:bg-plum-800 hover:text-white transition text-sm font-medium"
          >
            <Store className="h-4 w-4 flex-shrink-0" />
            View Shop
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-blush-200 hover:bg-red-900/50 hover:text-red-300 transition text-sm font-medium"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}