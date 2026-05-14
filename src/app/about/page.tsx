export default function AboutPage() {
  const storyCards = [
    {
      title: "Our Legacy",
      description:
        "Yuveda was founded by Dr. Yuvraj Khosla with a vision to bring the healing wisdom of Ayurveda to everyday life. It carries forward the heritage of Noormehlia Hakim Ayurvedic Clinic in Main Bazar, Phillaur, Punjab.",
      iconClass: "fa-leaf",
    },
    {
      title: "Ayurvedic Expertise",
      description:
        "Our experienced practitioners include Dr. Yuvraj Khosla, Hakim Jugal Kishore Khosla, Dr. Sushant Khosla, and Vaidya Mohit Khosla—guiding holistic wellness with trusted care.",
      iconClass: "fa-heart",
    },
    {
      title: "Business Opportunities",
      description:
        "Aayrrattan Herbals (est. 2007) welcomes franchise and collaboration partners to expand nature-based healthcare solutions across communities.",
      iconClass: "fa-briefcase",
    },
  ];

  const stats = [
    { label: "Since 2007", icon: "fa-calendar" },
    { label: "100% Herbal", icon: "fa-seedling" },
    { label: "Trusted Ayurvedic Care", icon: "fa-shield" },
    { label: "Clinic Based in Phillaur", icon: "fa-location-dot" },
  ];

  return (
    <div className="relative overflow-hidden bg-[#FFF8F3] pt-24 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-12rem] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(228,194,120,0.55),transparent_65%)] blur-2xl" />
        <div className="absolute top-36 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(31,93,59,0.45),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(31,93,59,0.12)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 text-[#004526]/10" aria-hidden="true">
        <svg viewBox="0 0 1440 120" className="w-full h-24">
          <path
            fill="currentColor"
            d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1F5D3B] bg-[#E8F3EC] px-4 py-2 rounded-full">
            <i className="fa-solid fa-leaf" aria-hidden="true" />
            About Yuveda
          </span>
          <div className="mt-6 inline-flex items-center justify-center rounded-full border border-[#C9A961]/60 bg-white/70 px-6 py-3 shadow-ambient-sm">
            <h1 className="text-3xl sm:text-5xl font-serif text-[#201B12]">
              Rooted in Ayurveda, Designed for Modern Wellness
            </h1>
          </div>
          <p className="mt-4 text-[#56615B] text-base sm:text-lg">
            Yuveda brings together time-tested Ayurvedic wisdom and modern science
            to deliver pure, effective herbal care for everyday wellness.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-ambient-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A961] hover:bg-[#E8F3EC]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EC] text-[#1F5D3B]">
                <i className={`fa-solid ${stat.icon}`} aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-[#201B12] transition-colors duration-300 group-hover:text-[#1F5D3B]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {storyCards.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-[#E8F3EC] bg-white/90 p-6 shadow-ambient-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C9A961] hover:shadow-[0_20px_60px_rgba(31,93,59,0.22)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1F5D3B] via-[#C9A961] to-[#1F5D3B] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#1F5D3B] transition-transform duration-300 group-hover:scale-110">
                  <i className={`fa-solid ${card.iconClass}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-serif text-[#201B12]">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#56615B]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-ambient-sm">
            <h2 className="text-2xl font-serif text-[#201B12] mb-4">
              Clinic & Trust Rooted in Phillaur
            </h2>
            <p className="text-[#56615B] mb-6">
              Noormehlia Hakim Ayurvedic Clinic in Main Bazar, Phillaur, Punjab is
              the heart of Yuveda. It is where our formulations are refined and
              where real patient care inspires every product we create.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-[#F5E9DA] px-4 py-3">
                <div className="mt-1 text-[#1F5D3B]">
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#201B12]">Clinic</p>
                  <p className="text-xs text-[#56615B]">
                    Main Bazar, Phillaur, Punjab
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-[#E8F3EC] px-4 py-3">
                <div className="mt-1 text-[#1F5D3B]">
                  <i className="fa-solid fa-shield" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#201B12]">
                    Trusted Care
                  </p>
                  <p className="text-xs text-[#56615B]">
                    Patient-first Ayurvedic guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-[#1F5D3B] p-8 text-white shadow-ambient-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <i className="fa-solid fa-mortar-pestle" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Pure Herbal Promise</h3>
            </div>
            <p className="text-sm text-white/80 mb-6">
              We uphold a strict commitment to 100% herbal formulations,
              standardized extracts, and modern manufacturing practices—without
              compromising the authenticity of Ayurveda.
            </p>
            <ul className="space-y-2 text-sm text-white/80">
              {[
                "Carefully selected raw materials",
                "Traditional Ayurvedic wisdom",
                "Modern production standards",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A961]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-[#C9A961]/30 bg-gradient-to-r from-white via-[#FFF8F3] to-[#F5E9DA] p-8 shadow-ambient">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-serif text-[#201B12] mb-2">
                Interested in franchise, collaboration, or business opportunities?
              </h3>
              <p className="text-sm text-[#56615B]">
                Connect with the Yuveda team to explore growth partnerships and
                shared wellness goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:yuvedalife2008@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-[#1F5D3B] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                Email Us
              </a>
              <a
                href="tel:+919814335533"
                className="inline-flex items-center gap-2 rounded-full border border-[#1F5D3B] px-6 py-3 text-sm font-medium text-[#1F5D3B] transition-transform hover:-translate-y-0.5 hover:bg-[#E8F3EC]"
              >
                <i className="fa-solid fa-phone" aria-hidden="true" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
