import { motion } from "framer-motion";
import { User, Heart, Package, Settings, LogOut } from "lucide-react";
import Layout from "../components/Layout";

export default function Account() {
  const mockOrders = [
    { id: "ORD-001", date: "2024-01-15", total: "$129.99", status: "Delivered" },
    { id: "ORD-002", date: "2024-01-10", total: "$89.99", status: "Delivered" },
    { id: "ORD-003", date: "2024-01-05", total: "$199.99", status: "Shipped" }
  ];

  const mockWishlist = [
    { id: 1, name: "Premium Athletic Jacket", price: "$79.99", image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: 2, name: "Classic Denim Jeans", price: "$59.99", image: "https://images.pexels.com/photos/3622613/pexels-photo-3622613.jpeg?auto=compress&cs=tinysrgb&w=400" }
  ];

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-ink">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your profile, orders, and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-plum-600 to-rosegold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-ink">Maxwell Morgan</h2>
                <p className="text-gray-600 text-sm">maxwell@example.com</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mt-6 space-y-3">
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 hover:bg-blush-50 rounded">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 hover:bg-blush-50 rounded">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold text-ink mb-6">Personal Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
                    />
                  </div>
                  <button className="px-8 py-2 bg-gradient-to-r from-plum-700 to-rosegold-600 text-white rounded-lg font-semibold hover:from-plum-800 hover:to-rosegold-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-plum-700" />
                <h3 className="text-2xl font-bold text-ink">Recent Orders</h3>
              </div>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-ink">{order.id}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blush-100 text-plum-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.date}</p>
                    <p className="text-lg font-bold text-ink mt-2">{order.total}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-red-600" />
                <h3 className="text-2xl font-bold text-ink">Wishlist</h3>
              </div>
              <div className="space-y-4">
                {mockWishlist.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-ink">{item.name}</h4>
                      <p className="text-lg font-bold text-ink">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}