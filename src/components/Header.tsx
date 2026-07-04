import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-plum-800 text-blush-100 text-center py-2 text-sm tracking-wide">
        <p>Free delivery countrywide on orders over Ksh 10,000  &middot; Pay with M-Pesa or bank deposit</p>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-blush-50"
          >
            <Menu className="h-6 w-6 text-plum-700" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-display font-bold bg-gradient-to-r from-plum-700 to-rosegold-600 bg-clip-text text-transparent">
              Smart Wear
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/" className="text-ink/80 hover:text-plum-700 font-medium transition">
              Home
            </Link>
            <Link to="/shop" className="text-ink/80 hover:text-plum-700 font-medium transition">
              Shop
            </Link>
            <Link to="/about" className="text-ink/80 hover:text-plum-700 font-medium transition">
              About
            </Link>
            <Link to="/contact" className="text-ink/80 hover:text-plum-700 font-medium transition">
              Contact
            </Link>
            <Link to="/faq" className="text-ink/80 hover:text-plum-700 font-medium transition">
              FAQ
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blush-50 rounded-full transition">
              <Search className="h-5 w-5 text-plum-700" />
            </button>
            <Link to="/account" className="p-2 hover:bg-blush-50 rounded-full transition">
              <User className="h-5 w-5 text-plum-700" />
            </Link>
            <button className="p-2 hover:bg-blush-50 rounded-full transition">
              <Heart className="h-5 w-5 text-plum-700" />
            </button>
            <Link to="/cart" className="p-2 hover:bg-blush-50 rounded-full transition relative">
              <ShoppingCart className="h-5 w-5 text-plum-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rosegold-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blush-100 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-ink/80 hover:text-plum-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block text-ink/80 hover:text-plum-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block text-ink/80 hover:text-plum-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-ink/80 hover:text-plum-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="block text-ink/80 hover:text-plum-700 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
