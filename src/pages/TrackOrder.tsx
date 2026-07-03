import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, AlertCircle, Loader, XCircle } from "lucide-react";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import { formatKSH } from "../lib/currency";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface TrackedOrder {
  order_number: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  delivery_address: string;
  delivery_city: string;
}

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrderData(null);

    const trimmedOrder = orderNumber.trim().toUpperCase();
    const trimmedPhone = phone.trim();

    if (!trimmedOrder || !trimmedPhone) {
      setError("Please enter both your order number and the phone number used at checkout.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("order_number, status, items, subtotal, shipping, total, created_at, delivery_address, delivery_city, customer_phone")
        .eq("order_number", trimmedOrder)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const phoneDigits = (s: string) => s.replace(/\D/g, "").slice(-9);

      if (!data || phoneDigits(data.customer_phone) !== phoneDigits(trimmedPhone)) {
        setError("We couldn't find an order matching that order number and phone number.");
        return;
      }

      setOrderData(data as TrackedOrder);
    } catch (err) {
      setError(err instanceof Error ? `Something went wrong: ${err.message}` : "Something went wrong while looking up your order.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "Shipped":
        return <Truck className="h-6 w-6 text-blue-600" />;
      case "Processing":
        return <Clock className="h-6 w-6 text-purple-600" />;
      case "Cancelled":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Package className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "Shipped":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      case "Processing":
        return { bg: "bg-purple-100", text: "text-purple-800" };
      case "Cancelled":
        return { bg: "bg-red-100", text: "text-red-800" };
      default:
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
    }
  };

  const currentStepIndex = orderData ? STEPS.indexOf(orderData.status) : -1;

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-display font-bold text-ink mb-4">Track Your Order</h1>
            <p className="text-lg text-gray-600">Enter your order number and the phone number you used at checkout</p>
          </motion.div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Order number (e.g. SW-12345678)"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:border-transparent"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number used at checkout"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Searching..." : "Track Order"}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </form>

          {/* Order Details */}
          {orderData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Status Header */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Number</p>
                    <p className="text-2xl font-bold text-ink">{orderData.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Placed On</p>
                    <p className="text-lg text-ink">{new Date(orderData.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <div className={`px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2 ${getStatusBadge(orderData.status).bg} ${getStatusBadge(orderData.status).text}`}>
                      {getStatusIcon(orderData.status)}
                      {orderData.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {orderData.status !== "Cancelled" && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-display font-bold text-ink mb-8">Delivery Progress</h2>
                  <div className="space-y-6">
                    {STEPS.map((step, index) => {
                      const completed = index <= currentStepIndex;
                      return (
                        <div key={step} className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${completed ? "bg-green-100" : "bg-gray-100"}`}>
                              {completed ? <CheckCircle className="h-6 w-6 text-green-600" /> : <Clock className="h-6 w-6 text-gray-400" />}
                            </div>
                            {index < STEPS.length - 1 && (
                              <div className={`w-1 h-12 ${completed && index < currentStepIndex ? "bg-green-200" : "bg-gray-200"}`} />
                            )}
                          </div>
                          <div className="pb-6">
                            <h3 className={`text-lg font-semibold ${completed ? "text-ink" : "text-gray-500"}`}>{step}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-display font-bold text-ink mb-6">Order Items</h2>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-blush-50 rounded-lg">
                      <div>
                        <p className="font-medium text-ink">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.size && item.color ? `${item.size} / ${item.color} · ` : ""}Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-ink">{formatKSH(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <p className="font-semibold text-ink">Order Total</p>
                    <p className="text-2xl font-bold text-plum-700">{formatKSH(orderData.total)}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gradient-to-r from-blush-100 to-rosegold-100 rounded-lg p-6">
                <h3 className="font-semibold text-ink mb-2">Need Help?</h3>
                <p className="text-gray-700 mb-4">If you have any questions about your order or delivery, don't hesitate to contact our support team.</p>
                <a href="/contact" className="inline-block px-6 py-2 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition">
                  Contact Support
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
