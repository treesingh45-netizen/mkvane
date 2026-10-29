import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, Check } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { useSiteConfig } from '../context/SiteConfigContext';

export function ServicesPage() {
  const { services, toggleServiceActive, updateServiceCopy } = useSiteConfig();
  const [manageOpen, setManageOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDesc, setDraftDesc] = useState('');

  const activeServices = services.filter((s) => s.active);

  const startEditing = (id: string, title: string, desc: string) => {
    setEditingId(id);
    setDraftTitle(title);
    setDraftDesc(desc);
  };

  const saveEdit = (id: string) => {
    updateServiceCopy(id, draftTitle, draftDesc);
    setEditingId(null);
  };

  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="Services — Man and Van, Removals & Collection Enquiries | MK Vane Ipswich"
        description="Explore moving and transport services you can enquire about with MK Vane in Ipswich, from house and flat moves to furniture transport and single-item collections."
      />

      {/* Full-Colour Photographic Services Hero with Dark Contrast Scrim */}
      <section className="relative py-24 lg:py-32 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/sprinter_uk_front.jpg"
          alt="High-roof silver commercial removal van parked in a UK street loading bay"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/68 to-[#202327]/32"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1]">
              Man and Van &middot; Removals &middot; Transport
            </p>
            <h1 className="font-seasons text-4xl sm:text-6xl font-medium text-white leading-[1.1] text-balance">
              Moving Services for Different Requirements
            </h1>
            <p className="text-base sm:text-lg text-[#F5F6F7]/90 leading-relaxed max-w-2xl">
              From single pieces of furniture and compact van loads to full
              household relocations, start by sharing what needs transporting
              and where it needs to go.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/book-a-move"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#202327] text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Enquire About a Move</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Service Categories + Owner Customisation Control */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-[#D9DDE1]">
            <div className="max-w-2xl">
              <span className="font-signature text-3xl text-[#555B61] block mb-1 leading-none">
                Tailored to your enquiry
              </span>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14]">
                Service Categories
              </h2>
              <p className="text-sm text-[#555B61] mt-3 leading-relaxed">
                Every enquiry is reviewed individually by MK Vane to confirm
                vehicle suitability, access requirements, and schedule
                availability.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setManageOpen((prev) => !prev)}
              aria-expanded={manageOpen}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#858B91] hover:text-[#34383D] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{manageOpen ? 'Done customising categories' : 'Customise categories'}</span>
            </button>
          </div>

          {/* Owner Service Category Toggle & Copy Editor */}
          {manageOpen && (
            <div className="mb-14 p-6 sm:p-8 bg-[#F5F6F7] border border-[#D9DDE1] space-y-5">
              <div>
                <h3 className="font-seasons text-2xl font-semibold text-[#34383D]">
                  Business Service Configuration
                </h3>
                <p className="text-xs text-[#555B61] mt-1">
                  Show or hide service categories or refine their descriptions
                  so only active services appear across the website and booking
                  planner.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-white border border-[#D9DDE1] flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-[#34383D]">
                        {s.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleServiceActive(s.id)}
                        className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                          s.active
                            ? 'bg-[#34383D] text-white border-[#34383D]'
                            : 'bg-white text-[#555B61] border-[#D9DDE1]'
                        }`}
                      >
                        {s.active ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditing(s.id, s.title, s.fullDescription)}
                      className="text-xs font-medium text-[#555B61] hover:text-[#34383D] underline text-left cursor-pointer"
                    >
                      Edit title &amp; description
                    </button>
                  </div>
                ))}
              </div>

              {editingId && (
                <div className="p-6 bg-white border border-[#34383D] space-y-4">
                  <h4 className="font-seasons text-xl font-semibold text-[#34383D]">
                    Edit Service Category
                  </h4>
                  <div>
                    <label
                      htmlFor="edit-service-title"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1.5"
                    >
                      Category Title
                    </label>
                    <input
                      id="edit-service-title"
                      type="text"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#D9DDE1] text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-service-desc"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1.5"
                    >
                      Category Description
                    </label>
                    <textarea
                      id="edit-service-desc"
                      rows={3}
                      value={draftDesc}
                      onChange={(e) => setDraftDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#D9DDE1] text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => saveEdit(editingId)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2.5 bg-white border border-[#D9DDE1] text-xs font-semibold uppercase tracking-wider text-[#555B61] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detailed Full-Colour Service Category Rows */}
          <div className="space-y-16 lg:space-y-20">
            {activeServices.map((service, index) => (
              <Reveal
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-16 lg:pb-20 border-b border-[#D9DDE1] last:border-b-0 last:pb-0"
              >
                <div
                  id={service.id}
                  className={`lg:col-span-5 scroll-mt-28 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <div className="aspect-[16/10] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                    <SafeImage
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`lg:col-span-7 flex flex-col justify-center space-y-5 ${
                    index % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#858B91] tabular-nums">
                    Service 0{index + 1}
                  </span>
                  <h3 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D] leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-base text-[#555B61] leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-3">
                      Helpful Details to Include in Your Enquiry:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {service.helpfulDetails.map((detail, i) => (
                        <li
                          key={i}
                          className="text-sm text-[#555B61] flex items-start gap-2 leading-relaxed"
                        >
                          <span className="text-[#858B91] select-none">&bull;</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/book-a-move?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Enquire About {service.title}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to Request a Quote */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <Reveal className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
                Checklist Before Enquiring
              </p>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                How to Request a Quote
              </h2>
              <p className="text-base text-[#555B61] leading-relaxed">
                Gathering these practical details before submitting your enquiry
                helps MK Vane assess the journey clearly and respond with an
                accurate quote.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="lg:col-span-7">
              <div className="bg-white border border-[#D9DDE1] p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: '01. Collection Address & Postcode',
                    note: 'Full street address and UK postcode where loading takes place.',
                  },
                  {
                    label: '02. Delivery Address & Postcode',
                    note: 'Complete destination address and postcode where items are heading.',
                  },
                  {
                    label: '03. Preferred Moving Date',
                    note: 'Your ideal moving date along with any flexibility or time window.',
                  },
                  {
                    label: '04. Item List & Box Count',
                    note: 'Clear breakdown of furniture, appliances, and approximate boxes.',
                  },
                  {
                    label: '05. Property Type',
                    note: 'House, flat or apartment, storage unit, or commercial premises.',
                  },
                  {
                    label: '06. Stairs, Lift & Parking Notes',
                    note: 'Floor levels, lift availability, narrow stairs, or parking rules.',
                  },
                  {
                    label: '07. Special Handling Notes',
                    note: 'Fragile items, bulky furniture dimensions, or extra stops.',
                  },
                  {
                    label: '08. Direct Contact Information',
                    note: 'Your full name, telephone number, and optional email address.',
                  },
                ].map((item) => (
                  <div key={item.label} className="pb-4 border-b border-[#F5F6F7] last:border-b-0 sm:nth-last-2:border-b-0">
                    <h3 className="text-sm font-semibold text-[#34383D]">
                      {item.label}
                    </h3>
                    <p className="text-xs text-[#555B61] mt-1 leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 lg:py-24 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal className="p-8 sm:p-12 bg-[#F5F6F7] border border-[#D9DDE1] space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
              Pricing Transparency
            </p>
            <h2 className="font-seasons text-3xl sm:text-4xl font-medium text-[#34383D] text-balance">
              Individual Quotes Based on Your Actual Move
            </h2>
            <p className="text-base text-[#555B61] leading-relaxed">
              Every move varies in route distance, load volume, floor level, and
              roadside loading access. Rather than displaying generic fixed
              price tables or automated online estimates, MK Vane reviews your
              submitted collection, delivery, and item details first and
              discusses a clear quote with you directly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl font-medium text-white leading-[1.14] text-balance">
              Tell Us What You Need to Move.
            </h2>
            <p className="text-base text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Use our step-by-step booking planner to share your postcodes,
              belongings, and preferred moving date.
            </p>
            <div className="pt-3">
              <Link
                to="/book-a-move"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
