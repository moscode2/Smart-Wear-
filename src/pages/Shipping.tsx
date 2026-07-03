import { motion } from "framer-motion";
import { Truck, Package, Clock, Globe } from "lucide-react";
import Layout from "../components/Layout";

export default function Shipping() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      time: "5-7 business days",
      price: "Ksh 500",
      icon: Package,
      description: "Our most economical option for continental Kenya"
    },
    {
      name: "Express Shipping",
      time: "2-3 business days",
      price: "Ksh 1,500",
      icon: Truck,
      description: "Faster delivery for urgent orders"
    },
    {
      name: "Overnight Shipping",
      time: "1 business day",
      price: "Ksh 3,000",
      icon: Clock,
      description: "Next day delivery in Nairobi and major cities"
    },
    {
      name: "International Shipping",
      time: "7-14 business days",
      price: "Contact us",
      icon: Globe,
      description: "Available to select countries"
    }
  ];

  const faqs = [
    {
      question: "What is the shipping cost?",
      answer: "Shipping costs vary depending on the delivery method and location. Orders over Ksh 10,000 receive free standard shipping within Kenya. See our shipping options above for specific rates."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes! Free standard shipping is available on orders over Ksh 10,000 within mainland Kenya."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this to track your package in real-time on our Track Order page."
    },
    {
      question: "What areas do you ship to?",
      answer: "We ship throughout Kenya, with special rates for major cities. International shipping is available to select destinations. Contact our support team for more information."
    },
    {
      question: "Do you ship on weekends?",
      answer: "We process orders Monday-Friday. Orders placed on weekends will be processed on the following Monday."
    }
  ];

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-4xl font-bold text-ink mb-4">Shipping Information</h1>
            <p className="text-lg text-gray-600">Fast, reliable delivery to your doorstep</p>
          </motion.div>

          {/* Shipping Options */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-8">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
                  >
                    <Icon className="h-8 w-8 text-plum-700 mb-4" />
                    <h3 className="text-lg font-semibold text-ink mb-2">{option.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Delivery:</span> {option.time}</p>
                      <p className="text-lg font-bold text-ink">{option.price}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Key Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-ink mb-6">Shipping Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Order Placed", desc: "Your order is confirmed and payment processed" },
                { step: 2, title: "Processing", desc: "Items are picked, packed and quality checked" },
                { step: 3, title: "Shipped", desc: "Package leaves our warehouse with tracking info" },
                { step: 4, title: "Delivered", desc: "Package arrives safely at your address" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blush-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-plum-700">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold text-ink mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blush-50 to-rosegold-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Our customer support team is here to help.</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-plum-700 to-rosegold-600 text-white rounded-lg font-semibold hover:from-plum-800 hover:to-rosegold-700 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
