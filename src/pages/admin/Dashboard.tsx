import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingCart, TrendingUp, Loader, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { supabase } from "../../lib/supabase";
import { formatKSH } from "../../lib/currency";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { signOut } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [{ count: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("id, order_number, customer_name, total, status, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setProductCount(products || 0);
      const allOrders = orders || [];
      setRecentOrders(allOrders);
      setOrderCount(allOrders.length);
      setTotalSales(allOrders.reduce((sum, o) => sum + Number(o.total || 0), 0));
      setPendingCount(allOrders.filter((o) => o.status === "Pending").length);
    } catch {
      // dashboard is best-effort; admin can still navigate to Products/Orders
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Sales", value: formatKSH(totalSales), icon: TrendingUp },
    { title: "Recent Orders", value: orderCount.toString(), icon: ShoppingCart },
    { title: "Products", value: productCount.toString(), icon: Package },
    { title: "Pending Orders", value: pendingCount.toString(), icon: BarChart3 },
  ];

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your store and view recent activity</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="h-8 w-8 text-plum-600 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-plum-600 to-rosegold-600 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-ink">{stat.value}</h2>
                    </motion.div>
                  );
                })}
              </div>

              {/* Orders & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-plum-600" />
                      <h2 className="text-lg font-bold text-ink">Recent Orders</h2>
                    </div>
                    <Link to="/admin/orders" className="text-sm text-plum-600 hover:text-plum-700 font-medium">
                      View all &rarr;
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-ink text-sm">Order #</th>
                            <th className="text-left py-3 px-4 font-semibold text-ink text-sm">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-ink text-sm">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-ink text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-ink text-sm">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-blush-50/50 transition">
                              <td className="py-3 px-4 text-sm font-medium text-ink">{order.order_number}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{order.customer_name}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-ink">{formatKSH(Number(order.total))}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                  order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                                  order.status === "Processing" ? "bg-purple-100 text-purple-800" :
                                  order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-lg font-bold text-ink mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <Link to="/admin/products" className="w-full px-4 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition block text-center">
                      Manage Products
                    </Link>
                    <Link to="/admin/orders" className="w-full px-4 py-3 bg-blush-100 text-plum-700 rounded-lg font-semibold hover:bg-blush-200 transition block text-center">
                      View All Orders
                    </Link>
                    <Link to="/" className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition block text-center">
                      View Live Shop
                    </Link>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
