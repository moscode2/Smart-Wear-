import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Layout from "../components/Layout";
import { paymentConfig } from "../config/payment";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa (Till/Paybill) and direct bank deposit. At checkout, choose your preferred method, complete the payment, and enter your M-Pesa confirmation code (or send us your deposit slip) so we can confirm and process your order."
    },
    {
      question: "How do I pay with M-Pesa?",
      answer: `Go to M-Pesa on your phone, select Lipa na M-Pesa, then ${paymentConfig.mpesa.paybillNumber ? "Pay Bill" : "Buy Goods and Services"}, enter the till/paybill number shown at checkout, enter the amount, and confirm with your PIN. Paste the confirmation code from your SMS into the order form.`
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy on unworn items in their original condition with tags attached. Contact us to arrange a return or exchange."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery within Nairobi typically takes 1-2 business days. Deliveries to other towns in Kenya usually take 2-5 business days depending on location."
    },
    {
      question: "How can I track my order?",
      answer: "Use the Track Order page with your order number and the phone number you used at checkout to see your order's current status."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes — every dress, gown, costume and traditional outfit is hand-picked for quality before it's listed."
    },
    {
      question: "What's your size guide?",
      answer: "Check our Size Guide page for general measurements. If you're unsure which size to choose, message us before ordering and we'll help you pick the right fit."
    },
    {
      question: "How do I contact customer support?",
      answer: `You can reach us via the Contact page, call or WhatsApp us at ${paymentConfig.supportPhone}, and we'll respond as soon as possible.`
    }
  ];

  return (
    <Layout>
      <div className="bg-blush-50">
        <div className="bg-gradient-to-br from-plum-800 via-plum-700 to-rosegold-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-blush-100 max-w-3xl mx-auto">
                Find answers to common questions about our products, shipping, returns, and more.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {openIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-gray-600 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-ink mb-4">Didn't find an answer?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-plum-700 to-rosegold-600 text-white rounded-lg font-semibold hover:from-plum-800 hover:to-rosegold-700 transition"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}