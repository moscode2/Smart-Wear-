import { motion } from "framer-motion";
import { Ruler, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import { useState } from "react";

export default function SizeGuide() {
  const [selectedCategory, setSelectedCategory] = useState("womens");

  const womenSizes = [
    { size: "XS", bust: "31-32\"", waist: "23-25\"", hips: "33-35\"" },
    { size: "S", bust: "33-34\"", waist: "26-27\"", hips: "36-37\"" },
    { size: "M", bust: "35-37\"", waist: "28-30\"", hips: "38-40\"" },
    { size: "L", bust: "38-40\"", waist: "31-33\"", hips: "41-43\"" },
    { size: "XL", bust: "41-43\"", waist: "34-36\"", hips: "44-46\"" },
    { size: "XXL", bust: "44-46\"", waist: "37-39\"", hips: "47-49\"" },
  ];

  const kidsSizes = [
    { size: "4", age: "3-4 yrs", height: "39-41\"", chest: "21-22\"" },
    { size: "6", age: "5-6 yrs", height: "42-46\"", chest: "23-24\"" },
    { size: "8", age: "7-8 yrs", height: "47-50\"", chest: "25-26\"" },
    { size: "10", age: "9-10 yrs", height: "51-54\"", chest: "27-28\"" },
    { size: "12", age: "11-12 yrs", height: "55-58\"", chest: "29-30\"" },
  ];

  const tips = [
    "Measure over light clothing or undergarments for accuracy",
    "Keep the measuring tape relaxed and parallel to the ground",
    "Bust: measure around the fullest part of your chest",
    "Waist: measure around your natural waistline",
    "Hips: measure around the fullest part of your hips",
    "When between sizes, choose the larger size for gowns and fitted dresses",
  ];

  return (
    <Layout>
      <div className="bg-blush-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-4xl font-display font-bold text-ink mb-4">Size Guide</h1>
            <p className="text-lg text-gray-600">Find your perfect fit for dresses, gowns, costumes and traditional wear</p>
          </motion.div>

          {/* Info Box */}
          <div className="bg-blush-50 border border-blush-200 rounded-lg p-6 mb-12 flex gap-4">
            <Ruler className="h-6 w-6 text-plum-700 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-plum-900 mb-2">How to Measure Yourself</h3>
              <p className="text-plum-800">Use a soft measuring tape. Measurements should be snug but not tight. If you don't have a measuring tape, use a piece of string and measure it against a ruler.</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: "womens", label: "Women's Sizing" },
              { id: "kids", label: "Kids' Costume Sizing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedCategory === tab.id
                    ? "bg-plum-700 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-plum-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Size Charts */}
          {selectedCategory === "womens" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="bg-blush-100 border-b">
                      <th className="px-6 py-4 text-left font-semibold text-ink">Size</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Bust</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Waist</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.map((size, index) => (
                      <tr key={index} className="border-b hover:bg-blush-50 transition">
                        <td className="px-6 py-4 font-semibold text-plum-700">{size.size}</td>
                        <td className="px-6 py-4 text-gray-700">{size.bust}</td>
                        <td className="px-6 py-4 text-gray-700">{size.waist}</td>
                        <td className="px-6 py-4 text-gray-700">{size.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedCategory === "kids" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="bg-blush-100 border-b">
                      <th className="px-6 py-4 text-left font-semibold text-ink">Size</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Approx. Age</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Height</th>
                      <th className="px-6 py-4 text-left font-semibold text-ink">Chest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kidsSizes.map((size, index) => (
                      <tr key={index} className="border-b hover:bg-blush-50 transition">
                        <td className="px-6 py-4 font-semibold text-plum-700">{size.size}</td>
                        <td className="px-6 py-4 text-gray-700">{size.age}</td>
                        <td className="px-6 py-4 text-gray-700">{size.height}</td>
                        <td className="px-6 py-4 text-gray-700">{size.chest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Tips */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-display font-bold text-ink mb-6">Measurement Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex gap-3 p-4 bg-blush-50 rounded-lg">
                  <div className="text-plum-700 font-bold flex-shrink-0">✓</div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Fit Varies by Style</h3>
              <p className="text-amber-800">Gowns, fitted dresses and stretch fabrics fit differently. Always check individual product descriptions for fit notes. If you're unsure, message us before ordering for personalized advice.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
