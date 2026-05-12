"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type ProfileTab = "orders" | "addresses" | "consultations" | "settings";

type ProfileForm = {
  fullName: string;
  phone: string;
};

type AddressForm = {
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  pin_code: string;
  is_default: boolean;
};

type Address = AddressForm & {
  id: string;
};

type ProfileOrder = {
  id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  total: number;
  items: unknown[];
  created_at: string;
};

type Consultation = {
  id: string;
  health_concern: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
};

type ProfileResponse = {
  user: { id: string; email: string | null };
  profile: { full_name: string | null; phone: string | null } | null;
  addresses: Address[];
  orders: ProfileOrder[];
  consultations: Consultation[];
  error?: string;
};

const emptyAddress: AddressForm = {
  recipient_name: "",
  phone: "",
  address: "",
  city: "",
  pin_code: "",
  is_default: true,
};

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
  const [form, setForm] = useState<ProfileForm>({ fullName: "Guest User", phone: "" });
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage(null);

    const response = await fetch("/api/profile", { cache: "no-store" });
    const data = (await response.json()) as ProfileResponse;

    if (response.status === 401) {
      router.replace("/login");
      return;
    }

    if (!response.ok) {
      setErrorMessage(data.error ?? "Could not load profile.");
      setLoading(false);
      return;
    }

    setEmail(data.user.email ?? "-");
    setForm({
      fullName: data.profile?.full_name || "Guest User",
      phone: data.profile?.phone || "",
    });
    setAddresses(data.addresses ?? []);
    setOrders(data.orders ?? []);
    setConsultations(data.consultations ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.fullName,
        phone: form.phone,
      }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not update profile.");
    } else {
      setSuccessMessage("Profile updated.");
      await loadProfile();
    }

    setSaving(false);
  };

  const handleAddAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await fetch("/api/profile/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not save address.");
    } else {
      setSuccessMessage("Address saved.");
      setAddressForm(emptyAddress);
      await loadProfile();
    }

    setSaving(false);
  };

  const deleteAddress = async (id: string) => {
    setSaving(true);
    const response = await fetch(`/api/profile/addresses?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not delete address.");
    } else {
      setSuccessMessage("Address deleted.");
      await loadProfile();
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
              <AccountPanel title="Order History" description="Track orders and payment status.">
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-[#FEF2E3] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-[#201B12]">
                            #{order.order_number}
                          </p>
                          <p className="mt-1 text-sm text-[#56615B]">
                            {new Date(order.created_at).toLocaleDateString()} -{" "}
                            {Array.isArray(order.items) ? order.items.length : 0} items
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-[#201B12]">Rs. {order.total}</p>
                          <p className="mt-1 text-xs text-[#56615B]">
                            {order.order_status} | {order.payment_status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <EmptyState text="No orders yet." />}
                </div>
              </AccountPanel>
            )}

            {activeTab === "addresses" && (
              <AccountPanel title="Saved Addresses" description="Manage delivery addresses for checkout.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="rounded-2xl bg-[#FEF2E3] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        {address.is_default && (
                          <span className="rounded-full bg-[#E8F3EC] px-3 py-1 text-xs font-medium text-[#1F5D3B]">
                            Default
                          </span>
                        )}
                        <button
                          onClick={() => void deleteAddress(address.id)}
                          className="ml-auto text-red-600"
                          aria-label="Delete address"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-medium text-[#201B12]">{address.recipient_name}</p>
                      <p className="mt-2 text-sm leading-6 text-[#56615B]">
                        {address.address}, {address.city} - {address.pin_code}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddAddress} className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-[#FEF2E3] p-4 sm:grid-cols-2">
                  <input value={addressForm.recipient_name} onChange={(event) => setAddressForm((prev) => ({ ...prev, recipient_name: event.target.value }))} placeholder="Recipient name" className="rounded-xl bg-white px-4 py-3 text-sm outline-none" />
                  <input value={addressForm.phone} onChange={(event) => setAddressForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" className="rounded-xl bg-white px-4 py-3 text-sm outline-none" />
                  <textarea value={addressForm.address} onChange={(event) => setAddressForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Full address" rows={3} className="rounded-xl bg-white px-4 py-3 text-sm outline-none sm:col-span-2" required />
                  <input value={addressForm.city} onChange={(event) => setAddressForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" className="rounded-xl bg-white px-4 py-3 text-sm outline-none" />
                  <input value={addressForm.pin_code} onChange={(event) => setAddressForm((prev) => ({ ...prev, pin_code: event.target.value }))} placeholder="PIN Code" className="rounded-xl bg-white px-4 py-3 text-sm outline-none" />
                  <label className="flex items-center gap-2 text-sm text-[#56615B]">
                    <input checked={addressForm.is_default} onChange={(event) => setAddressForm((prev) => ({ ...prev, is_default: event.target.checked }))} type="checkbox" />
                    Make default
                  </label>
                  <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5D3B] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    <Plus className="h-4 w-4" />
                    Add Address
                  </button>
                </form>
              </AccountPanel>
            )}

            {activeTab === "consultations" && (
              <AccountPanel title="Consultations" description="Your booked wellness consultations.">
                <div className="space-y-3">
                  {consultations.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-[#FEF2E3] p-4">
                      <p className="font-medium text-[#201B12]">{item.health_concern ?? "General Wellness"}</p>
                      <p className="mt-1 text-sm text-[#56615B]">
                        {item.preferred_date ?? "-"} | {item.preferred_time ?? "-"} | {item.status}
                      </p>
                    </div>
                  ))}
                  {consultations.length === 0 && <EmptyState text="No consultations booked yet." />}
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#FEF2E3] p-8 text-center text-sm text-[#56615B]">
      {text}
    </div>
  );
}
