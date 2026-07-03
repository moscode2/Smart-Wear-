import { motion } from "framer-motion";
import { RotateCcw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Layout from "../components/Layout";

export default function Returns() {
  const returnSteps = [
    {
      step: 1,
      title: "Request a Return",
      description: "Contact our support team within 7 days of purchase with your order number and reason for return.",
      icon: AlertCircle
    },
    {
      step: 2,
      title: "Get Return Authorization",
      description: "We'll provide you with a return shipping label and return authorization number.",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Ship Item Back",
      description: "Package your item securely and ship it back using the provided label.",
      icon: RotateCcw
    },
    {
      step: 4,
      title: "Receive Refund",
      description: "Once received and inspected, your refund will be processed within 5-7 business days.",
      icon: Clock
    }
  ];

  const conditions = [
    "Item must be in original condition with all tags attached",
    "Item must not show signs of wear or damage",
    "Item must not have been washed or altered in any way",
    "Original packaging and receipt must be included",
    "Return must be initiated within 7 days of purchase"
  ];

  const nonReturnable = [
    "Items purchased on clearance",
    "Items purchased more than 7 days ago",
    "Items without original tags",
    "Damaged items from customer misuse",
    "Final sale items"
  ];

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-4xl font-bold text-ink mb-4">Returns & Exchanges</h1>
            <p className="text-lg text-gray-600">7-day easy returns policy on unworn items</p>
          </motion.div>

          {/* Policy Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-ink mb-6">Our Return Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">7 Days</h3>
                <p className="text-gray-600">From the date of purchase</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blush-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-plum-700" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">Easy Returns</h3>
                <p className="text-gray-600">Drop off or arrange pickup with us</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blush-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-plum-700" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">Quick Refunds</h3>
                <p className="text-gray-600">5-7 business days after inspection</p>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-8">How to Return an Item</h2>
            <div className="space-y-6">
              {returnSteps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-plum-700">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">Return Conditions</h2>
              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{condition}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-6">Non-Returnable Items</h2>
              <div className="space-y-3">
                {nonReturnable.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-ink mb-4">Exchanges</h2>
            <p className="text-gray-600 mb-6">Want a different size or color? Exchanges are easy and free!</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-plum-700 font-bold">1.</div>
                <p className="text-gray-700">Contact our support team with your order number and the item you'd like to exchange.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-plum-700 font-bold">2.</div>
                <p className="text-gray-700">We'll send you a return label and ship your replacement item immediately.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-plum-700 font-bold">3.</div>
                <p className="text-gray-700">Ship back the original item using the provided label.</p>
              </div>
              <div className="flex gap-4">
                <div className="text-plum-700 font-bold">4.</div>
                <p className="text-gray-700">Enjoy your new item! No waiting for refunds.</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blush-50 to-rosegold-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6">Our support team is ready to help with any return or exchange questions.</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-plum-700 to-rosegold-600 text-white rounded-lg font-semibold hover:from-plum-800 hover:to-rosegold-700 transition">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
