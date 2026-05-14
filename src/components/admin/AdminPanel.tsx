"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CreditCard,
  Package,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Save,
  ShoppingBag,
  Star,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import {
  AdminCustomer,
  AdminOrder,
  AdminPayment,
  AdminProductRow,
  AdminProductReview,
  ConsultationRequest,
  deleteAdminProductReview,
  deleteAdminProduct,
  listCustomers,
  listAdminProducts,
  listAdminProductReviews,
  listConsultationRequests,
  listOrders,
  listPayments,
  saveAdminProduct,
  updateAdminProductReviewStatus,
  updateConsultationStatus,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/lib/admin-actions";

type Tab = "products" | "consultations" | "orders" | "payments" | "customers";

const emptyProduct: AdminProductRow = {
  "Product Name": "",
  Category: "Syrups",
  Quantity: "",
  Price: "",
  images: [],
  status: "active",
  stock_quantity: null,
  featured: false,
  concerns: [],
};

const tabs: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "products", label: "Products", icon: Package },
  { id: "consultations", label: "Consultations", icon: CalendarCheck },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "customers", label: "Customers", icon: Users },
];

function StatusSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-lg border border-[#d8d0bf] bg-white px-2 text-sm outline-none focus:border-[#1f5d3b]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [draftProduct, setDraftProduct] = useState<AdminProductRow>(emptyProduct);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [productReviews, setProductReviews] = useState<AdminProductReview[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const metrics = useMemo(
    () => ({
      products: products.length,
      reviews: productReviews.length,
      pendingConsultations: consultations.filter((item) => item.status === "pending").length,
      pendingOrders: orders.filter((item) => item.order_status !== "delivered").length,
      pendingPayments: payments.filter((item) => item.status !== "paid").length,
      customers: customers.length,
    }),
    [consultations, customers, orders, payments, productReviews, products]
  );

  const selectedProductReviews = useMemo(
    () =>
      productReviews.filter(
        (review) =>
          review.product_name.toLowerCase() === draftProduct["Product Name"].toLowerCase()
      ),
    [draftProduct, productReviews]
  );

  const loadAll = async () => {
    setMessage("Loading admin data...");
    try {
      const [productRows, reviewRows, consultationRows, orderRows, paymentRows, customerRows] = await Promise.all([
        listAdminProducts(),
        listAdminProductReviews(),
        listConsultationRequests(),
        listOrders(),
        listPayments(),
        listCustomers(),
      ]);
      setProducts(productRows);
      setProductReviews(reviewRows);
      setConsultations(consultationRows);
      setOrders(orderRows);
      setPayments(paymentRows);
      setCustomers(customerRows);
      if (!selectedName && productRows[0]) {
        setSelectedName(productRows[0]["Product Name"]);
        setDraftProduct(productRows[0]);
      }
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load admin data.");
    }
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (["products", "consultations", "orders", "payments", "customers"].includes(hash)) {
        setActiveTab(hash as Tab);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const selectProduct = (product: AdminProductRow) => {
    setSelectedName(product["Product Name"]);
    setDraftProduct({ ...product, images: product.images ?? [] });
  };

  const resetProduct = () => {
    setSelectedName("");
    setDraftProduct(emptyProduct);
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftProduct["Product Name"].trim()) {
      setMessage("Product name is required.");
      return;
    }

    setMessage("Saving product...");
    try {
      if (selectedName) {
        await saveAdminProduct(selectedName, draftProduct);
      } else {
        await saveAdminProduct(null, draftProduct);
      }
      await loadAll();
      setSelectedName(draftProduct["Product Name"]);
      setMessage("Product saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    }
  };

  const removeProduct = async () => {
    if (!selectedName) {
      return;
    }

    setMessage("Deleting product...");
    try {
      await deleteAdminProduct(selectedName);
      resetProduct();
      await loadAll();
      setMessage("Product deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete product.");
    }
  };

  const updateLocalProduct = (patch: Partial<AdminProductRow>) => {
    setDraftProduct((current) => ({ ...current, ...patch }));
  };

  const uploadProductImage = async (file: File) => {
    setUploadingImage(true);
    setMessage("Uploading product image...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Image upload failed.");
      }
      updateLocalProduct({ images: [...(draftProduct.images ?? []), result.url] });
      setMessage("Image uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#657367]">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-[#183628]">
            Yuveda Control Panel
          </h1>
          <p className="mt-2 text-[#5b695d]">
            Manage products, consultations, orders, and payment follow-up.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadAll()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6cfbf] bg-white px-4 py-2 text-sm text-[#4c604f] hover:bg-[#f1eadb]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Products", metrics.products],
          ["Reviews", metrics.reviews],
          ["Pending Consultations", metrics.pendingConsultations],
          ["Open Orders", metrics.pendingOrders],
          ["Pending Payments", metrics.pendingPayments],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-[#657367]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#183628]">{value}</p>
          </div>
        ))}
      </div>

      {message && (
        <p className="mb-4 rounded-lg bg-[#f4efe5] px-3 py-2 text-sm text-[#4c604f]">
          {message}
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                window.history.replaceState(null, "", `/admin#${tab.id}`);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#1f5d3b] text-white"
                  : "border border-[#d6cfbf] bg-white text-[#4c604f] hover:bg-[#f1eadb]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "products" && (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
            <button
              type="button"
              onClick={resetProduct}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8f3ec] px-3 py-2 text-sm font-medium text-[#1f5d3b]"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </button>
            <div className="max-h-[64vh] space-y-2 overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product["Product Name"]}
                  type="button"
                  onClick={() => selectProduct(product)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    selectedName === product["Product Name"]
                      ? "border-[#1f5d3b] bg-[#e8f3ec]"
                      : "border-[#ded7c9] hover:bg-[#f7f4ec]"
                  }`}
                >
                  <span className="block font-medium text-[#183628]">
                    {product["Product Name"]}
                  </span>
                  <span className="text-xs text-[#657367]">
                    {product.Category} | {product.Price || "No price"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <form onSubmit={saveProduct} className="rounded-lg border border-[#ded7c9] bg-white p-5 shadow-ambient-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-[#183628]">
                  {selectedName ? "Update Product" : "Add Product"}
                </h2>
                <div className="flex gap-2">
                  {selectedName && (
                    <button
                      type="button"
                      onClick={removeProduct}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1f5d3b] px-4 py-2 text-sm font-medium text-white hover:bg-[#17462d]"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-[#37483d]">
                  Product Name
                  <input
                    value={draftProduct["Product Name"]}
                    onChange={(event) => updateLocalProduct({ "Product Name": event.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Category
                  <input
                    value={draftProduct.Category ?? ""}
                    onChange={(event) => updateLocalProduct({ Category: event.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  />
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Quantity
                  <input
                    value={draftProduct.Quantity ?? ""}
                    onChange={(event) => updateLocalProduct({ Quantity: event.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  />
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Price
                  <input
                    value={draftProduct.Price ?? ""}
                    onChange={(event) => updateLocalProduct({ Price: event.target.value })}
                    placeholder="Example: 150 or Rs. 80, Rs. 150"
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  />
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Status
                  <select
                    value={draftProduct.status ?? "active"}
                    onChange={(event) => updateLocalProduct({ status: event.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] bg-white px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Stock Quantity
                  <input
                    type="number"
                    value={draftProduct.stock_quantity ?? ""}
                    onChange={(event) =>
                      updateLocalProduct({
                        stock_quantity: event.target.value ? Number(event.target.value) : null,
                      })
                    }
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  />
                </label>
                <label className="flex items-center gap-2 pt-6 text-sm font-medium text-[#37483d]">
                  <input
                    type="checkbox"
                    checked={Boolean(draftProduct.featured)}
                    onChange={(event) => updateLocalProduct({ featured: event.target.checked })}
                    className="h-4 w-4 rounded border-[#d8d0bf]"
                  />
                  Featured product
                </label>
                <label className="text-sm font-medium text-[#37483d]">
                  Concerns
                  <input
                    value={(draftProduct.concerns ?? []).join(", ")}
                    onChange={(event) =>
                      updateLocalProduct({
                        concerns: event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Digestive Care, Immunity Booster"
                    className="mt-1 h-10 w-full rounded-lg border border-[#d8d0bf] px-3 text-sm outline-none focus:border-[#1f5d3b]"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium text-[#37483d]">
                Images
                <textarea
                  value={(draftProduct.images ?? []).join("\n")}
                  onChange={(event) =>
                    updateLocalProduct({
                      images: event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={5}
                  placeholder="/productimages/example.jpeg"
                  className="mt-1 w-full rounded-lg border border-[#d8d0bf] px-3 py-2 text-sm outline-none focus:border-[#1f5d3b]"
                />
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d6cfbf] bg-white px-3 py-2 text-sm text-[#4c604f] hover:bg-[#f1eadb]">
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadProductImage(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {(draftProduct.images ?? []).slice(0, 5).map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt=""
                    className="h-14 w-14 rounded-lg border border-[#ded7c9] bg-[#f7f4ec] object-contain p-1"
                  />
                ))}
              </div>
            </form>

            <section className="rounded-lg border border-[#ded7c9] bg-white p-5 shadow-ambient-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#183628]">Product Reviews</h2>
                  <p className="text-sm text-[#657367]">
                    {selectedProductReviews.length} review{selectedProductReviews.length === 1 ? "" : "s"} for this product
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadAll()}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#d6cfbf] px-3 py-2 text-sm text-[#4c604f] hover:bg-[#f1eadb]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {selectedProductReviews.map((review) => (
                  <article key={review.id} className="rounded-lg border border-[#e4ddcf] bg-[#fbfaf5] p-4">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#183628]">{review.reviewer_name}</p>
                          <span className="inline-flex items-center gap-1 text-xs text-[#c59a2e]">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-3.5 w-3.5 ${index < review.rating ? "fill-current" : "text-[#d8d0bf]"}`}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#657367]">
                          {review.reviewer_email ?? "No email"} | {new Date(review.created_at).toLocaleDateString()}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#4c604f]">{review.comment}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusSelect
                          value={review.status}
                          options={["approved", "pending", "hidden"]}
                          onChange={async (status) => {
                            await updateAdminProductReviewStatus(review.id, status);
                            await loadAll();
                          }}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteAdminProductReview(review.id);
                            await loadAll();
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                {selectedProductReviews.length === 0 && <EmptyState text="No reviews for this product yet." />}
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === "consultations" && (
        <div className="space-y-3">
          {consultations.map((item) => (
            <article key={item.id} className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <h2 className="text-lg font-semibold text-[#183628]">{item.full_name}</h2>
                  <p className="text-sm text-[#657367]">
                    {item.health_concern} | {item.preferred_date} | {item.preferred_time}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.phone ? (
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d6cfbf] bg-[#fbfaf5] px-3 py-1.5 text-sm font-medium text-[#183628] hover:bg-[#f1eadb]"
                      >
                        <Phone className="h-4 w-4" />
                        {item.phone}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd0] bg-[#fbfaf5] px-3 py-1.5 text-sm text-[#8a7560]">
                        <Phone className="h-4 w-4" />
                        No phone
                      </span>
                    )}
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#d6cfbf] bg-[#fbfaf5] px-3 py-1.5 text-sm font-medium text-[#183628] hover:bg-[#f1eadb]"
                      >
                        <Mail className="h-4 w-4" />
                        {item.email}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd0] bg-[#fbfaf5] px-3 py-1.5 text-sm text-[#8a7560]">
                        <Mail className="h-4 w-4" />
                        No email
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[#4c604f]">{item.condition_details}</p>
                </div>
                <StatusSelect
                  value={item.status}
                  options={["pending", "contacted", "scheduled", "completed", "cancelled"]}
                  onChange={async (status) => {
                    await updateConsultationStatus(item.id, status);
                    await loadAll();
                  }}
                />
              </div>
            </article>
          ))}
          {consultations.length === 0 && <EmptyState text="No consultations yet." />}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h2 className="text-lg font-semibold text-[#183628]">#{order.order_number}</h2>
                  <p className="text-sm text-[#657367]">
                    {order.customer_name} | {order.phone} | Rs. {order.total}
                  </p>
                  <p className="mt-1 text-sm text-[#4c604f]">
                    {order.address}, {order.city} - {order.pin_code}
                  </p>
                </div>
                <StatusSelect
                  value={order.order_status}
                  options={["placed", "packed", "shipped", "delivered", "cancelled"]}
                  onChange={async (status) => {
                    await updateOrderStatus(order.id, status);
                    await loadAll();
                  }}
                />
              </div>
            </article>
          ))}
          {orders.length === 0 && <EmptyState text="No orders yet." />}
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-3">
          {payments.map((payment) => (
            <article key={payment.id} className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-[#183628]">
                    {payment.order_number ? `#${payment.order_number}` : "Manual payment"}
                  </h2>
                  <p className="text-sm text-[#657367]">
                    {payment.customer_name ?? "-"} | {payment.method} | Rs. {payment.amount}
                  </p>
                </div>
                <StatusSelect
                  value={payment.status}
                  options={["pending", "paid", "failed", "refunded"]}
                  onChange={async (status) => {
                    await updatePaymentStatus(payment.id, status);
                    await loadAll();
                  }}
                />
              </div>
            </article>
          ))}
          {payments.length === 0 && <EmptyState text="No payments yet." />}
        </div>
      )}

      {activeTab === "customers" && (
        <div className="space-y-3">
          {customers.map((customer) => (
            <article key={customer.id} className="rounded-lg border border-[#ded7c9] bg-white p-4 shadow-ambient-sm">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-[#183628]">
                    {customer.full_name || "Unnamed customer"}
                  </h2>
                  <p className="text-sm text-[#657367]">
                    {customer.email ?? "-"} | {customer.phone ?? "No phone"}
                  </p>
                </div>
                <p className="text-xs text-[#657367]">
                  Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </article>
          ))}
          {customers.length === 0 && <EmptyState text="No customers yet." />}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#d6cfbf] bg-white p-8 text-center text-sm text-[#657367]">
      {text}
    </div>
  );
}
