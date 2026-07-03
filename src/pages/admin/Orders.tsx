import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader, LogOut, ArrowLeft, ChevronDown, ChevronUp, Smartphone, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { supabase } from "../../lib/supabase";
import { formatKSH } from "../../lib/currency";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  payment_method: "mpesa" | "bank";
  mpesa_code: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-purple-100 text-purple-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function Orders() {
  const { signOut } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-plum-700 mb-3">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">Orders</h1>
                <p className="text-gray-600 mt-2">View customer orders and update their status</p>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-3 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </motion.div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="h-8 w-8 text-plum-600 animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-full flex flex-wrap items-center justify-between gap-4 p-5 text-left hover:bg-blush-50/50 transition"
                    >
                      <div className="flex items-center gap-4">
                        {order.payment_method === "mpesa" ? (
                          <Smartphone className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <Building2 className="h-5 w-5 text-plum-600 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-ink">{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {order.customer_name} &middot; {order.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-ink">{formatKSH(Number(order.total))}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || "bg-gray-100 text-gray-800"}`}>
                          {order.status}
                        </span>
                        <span className="text-sm text-gray-400 hidden sm:inline">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-5 bg-blush-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="text-sm font-semibold text-ink mb-2">Delivery Details</h4>
                            <p className="text-sm text-gray-600">{order.customer_name}</p>
                            <p className="text-sm text-gray-600">{order.customer_phone}</p>
                            {order.customer_email && <p className="text-sm text-gray-600">{order.customer_email}</p>}
                            <p className="text-sm text-gray-600 mt-1">{order.delivery_address}, {order.delivery_city}</p>
                            {order.notes && <p className="text-sm text-gray-500 italic mt-1">Note: {order.notes}</p>}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-ink mb-2">Payment</h4>
                            <p className="text-sm text-gray-600 capitalize">{order.payment_method === "mpesa" ? "M-Pesa" : "Bank Deposit"}</p>
                            {order.mpesa_code && (
                              <p className="text-sm text-gray-600">Confirmation code: <span className="font-mono font-semibold">{order.mpesa_code}</span></p>
                            )}
                            <div className="mt-2 text-sm text-gray-600 space-y-0.5">
                              <p>Subtotal: {formatKSH(Number(order.subtotal))}</p>
                              <p>Delivery: {Number(order.shipping) === 0 ? "Free" : formatKSH(Number(order.shipping))}</p>
                              <p className="font-semibold text-ink">Total: {formatKSH(Number(order.total))}</p>
                            </div>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-ink mb-2">Items</h4>
                        <div className="space-y-2 mb-6">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3">
                              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-ink">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.size} / {item.color} &middot; Qty {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-ink">{formatKSH(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-ink">Update status:</label>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-plum-500 disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {updatingId === order.id && <Loader className="h-4 w-4 text-plum-600 animate-spin" />}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
