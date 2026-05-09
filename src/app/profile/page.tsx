"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Plus,
  Save,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type ProfileTab = "orders" | "addresses" | "consultations" | "settings";

type ProfileForm = {
  fullName: string;
  phone: string;
};

const orders = [
  { id: "YUV-284719", date: "March 18, 2026", status: "Delivered", total: 1247, items: 3 },
  { id: "YUV-183562", date: "March 5, 2026", status: "Shipped", total: 849, items: 2 },
  { id: "YUV-092841", date: "Feb 22, 2026", status: "Delivered", total: 599, items: 1 },
];

const tabs: Array<{ id: ProfileTab; label: string; icon: typeof Package }> = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "consultations", label: "Consultations", icon: Calendar },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("orders");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("-");
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({ fullName: "Guest User", phone: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

      setUserId(user.id);
      setEmail(user.email ?? "-");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
      }

      setForm({
        fullName:
          profileData?.full_name ||
          (typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : "Guest User"),
        phone:
          profileData?.phone ||
          (typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone : ""),
      });

      setLoading(false);
    };

    void loadProfile();
  }, [router]);

  const initial = useMemo(
    () => form.fullName.trim().charAt(0).toUpperCase() || "U",
    [form.fullName]
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: form.fullName.trim() || null,
      phone: form.phone.trim() || null,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Profile updated.");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="absolute inset-0 bg-[#FFF8F3]/82 backdrop-blur-[2px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#1F5D3B]">
              Account
            </p>
            <h1 className="mt-2 font-serif text-4xl text-[#201B12] sm:text-5xl">
              My Account
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-ambient-sm transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl bg-white p-5 shadow-ambient">
            <div className="flex min-w-0 items-center gap-4 border-b border-[#EDE1D2] pb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1F5D3B] font-serif text-2xl font-bold text-white">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-[#201B12]">
                  {loading ? "Loading..." : form.fullName}
                </p>
                <p className="truncate text-sm text-[#56615B]">{email}</p>
                {form.phone && <p className="truncate text-xs text-[#56615B]">{form.phone}</p>}
              </div>
            </div>

            {(errorMessage || successMessage) && (
              <div
                className={`mt-4 rounded-xl px-3 py-2 text-sm ${
                  errorMessage ? "bg-red-50 text-red-700" : "bg-[#E8F3EC] text-[#1F5D3B]"
                }`}
              >
                {errorMessage ?? successMessage}
              </div>
            )}

            <nav className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                    activeTab === item.id
                      ? "bg-[#E8F3EC] font-semibold text-[#1F5D3B]"
                      : "text-[#56615B] hover:bg-[#FEF2E3] hover:text-[#201B12]"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            {activeTab === "orders" && (
              <AccountPanel title="Order History" description="Track recent orders and delivery status.">
                <div className="space-y-3">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FEF2E3] p-4 text-left transition-colors hover:bg-[#F2E6D7]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[#201B12]">#{order.id}</p>
                        <p className="mt-1 text-sm text-[#56615B]">
                          {order.date} - {order.items} items
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-[#E8F3EC] text-[#1F5D3B]"
                                : "bg-[#C9A961]/20 text-[#8A6A18]"
                            }`}
                          >
                            {order.status}
                          </span>
                          <p className="mt-1 text-sm font-bold text-[#201B12]">Rs. {order.total}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#56615B]" />
                      </div>
                    </button>
                  ))}
                </div>
              </AccountPanel>
            )}

            {activeTab === "addresses" && (
              <AccountPanel title="Saved Addresses" description="Manage delivery addresses for faster checkout.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#FEF2E3] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-[#E8F3EC] px-3 py-1 text-xs font-medium text-[#1F5D3B]">
                        Default
                      </span>
                      <button className="text-sm font-medium text-[#C9A961]">Edit</button>
                    </div>
                    <p className="font-medium text-[#201B12]">{form.fullName}</p>
                    <p className="mt-2 text-sm leading-6 text-[#56615B]">
                      Add your preferred delivery address during checkout.
                    </p>
                  </div>
                  <button className="flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#B7C6B9] bg-white text-[#1F5D3B] transition-colors hover:bg-[#E8F3EC]">
                    <Plus className="mb-2 h-5 w-5" />
                    <span className="text-sm font-semibold">Add New Address</span>
                  </button>
                </div>
              </AccountPanel>
            )}

            {activeTab === "consultations" && (
              <AccountPanel title="Consultations" description="Your wellness consultation history will appear here.">
                <div className="rounded-2xl bg-[#FEF2E3] p-8 text-center">
                  <Calendar className="mx-auto mb-3 h-8 w-8 text-[#1F5D3B]" />
                  <p className="font-medium text-[#201B12]">No consultations booked yet</p>
                  <p className="mt-1 text-sm text-[#56615B]">
                    Book a consultation when you are ready for guided Ayurvedic support.
                  </p>
                </div>
              </AccountPanel>
            )}

            {activeTab === "settings" && (
              <AccountPanel title="Profile Settings" description="Update the profile details used across your account.">
                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#201B12]">Full Name</span>
                    <input
                      value={form.fullName}
                      onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                      className="w-full rounded-2xl bg-[#FEF2E3] px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#1F5D3B]/25"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[#201B12]">Phone</span>
                    <input
                      value={form.phone}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full rounded-2xl bg-[#FEF2E3] px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#1F5D3B]/25"
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-[#201B12]">Email</span>
                    <input
                      value={email}
                      disabled
                      className="w-full rounded-2xl bg-[#F2E6D7] px-4 py-3 text-sm text-[#56615B] outline-none"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={saving || loading}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1F5D3B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004526] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Profile
                    </button>
                  </div>
                </form>
              </AccountPanel>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function AccountPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-5 shadow-ambient sm:p-8"
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#1F5D3B]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[#201B12]">{title}</h2>
          <p className="mt-1 text-sm text-[#56615B]">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
