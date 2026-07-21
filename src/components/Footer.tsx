import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-plum-900 text-blush-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="text-2xl font-display font-bold bg-gradient-to-r from-blush-300 to-rosegold-400 bg-clip-text text-transparent mb-4">
              Smart Wear
            </div>
            <p className="text-sm text-blush-200/80 mb-4">
              Your destination for elegant wears' dresses, gowns, costumes and traditional wear. Pay easily with M-Pesa or bank deposit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-rosegold-300 transition">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-rosegold-300 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-rosegold-300 transition">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-rosegold-300 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="hover:text-rosegold-300 transition">Shipping Information</Link></li>
              <li><Link to="/returns" className="hover:text-rosegold-300 transition">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="hover:text-rosegold-300 transition">Size Guide</Link></li>
              <li><Link to="/track-order" className="hover:text-rosegold-300 transition">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-blush-200/80 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm bg-plum-800 border border-plum-700 rounded-l-md focus:outline-none focus:border-rosegold-400 text-white placeholder:text-blush-200/50"
              />
              <button className="px-4 py-2 bg-rosegold-600 hover:bg-rosegold-700 text-white rounded-r-md transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-plum-700 mt-8 pt-8 text-sm text-center text-blush-200/70 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>© 2026 Smart Wear Collection. All rights reserved.</span>
          <span className="hidden sm:inline">&middot;</span>
          <Link to="/admin" className="hover:text-rosegold-300 transition">Admin</Link>
          <span className="hidden sm:inline">&middot;</span>
          <a
            href="https://justmee.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rosegold-300 transition"
          >
            Developed by Moses.
          </a>
        </div>
      </div>
    </footer>
  );
}