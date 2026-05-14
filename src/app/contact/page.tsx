import Link from "next/link";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17uKq1FFqo/?mibextid=wwXIfr",
    icon: "fa-facebook-f",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yuveda_aayurrattan_herbals?igsh=bzM3ZHgwYnBqcjhl",
    icon: "fa-instagram",
  },
];

const quickContacts = [
  {
    title: "Call Us",
    value: "+91 98143 35533",
    href: "tel:+919814335533",
    icon: "fa-phone",
  },
  {
    title: "Email",
    value: "yuvedalife2008@gmail.com",
    href: "mailto:yuvedalife2008@gmail.com",
    icon: "fa-envelope",
  },
  {
    title: "Clinic",
    value: "Main Bazar, Phillaur, Punjab, India",
    href: "https://maps.google.com/?q=Main%20Bazar%2C%20Phillaur%2C%20Punjab%2C%20India",
    icon: "fa-location-dot",
  },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-[#FFF8F3] pt-24 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-28 left-[-8rem] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(31,93,59,0.45),transparent_65%)] blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-10rem] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(228,194,120,0.55),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(31,93,59,0.12)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1F5D3B] bg-[#E8F3EC] px-4 py-2 rounded-full">
            <i className="fa-solid fa-leaf" aria-hidden="true" />
            Contact Yuveda
          </span>
          <div className="mt-6 inline-flex items-center justify-center rounded-full border border-[#C9A961]/60 bg-white/70 px-6 py-3 shadow-ambient-sm">
            <h1 className="text-3xl sm:text-5xl font-serif text-[#201B12]">
              Let&apos;s Connect for Wellness
            </h1>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-[#56615B]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
              <i className="fa-solid fa-heart" aria-hidden="true" />
              Ayurvedic guidance
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
              <i className="fa-solid fa-shield" aria-hidden="true" />
              Pure herbal care
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
              <i className="fa-solid fa-seedling" aria-hidden="true" />
              Trusted since 2007
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickContacts.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-ambient-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A961] hover:shadow-[0_20px_60px_rgba(31,93,59,0.22)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#1F5D3B] transition-transform duration-300 group-hover:scale-110">
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#201B12]">
                  {item.title}
                </div>
                <div className="text-sm text-[#56615B]">{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-ambient-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A961] hover:shadow-[0_20px_60px_rgba(31,93,59,0.18)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#1F5D3B]">
                <i className="fa-solid fa-map-location-dot" aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-serif text-[#201B12]">Meet Us</div>
                <div className="text-sm text-[#56615B]">Clinic visit & local guidance</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F5E9DA] px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8F3EC]">
                <div className="text-sm font-semibold text-[#201B12]">Clinic</div>
                <div className="text-sm text-[#56615B]">Main Bazar, Phillaur</div>
                <div className="text-xs text-[#56615B]">Punjab, India</div>
              </div>
              <div className="rounded-2xl bg-[#E8F3EC] px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5E9DA]">
                <div className="text-sm font-semibold text-[#201B12]">Hours</div>
                <div className="text-sm text-[#56615B]">Mon - Sat</div>
                <div className="text-xs text-[#56615B]">10:00 AM - 6:00 PM</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-full bg-[#1F5D3B] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-stethoscope" aria-hidden="true" />
                Book Consultation
              </Link>
              <a
                href="https://maps.google.com/?q=Main%20Bazar%2C%20Phillaur%2C%20Punjab%2C%20India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#1F5D3B] px-6 py-3 text-sm font-medium text-[#1F5D3B] transition-transform hover:-translate-y-0.5 hover:bg-[#E8F3EC]"
              >
                <i className="fa-solid fa-location-arrow" aria-hidden="true" />
                Get Directions
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-[#C9A961]/30 bg-gradient-to-b from-white via-[#FFF8F3] to-[#F5E9DA] p-8 shadow-ambient">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F5D3B] text-white">
                <i className="fa-solid fa-share-nodes" aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-serif text-[#201B12]">Social Glow</div>
                <div className="text-sm text-[#56615B]">Follow & stay inspired</div>
              </div>
            </div>
            <div className="space-y-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-medium text-[#201B12] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A961]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EC] text-[#1F5D3B] transition-transform duration-300 group-hover:scale-110">
                    <i className={`fa-brands ${social.icon}`} aria-hidden="true" />
                  </span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
