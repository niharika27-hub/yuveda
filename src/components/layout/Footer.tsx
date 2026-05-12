import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Consultation", href: "/consultation" },
    { label: "Contact", href: "/contact" },
  ],
  Categories: [
    { label: "Churna", href: "/category/churna" },
    { label: "Pak", href: "/category/pak" },
    { label: "Capsules", href: "/category/capsules" },
    { label: "Oils", href: "/category/oils" },
    { label: "Juices", href: "/category/juices" },
  ],
  "Health Concerns": [
    { label: "Immunity Booster", href: "/concern/immunity-booster" },
    { label: "Digestive Care", href: "/concern/digestive-care" },
    { label: "Diabetic Care", href: "/concern/diabetic-care" },
    { label: "Cardiac Care", href: "/concern/cardiac-care" },
    { label: "Pain Relief", href: "/concern/pain-relief" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#004526] text-white/90 mt-auto">
      {/* Newsletter */}
      <div className="bg-[#1F5D3B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-white mb-1">
                Join the Wellness Journey
              </h3>
              <p className="text-white/70 text-sm">
                Get Ayurvedic tips, exclusive offers, and new product updates.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3 rounded-full bg-white/10 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 backdrop-blur-sm"
              />
              <button className="px-6 py-3 rounded-full bg-[#C9A961] text-[#251A00] font-medium text-sm hover:bg-[#E4C278] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C9A961] flex items-center justify-center">
                <span className="text-[#251A00] font-serif text-lg font-bold">Y</span>
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                Yuveda
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Ancient wisdom meets modern wellness. Premium Ayurvedic
              formulations crafted from nature&apos;s finest herbs for your
              holistic well-being.
            </p>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A961]" />
                <span>+91 98143 35533</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A961]" />
                <span>yuvedalife2008@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A961]" />
                <span>Garah City Colony, Opp. Radha Swami Satsang Ghar, Nawanshahar Road, Phillaur 144410, Punjab</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-serif text-lg text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[#C9A961] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 flex items-center gap-1.5">
              © 2024 Yuveda. Ancient Wisdom, Modern Wellness.
              <Leaf className="w-3.5 h-3.5 text-[#C9A961]" />
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <Link href="#" className="hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white/70 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white/70 transition-colors">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
