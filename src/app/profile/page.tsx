"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, Settings, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const orders = [
  { id: "YUV-284719", date: "March 18, 2026", status: "Delivered", total: 1247, items: 3 },
  { id: "YUV-183562", date: "March 5, 2026", status: "Shipped", total: 849, items: 2 },
  { id: "YUV-092841", date: "Feb 22, 2026", status: "Delivered", total: 599, items: 1 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("Guest User");
  const [email, setEmail] = useState("-");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "-");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
      }

      if (profileData?.full_name) {
        setFullName(profileData.full_name);
      } else if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name as string);
      }

      setLoading(false);
    };

    void loadProfile();
  }, [router]);

  const initial = useMemo(() => fullName.trim().charAt(0).toUpperCase() || "U", [fullName]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl text-[#201B12] mb-10">My Account</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-ambient-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#1F5D3B] flex items-center justify-center text-white font-serif text-xl font-bold">{initial}</div>
                <div>
                  <p className="font-medium text-[#201B12]">{loading ? "Loading..." : fullName}</p>
                  <p className="text-xs text-[#56615B]">{email}</p>
                </div>
              </div>
              {errorMessage && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errorMessage}
                </p>
              )}
              <nav className="space-y-1">
                {[
                  { icon: Package, label: "Orders", active: true },
                  { icon: MapPin, label: "Addresses" },
                  { icon: Calendar, label: "Consultations" },
                  { icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${item.active ? "bg-[#E8F3EC] text-[#1F5D3B] font-medium" : "text-[#56615B] hover:bg-[#FEF2E3]"}`}>
                    <item.icon className="w-4 h-4" />{item.label}
                  </button>
                ))}
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-4">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-ambient-sm p-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-6">Order History</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-[#FEF2E3] hover:bg-[#F2E6D7] transition-colors">
                    <div>
                      <p className="font-medium text-[#201B12]">#{order.id}</p>
                      <p className="text-sm text-[#56615B]">{order.date} · {order.items} items</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-[#E8F3EC] text-[#1F5D3B]" : "bg-[#C9A961]/20 text-[#C9A961]"}`}>{order.status}</span>
                        <p className="text-sm font-bold text-[#201B12] mt-1">₹{order.total}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#56615B]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-2xl shadow-ambient-sm p-6 mt-6">
              <h2 className="font-serif text-xl text-[#201B12] mb-6">Saved Addresses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FEF2E3]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#1F5D3B] bg-[#E8F3EC] px-2 py-0.5 rounded-full">Home</span>
                    <button className="text-xs text-[#C9A961]">Edit</button>
                  </div>
                  <p className="text-sm text-[#201B12]">{fullName}</p>
                  <p className="text-xs text-[#56615B] mt-1">42, Green Valley Apartments<br />Bandra West, Mumbai - 400050</p>
                </div>
                <div className="p-4 rounded-xl border-2 border-dashed border-[#c0c9bf] flex items-center justify-center">
                  <button className="text-sm text-[#1F5D3B] font-medium">+ Add New Address</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
