import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, Smartphone, Building2, Copy, Check, Loader, ShieldAlert } from "lucide-react";
import Layout from "../components/Layout";
import { formatKSH } from "../lib/currency";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { paymentConfig } from "../config/payment";

const SHIPPING_FEE = 0;
const FREE_SHIPPING_THRESHOLD = 0;

type PaymentMethod = "mpesa" | "bank";

function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; ignore
    }
  };

  return (
    <div className="flex items-center justify-between bg-blush-50 rounded-lg px-4 py-3">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 hover:bg-blush-200 rounded-md transition text-plum-700"
        title="Copy"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    Name: "",
    phone: "",
    city: "",
    mpesaCode: "",
  });

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isShippingValid =
    formData.Name.trim() && formData.phone.trim()  && formData.city.trim();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (paymentMethod === "mpesa" && !formData.mpesaCode.trim()) {
      setSubmitError("Please enter the M-Pesa confirmation code (e.g. QFG7XXXXXX) after you've paid.");
      return;
    }

    setSubmitting(true);
    try {
      const generatedOrderNumber = `SW-${Date.now().toString().slice(-8)}`;

      const { error } = await supabase.from("orders").insert([
        {
          order_number: generatedOrderNumber,
          customer_name: formData.Name,
          customer_phone: formData.phone,
          delivery_city: formData.city,
          payment_method: paymentMethod,
          mpesa_code: paymentMethod === "mpesa" ? formData.mpesaCode.trim() : null,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          shipping,
          total,
          status: "Pending",
          notes: formData.notes || null,
        },
      ]);

      if (error) throw error;

      setOrderNumber(generatedOrderNumber);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `We couldn't save your order: ${err.message}`
          : "We couldn't save your order. Please try again or contact us."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush-50 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ShoppingCart className="h-16 w-16 text-blush-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-ink mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <a href="/shop" className="inline-block px-8 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition">
              Go to Shop
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  if (orderComplete) {
    return (
      <Layout>
        <div className="min-h-screen bg-blush-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm p-12 text-center"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-display font-bold text-ink mb-2">Order Received!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order <strong>#{orderNumber}</strong> has been received and is
                {paymentMethod === "mpesa" ? " being verified." : " awaiting your bank deposit confirmation."}
              </p>
              <div className="bg-blush-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-700"><strong>Order Total:</strong> {formatKSH(total)}</p>
                <p className="text-sm text-gray-700 mt-2"><strong>Delivery to:</strong> {formData.address}, {formData.city}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>We'll contact you on:</strong> {formData.phone}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Save your order number <strong>{orderNumber}</strong> — you can use it to track your order anytime.
              </p>
              <a href="/" className="inline-block px-8 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition">
                Continue Shopping
              </a>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-blush-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-display font-bold text-ink">Checkout</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery details */}
              <div className={`border rounded-lg p-6 transition ${currentStep === 1 ? "border-plum-400 bg-white" : "border-blush-100 bg-white"}`}>
                <h2 className="text-lg font-semibold text-ink mb-4">1. Delivery Details</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="Name"
                      placeholder="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (e.g. 0712 345 678)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Town / City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
                  />
                  <textarea
                    name="notes"
                    placeholder="Order notes (optional) — e.g. preferred delivery time"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!isShippingValid}
                    onClick={() => setCurrentStep(2)}
                    className="w-full px-4 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>

              {/* Step 2: Payment */}
              {currentStep >= 2 && (
                <div className={`border rounded-lg p-6 transition ${currentStep === 2 ? "border-plum-400 bg-white" : "border-blush-100 bg-white"}`}>
                  <h2 className="text-lg font-semibold text-ink mb-4">2. Payment Method</h2>

                  {/* Method tabs */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mpesa")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-semibold transition ${
                        paymentMethod === "mpesa"
                          ? "border-plum-700 bg-blush-100 text-plum-700"
                          : "border-gray-200 text-gray-600 hover:border-plum-300"
                      }`}
                    >
                      <Smartphone className="h-5 w-5" />
                      M-Pesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank")}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-semibold transition ${
                        paymentMethod === "bank"
                          ? "border-plum-700 bg-blush-100 text-plum-700"
                          : "border-gray-200 text-gray-600 hover:border-plum-300"
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                      Bank Deposit
                    </button>
                  </div>

                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    {paymentMethod === "mpesa" ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-green-800 mb-3">
                            Pay {formatKSH(total)} via M-Pesa, then enter your confirmation code below.
                          </p>
                          <div className="space-y-2">
                            {paymentConfig.mpesa.tillNumber && (
                              <CopyableField label="Buy Goods / Till Number" value={paymentConfig.mpesa.tillNumber} />
                            )}
                            {paymentConfig.mpesa.paybillNumber && (
                              <>
                                <CopyableField label="Paybill Number" value={paymentConfig.mpesa.paybillNumber} />
                                {paymentConfig.mpesa.paybillAccountName && (
                                  <CopyableField label="Account Number" value={paymentConfig.mpesa.paybillAccountName} />
                                )}
                              </>
                            )}
                            <CopyableField label="Registered Name" value={paymentConfig.mpesa.recipientName} />
                          </div>
                          <ol className="text-xs text-green-800/90 mt-3 space-y-1 list-decimal list-inside">
                            <li>Go to M-Pesa on your phone &rarr; Lipa na M-Pesa {paymentConfig.mpesa.paybillNumber ? "&rarr; Pay Bill" : "&rarr; Buy Goods and Services"}</li>
                            <li>Enter the number above and amount {formatKSH(total)}</li>
                            <li>Enter your M-Pesa PIN to complete payment</li>
                            <li>Copy the confirmation code from the SMS you receive and paste it below</li>
                          </ol>
                        </div>
                        <input
                          type="text"
                          name="mpesaCode"
                          placeholder="M-Pesa Confirmation Code (e.g. QFG7H8J2K1)"
                          value={formData.mpesaCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plum-500 focus:outline-none uppercase"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-blush-50 border border-blush-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-plum-800 mb-3">
                            Deposit {formatKSH(total)} to the bank account below, then place your order.
                          </p>
                          <div className="space-y-2">
                            <CopyableField label="Bank Name" value={paymentConfig.bank.bankName} />
                            <CopyableField label="Account Name" value={paymentConfig.bank.accountName} />
                            <CopyableField label="Account Number" value={paymentConfig.bank.accountNumber} />
                            {paymentConfig.bank.branch && (
                              <CopyableField label="Branch" value={paymentConfig.bank.branch} />
                            )}
                          </div>
                          <p className="text-xs text-plum-800/80 mt-3">
                            After depositing, please WhatsApp or call us at {paymentConfig.supportPhone} with your
                            deposit slip so we can confirm and start processing your order.
                          </p>
                        </div>
                      </div>
                    )}

                    {submitError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-4 py-3 bg-rosegold-600 text-white rounded-lg font-semibold hover:bg-rosegold-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="h-5 w-5 text-plum-700" />
                <h3 className="text-lg font-bold text-ink">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold text-ink">{formatKSH(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatKSH(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? "FREE" : formatKSH(shipping)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-ink">
                  <span>Total</span>
                  <span>{formatKSH(total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
