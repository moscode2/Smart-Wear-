import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product, getColorSwatch } from "../types/product";
import { motion } from "framer-motion";
import { formatKSH } from "../lib/currency";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: product.sizes[0] || "One Size",
      color: product.colors[0] || "Default",
      stock: product.stock,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-blush-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.new_arrival && (
              <span className="bg-plum-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-rosegold-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-plum-700 hover:text-white transition">
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={handleQuickAdd}
              title="Add to cart"
              className="p-2 bg-white rounded-full shadow-md hover:bg-plum-700 hover:text-white transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-plum-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-ink mb-2 group-hover:text-plum-700 transition">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-rosegold-500 text-rosegold-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-ink">
              {formatKSH(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatKSH(product.original_price)}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex gap-1 mt-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-gray-300"
                style={{ background: getColorSwatch(color) }}
                title={color}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
