import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, Loader } from "lucide-react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.new_arrival).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-plum-800 via-plum-700 to-rosegold-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-25"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight"
            >
              Dresses & Costumes Made for Your Moment
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl mb-8 text-blush-100"
            >
              Elegant gowns, everyday dresses, traditional wear and costumes — curated for every Kenyan woman. New arrivals every week.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="px-8 py-4 bg-white text-plum-700 rounded-full font-semibold hover:bg-blush-100 transition flex items-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-plum-700 transition"
              >
                View Collection
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-blush-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blush-200 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Free Delivery Country Wide.</h3>
              <p className="text-sm text-gray-600">Get discount for orders above Ksh 10,000</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blush-200 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">M-Pesa & Bank Pay</h3>
              <p className="text-sm text-gray-600">Simple, secure local payment</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blush-200 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">5-day return policy</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blush-200 rounded-full flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Friendly Support</h3>
              <p className="text-sm text-gray-600">We're here to help</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked favourites that define elegant style. Shop our most loved pieces.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-6 w-6 text-plum-600 animate-spin" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No featured products yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-plum-700 text-white rounded-full font-semibold hover:bg-plum-800 transition group"
            >
              View All Products
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gradient-to-r from-plum-700 to-rosegold-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-xl mb-8 text-blush-100">
              Sign up for our newsletter and receive exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full text-ink focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-plum-700 rounded-full font-semibold hover:bg-blush-100 transition">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fresh styles just landed. Be the first to wear the latest looks.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-blush-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Dresses", "Gowns", "Costumes", "Traditional Wear", "Skirts & Tops", "Jumpsuits"].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop?category=${category}`}
                  className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition text-center group"
                >
                  <h3 className="font-semibold text-ink group-hover:text-plum-700 transition">
                    {category}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
