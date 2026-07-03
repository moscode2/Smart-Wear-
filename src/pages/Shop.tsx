import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Loader } from "lucide-react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { categories, getColorSwatch } from "../types/product";
import { formatKSH } from "../lib/currency";

const MAX_PRICE = 10000;

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [products]);

  // Filter products
  let filteredProducts = products.filter((product) => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) return false;
    if (selectedColors.length > 0 && !selectedColors.some(color => product.colors.includes(color))) return false;
    return true;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0);
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, MAX_PRICE]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-blush-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-2">Shop All Products</h1>
            <p className="text-gray-600">Discover our complete collection of dresses, gowns, costumes and traditional wear</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-ink">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-plum-600 hover:text-plum-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium text-ink mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition ${
                          selectedCategory === category
                            ? "bg-blush-200 text-plum-700 font-medium"
                            : "text-gray-700 hover:bg-blush-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-ink mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max={MAX_PRICE}
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-plum-700"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatKSH(priceRange[0])}</span>
                      <span>{formatKSH(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                {allSizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-ink mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1 rounded-md border transition ${
                            selectedSizes.includes(size)
                              ? "bg-plum-700 text-white border-plum-700"
                              : "bg-white text-gray-700 border-gray-300 hover:border-plum-600"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {allColors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-ink mb-3">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {allColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          title={color}
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            selectedColors.includes(color)
                              ? "border-plum-700 ring-2 ring-plum-300"
                              : "border-gray-300"
                          }`}
                          style={{ background: getColorSwatch(color) }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blush-100 rounded-md hover:bg-blush-200 transition"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                  <p className="text-gray-600">
                    <span className="font-semibold text-ink">{filteredProducts.length}</span> products found
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plum-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:hidden bg-white rounded-lg shadow-sm p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-ink">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-ink mb-3">Category</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`block w-full text-left px-3 py-2 rounded-md transition ${
                              selectedCategory === category
                                ? "bg-blush-200 text-plum-700 font-medium"
                                : "text-gray-700 hover:bg-blush-100"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {allSizes.length > 0 && (
                      <div>
                        <h3 className="font-medium text-ink mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                          {allSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => toggleSize(size)}
                              className={`px-3 py-1 rounded-md border transition ${
                                selectedSizes.includes(size)
                                  ? "bg-plum-700 text-white border-plum-700"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-plum-600"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {allColors.length > 0 && (
                      <div>
                        <h3 className="font-medium text-ink mb-3">Color</h3>
                        <div className="flex flex-wrap gap-2">
                          {allColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => toggleColor(color)}
                              title={color}
                              className={`w-8 h-8 rounded-full border-2 transition ${
                                selectedColors.includes(color)
                                  ? "border-plum-700 ring-2 ring-plum-300"
                                  : "border-gray-300"
                              }`}
                              style={{ background: getColorSwatch(color) }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader className="h-8 w-8 text-plum-600 animate-spin" />
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-red-600 mb-2">Couldn't load products.</p>
                  <p className="text-gray-500 text-sm">{error}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-600 mb-4">No products found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-plum-700 text-white rounded-full hover:bg-plum-800 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
