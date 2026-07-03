import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, RefreshCw, ChevronLeft, Loader, Check } from "lucide-react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useProduct, useProducts } from "../hooks/useProducts";
import { formatKSH } from "../lib/currency";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { products: allProducts } = useProducts();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0] || "");
    }
  }, [product?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Loader className="h-8 w-8 text-plum-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Product not found</h1>
          <Link to="/shop" className="text-plum-600 hover:text-plum-700">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        size: selectedSize || "One Size",
        color: selectedColor || "Default",
        stock: product.stock,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-blush-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-plum-700">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-plum-700">Shop</Link>
              <span>/</span>
              <span className="text-ink">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-plum-700 mb-6 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm mb-4"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </motion.div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-white rounded-lg overflow-hidden shadow-sm border-2 transition ${
                        selectedImage === index ? "border-plum-600" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full aspect-square object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Category & Rating */}
                <p className="text-sm text-plum-600 font-medium uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl font-display font-bold text-ink mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-rosegold-500 text-rosegold-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-ink">
                    {formatKSH(product.price)}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatKSH(product.original_price)}
                      </span>
                      <span className="px-3 py-1 bg-rosegold-100 text-rosegold-700 text-sm font-semibold rounded-full">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                {/* Size Selection */}
                {product.sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ink mb-3">
                      Select Size {sizeError && <span className="text-red-600 font-normal">— please choose a size</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setSizeError(false); }}
                          className={`px-4 py-2 rounded-md border-2 font-medium transition ${
                            selectedSize === size
                              ? "bg-plum-700 text-white border-plum-700"
                              : sizeError
                              ? "bg-white text-gray-700 border-red-300"
                              : "bg-white text-gray-700 border-gray-300 hover:border-plum-600"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ink mb-3">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-md border-2 font-medium transition ${
                            selectedColor === color
                              ? "bg-plum-700 text-white border-plum-700"
                              : "bg-white text-gray-700 border-gray-300 hover:border-plum-600"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-md border border-gray-300 hover:bg-blush-50 transition"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-10 h-10 rounded-md border border-gray-300 hover:bg-blush-50 transition"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.stock > 0 ? `(${product.stock} in stock)` : "(Out of stock)"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 px-6 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : justAdded
                        ? "bg-green-600 text-white"
                        : "bg-plum-700 text-white hover:bg-plum-800"
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </>
                    )}
                  </button>
                  <button className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-plum-600 hover:text-plum-600 transition">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                {/* Features */}
                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="h-5 w-5 text-plum-600" />
                    <span>Free delivery within Nairobi on orders over Ksh 10,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <RefreshCw className="h-5 w-5 text-plum-600" />
                    <span>7-day easy returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-plum-600" />
                    <span>Pay safely with M-Pesa or bank deposit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-ink mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
