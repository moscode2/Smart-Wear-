import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import CartItem from "../components/CartItem";
import { formatKSH } from "../lib/currency";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 300;

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const shipping = items.length === 0 ? 0 : subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-blush-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <ShoppingBag className="h-24 w-24 text-blush-300 mx-auto mb-6" />
              <h1 className="text-3xl font-display font-bold text-ink mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-plum-700 text-white rounded-full font-semibold hover:bg-plum-800 transition"
              >
                Start Shopping
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-blush-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.cartId}
                  id={item.cartId}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  size={item.size}
                  color={item.color}
                  quantity={item.quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-ink mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatKSH(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{shipping === 0 ? "FREE" : formatKSH(shipping)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-ink">
                    <span>Total</span>
                    <span>{formatKSH(total)}</span>
                  </div>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-blush-100 border border-blush-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-plum-800">
                      Add <span className="font-semibold">{formatKSH(FREE_SHIPPING_THRESHOLD - subtotal)}</span> more to get free delivery!
                    </p>
                  </div>
                )}

                <Link
                  to="/checkout"
                  className="block w-full px-6 py-4 bg-plum-700 text-white text-center rounded-lg font-semibold hover:bg-plum-800 transition mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/shop"
                  className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 text-center rounded-lg font-semibold hover:border-plum-600 hover:text-plum-600 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
