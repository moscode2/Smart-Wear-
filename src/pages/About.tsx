import { motion } from "framer-motion";
import { Award, Users, Heart, TrendingUp } from "lucide-react";
import Layout from "../components/Layout";

export default function About() {
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
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About Smart Wear</h1>
              <p className="text-xl text-blush-100 max-w-3xl mx-auto">
                Your destination for elegant ladies' dresses, gowns and costumes. We believe every woman deserves to look and feel her best.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-ink mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Smart Wear Collection started with a simple mission: to make beautiful, well-made dresses, gowns and costumes accessible to every Kenyan woman, whatever the occasion.
                </p>
                <p>
                  What began as a small boutique has grown into a trusted name for ladies' fashion — from everyday dresses and office wear to bridal gowns, traditional outfits and event costumes. Every piece is hand-picked for fit, quality and style.
                </p>
                <p>
                  Today, we continue to bring fresh designs every week, with easy local payment via M-Pesa and bank deposit, and delivery across Kenya.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-lg overflow-hidden shadow-xl"
            >
              <img
                src="https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ladies' fashion boutique"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blush-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">500+</h3>
              <p className="text-gray-600">Products Sold</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-rosegold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-rosegold-600" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">2000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blush-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blush-600" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">98%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-plum-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-plum-700" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">50+</h3>
              <p className="text-gray-600">New Arrivals Weekly</p>
            </motion.div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-ink mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do, from product selection to customer service.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-ink mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We carefully select every dress, gown and costume to meet our standards for fit, fabric and finish.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-ink mb-3">Affordability</h3>
                <p className="text-gray-600">
                  Beautiful fashion should be accessible. We work directly with makers to bring you fair prices without compromising quality.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-ink mb-3">Easy Local Payment</h3>
                <p className="text-gray-600">
                  Pay the way that's easiest for you — M-Pesa Till/Paybill or a direct bank deposit, with no card needed.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}