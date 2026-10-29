import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { BUSINESS_INFO } from '../data/siteContent';

export function AboutPage() {
  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="About MK Vane — Man and Van & Removals Enquiries in Ipswich"
        description="Learn about MK Vane, your starting point for man-and-van, removals, and transport enquiries based in Ipswich, Suffolk."
      />

      {/* Full-Colour Photographic Hero Banner with Readability Scrim */}
      <section className="relative py-24 lg:py-32 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/packing_kitchen_belongings.jpg"
          alt="Wrapping household kitchen items in kraft paper and packing cardboard moving boxes"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/70 to-[#202327]/35"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1]">
              Ipswich, Suffolk &middot; United Kingdom
            </p>
            <h1 className="font-seasons text-4xl sm:text-6xl font-medium text-white leading-[1.1] text-balance">
              About MK Vane
            </h1>
            <p className="text-base sm:text-lg text-[#F5F6F7]/90 leading-relaxed max-w-2xl">
              A practical, straightforward starting point for man-and-van,
              household removals, and transport enquiries in Ipswich and
              surrounding areas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Section 1 — Who We Are + Movers Working Photograph */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6 space-y-6">
              <span className="font-signature text-3xl text-[#555B61] block leading-none">
                Clear details, direct arrangements.
              </span>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                Who We Are
              </h2>
              <div className="space-y-4 text-base text-[#555B61] leading-relaxed">
                <p>
                  MK Vane is an Ipswich-based business helping customers plan
                  and arrange moving and transport journeys with clarity. We
                  recognise that organising a move involves much more than
                  picking a date on a calendar—every job depends on what is
                  being carried, how properties are accessed, and how items are
                  prepared before loading.
                </p>
                <p>
                  Our service starts with attentive communication. By making it
                  easy to share your collection and delivery postcodes, item
                  lists, and building access notes upfront, we ensure both sides
                  have an accurate picture of the move before confirming the
                  next steps.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#D9DDE1]">
                <div>
                  <h3 className="font-seasons text-xl font-semibold text-[#34383D] mb-1.5">
                    Organised Enquiries
                  </h3>
                  <p className="text-sm text-[#555B61] leading-relaxed">
                    Share pickup and drop-off postcodes, room inventories, and
                    parking notes in one clear sequence.
                  </p>
                </div>
                <div>
                  <h3 className="font-seasons text-xl font-semibold text-[#34383D] mb-1.5">
                    Direct Confirmation
                  </h3>
                  <p className="text-sm text-[#555B61] leading-relaxed">
                    Speak directly with MK Vane to review route suitability,
                    dates, and agreed terms before any booking is finalised.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="aspect-[16/11] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                <SafeImage
                  src="/assets/photos/van_inventory_check_team.jpg"
                  alt="Movers checking stacked cardboard moving boxes and inventory notes at the rear of a removal van"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 2 — Our Approach */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-3">
              How We Work
            </p>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
              Our Approach to Every Enquiry
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                num: '01',
                title: 'Clear Communication First',
                body: 'No two moves are identical. Rather than relying on guesswork, we ask practical questions early so that furniture sizes, box counts, and timings are properly understood.',
              },
              {
                num: '02',
                title: 'Accurate Pickup & Delivery Details',
                body: 'Full UK postcodes, floor levels, lift access, and roadside parking details allow MK Vane to review routes and loading conditions realistically.',
              },
              {
                num: '03',
                title: 'Honest, Transparent Quotes',
                body: 'We do not display automated instant estimates or unverified availability slots. Every enquiry is reviewed on its actual requirements before a quote is offered.',
              },
              {
                num: '04',
                title: 'Agreed Moving Arrangements',
                body: 'A booking only goes ahead once MK Vane and the customer have discussed the items involved, confirmed date availability, and agreed on the arrangement.',
              },
            ].map((item, idx) => (
              <Reveal
                key={item.num}
                delay={idx * 0.05}
                className="bg-white border border-[#D9DDE1] p-8 sm:p-10 h-full"
              >
                <span className="font-seasons text-2xl font-semibold text-[#858B91] tabular-nums block mb-3">
                  {item.num}
                </span>
                <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#555B61] leading-relaxed">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Preparing Belongings & What Customers Can Expect */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6 space-y-6">
              <div className="aspect-[16/10] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                <SafeImage
                  src="/assets/photos/sealing_moving_box_tape.jpg"
                  alt="Hands sealing a packed cardboard moving box securely with packing tape before moving day"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[16/9] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                <SafeImage
                  src="/assets/photos/packing_fragile_glassware.jpg"
                  alt="Carefully cushioning fragile glassware inside a protective cardboard moving box"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
                Customer Experience
              </p>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                Careful Preparation &amp; What You Can Expect
              </h2>
              <p className="text-base text-[#555B61] leading-relaxed">
                Whether you are packing household belongings across several
                rooms or preparing a few fragile items for transit, our enquiry
                workflow keeps every stage clear and straightforward:
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  'A structured, step-by-step online planner to record collection and delivery addresses.',
                  'Dedicated space to note bulky furniture dimensions, fragile boxes, stairs, lifts, and parking.',
                  'Direct telephone, email, and WhatsApp contact channels whenever you prefer to speak with us.',
                  'Clear confirmation of vehicle suitability, quote details, and scheduling before your move is booked.',
                ].map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-[#F5F6F7] last:border-b-0"
                  >
                    <span className="font-seasons text-lg font-semibold text-[#858B91] tabular-nums shrink-0">
                      0{index + 1}.
                    </span>
                    <span className="text-sm text-[#34383D] leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 4 — Our Location */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="bg-white border border-[#D9DDE1] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
                Our Location
              </p>
              <h2 className="font-seasons text-3xl sm:text-4xl font-medium text-[#34383D]">
                Based in Ipswich, Suffolk
              </h2>
              <div className="flex items-start gap-2.5 pt-1 text-base text-[#34383D] font-medium">
                <MapPin
                  className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{BUSINESS_INFO.addressLine}</span>
              </div>
              <p className="text-sm text-[#555B61] leading-relaxed pt-1">
                Share your collection and destination postcodes so MK Vane can
                confirm whether your requested route can be accommodated.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                to="/areas-we-cover"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#34383D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Areas We Cover</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 5 — Final CTA */}
      <section className="py-20 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl font-medium text-white leading-[1.14] text-balance">
              Every Move Starts with a Conversation.
            </h2>
            <p className="text-base text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Get in touch with your moving questions or head straight to our
              journey planner to share your pickup and delivery details.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/book-a-move"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/75 text-xs font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <span>BOOK A MOVE</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
