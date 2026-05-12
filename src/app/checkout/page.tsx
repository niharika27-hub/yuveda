"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Truck, CheckCircle2, ArrowLeft } from "lucide-react";
import { getCartItemId, getCartItemPrice, useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/lib/admin-data";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<"form" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderId, setOrderId] = useState<string>("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
  });

  const updateCustomer = (key: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [key]: value }));
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (
      !customer.name ||
      !customer.phone ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.pinCode
    ) {
      setErrorMessage("Please fill all delivery details.");
      return;
    }

    setPlacingOrder(true);
    setErrorMessage("");
    const nextOrderId = Math.floor(100000 + Math.random() * 900000).toString();
    const subtotal = getTotal();
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    try {
      await createOrder({
        order_number: `YUV-${nextOrderId}`,
        customer_name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        pin_code: customer.pinCode,
        payment_method: paymentMethod,
        subtotal,
        tax,
        total,
        items: items.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          variant: item.variant?.quantity ?? "Standard pack",
          price: getCartItemPrice(item),
        })),
      });
      setOrderId(nextOrderId);
      setStep("success");
      clearCart();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (step === "success") {
    return (
      <div className="pt-24 pb-16 min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#E8F3EC] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#1F5D3B]" />
          </div>
          <h1 className="font-serif text-3xl text-[#201B12] mb-3">Order Placed!</h1>
          <p className="text-[#56615B] mb-2">Thank you for your order. Your Ayurvedic wellness products are on the way!</p>
          <p className="text-sm text-[#C9A961] font-medium mb-8">Order ID: #YUV-{orderId}</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-medium">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[#56615B] hover:text-[#1F5D3B] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="font-serif text-4xl text-[#201B12] mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-ambient-sm p-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-5">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={customer.name} onChange={(e) => updateCustomer("name", e.target.value)} placeholder="Full Name" className="px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                <input value={customer.phone} onChange={(e) => updateCustomer("phone", e.target.value)} placeholder="Phone Number" className="px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                <input value={customer.email} onChange={(e) => updateCustomer("email", e.target.value)} placeholder="Email" className="sm:col-span-2 px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                <textarea value={customer.address} onChange={(e) => updateCustomer("address", e.target.value)} placeholder="Full Address" rows={3} className="sm:col-span-2 px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all resize-none" />
                <input value={customer.city} onChange={(e) => updateCustomer("city", e.target.value)} placeholder="City" className="px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
                <input value={customer.pinCode} onChange={(e) => updateCustomer("pinCode", e.target.value)} placeholder="PIN Code" className="px-4 py-3 rounded-xl bg-[#F2E6D7] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1F5D3B]/20 transition-all" />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-ambient-sm p-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-5">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: "upi", label: "UPI Payment", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
                  { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
                  { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when delivered" },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? "bg-[#E8F3EC] ring-2 ring-[#1F5D3B]" : "bg-[#FEF2E3] hover:bg-[#F2E6D7]"}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-[#1F5D3B]" : "border-[#c0c9bf]"}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1F5D3B]" />}
                    </div>
                    <method.icon className="w-5 h-5 text-[#1F5D3B]" />
                    <div>
                      <p className="text-sm font-medium text-[#201B12]">{method.label}</p>
                      <p className="text-xs text-[#56615B]">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-white rounded-2xl shadow-ambient p-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={getCartItemId(item.product, item.variant)} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F2E6D7] overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#201B12] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#56615B]">
                        {item.variant ? `${item.variant.quantity} - ${item.variant.priceLabel}` : "Standard pack"}
                      </p>
                      <p className="text-xs text-[#56615B]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">₹{getCartItemPrice(item) * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-[#EDE1D2] pt-4">
                <div className="flex justify-between"><span className="text-[#56615B]">Subtotal</span><span>₹{getTotal()}</span></div>
                <div className="flex justify-between"><span className="text-[#56615B]">Shipping</span><span className="text-[#1F5D3B]">Free</span></div>
                <div className="flex justify-between"><span className="text-[#56615B]">Tax (GST 18%)</span><span>₹{Math.round(getTotal() * 0.18)}</span></div>
              </div>
              <div className="border-t border-[#EDE1D2] mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#1F5D3B]">₹{Math.round(getTotal() * 1.18)}</span></div>
              </div>
              {errorMessage && (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}
              <button disabled={placingOrder} onClick={placeOrder} className="block w-full mt-6 py-4 rounded-full btn-gradient text-white text-center font-medium hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all disabled:opacity-60">
                {placingOrder ? "Placing Order..." : `Place Order - Rs. ${Math.round(getTotal() * 1.18)}`}
              </button>
              <button hidden type="button" onClick={() => {
                setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
                setStep("success");
                clearCart();
              }} className="block w-full mt-6 py-4 rounded-full btn-gradient text-white text-center font-medium hover:shadow-lg hover:shadow-[#1F5D3B]/30 transition-all">
                Place Order — ₹{Math.round(getTotal() * 1.18)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
