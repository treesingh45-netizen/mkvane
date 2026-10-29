import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { CustomerReviewsSection } from '../components/CustomerReviewsSection';
import { BUSINESS_INFO } from '../data/siteContent';
import { useSiteConfig } from '../context/SiteConfigContext';

export function HomePage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { services } = useSiteConfig();
  const activeServices = services.filter((s) => s.active);

  const [collectionInput, setCollectionInput] = useState('');
  const [deliveryInput, setDeliveryInput] = useState('');
  const [preferredDateInput, setPreferredDateInput] = useState('');
  const [moveTypeInput, setMoveTypeInput] = useState(
    activeServices[0]?.title || 'House Removals'
  );

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (collectionInput.trim()) params.set('pickup', collectionInput.trim());
    if (deliveryInput.trim()) params.set('dropoff', deliveryInput.trim());
    if (preferredDateInput) params.set('date', preferredDateInput);
    if (moveTypeInput) params.set('service', moveTypeInput);
    navigate(`/book-a-move?${params.toString()}`);
  };

  return (
    <div className="bg-white text-[#34383D]">
      <PageSeo
        title="MK Vane — Man and Van, Removals & Transport Services in Ipswich"
        description="Planning a house move, furniture collection, or transport booking in Ipswich? Share your collection and delivery details with MK Vane."
      />

      {/* A. Full-Screen Homepage Hero with Full-Colour Moving Scene & Readability Overlay */}
      <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#202327]">
        <SafeImage
          src="/assets/photos/van_residential_carrying_boxes.jpg"
          alt="Mover carrying stacked cardboard boxes beside a white removal van parked on a residential street"
          className="absolute inset-0 w-full h-full object-cover object-[56%_center] sm:object-center"
        />
        {/* Measured charcoal overlay maintaining full-colour richness and >7:1 text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#202327]/74 via-[#202327]/56 to-[#202327]/78"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 pt-28 pb-20 text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#F5F6F7]/90 uppercase">
              Man and Van &middot; Removals &middot; Transport
            </p>

            <h1 className="font-seasons text-4xl sm:text-6xl lg:text-7xl font-medium text-white leading-[1.08] tracking-tight text-balance max-w-3xl mx-auto">
              Your Move. Your Journey. Made Simple.
            </h1>

            <p className="text-base sm:text-lg text-[#F5F6F7]/95 leading-relaxed max-w-2xl mx-auto">
              Planning a house move, a furniture collection, or a scheduled
              transport journey? MK Vane gives you a clear, straightforward way
              to share your pickup and delivery details in Ipswich and beyond.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/book-a-move"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>BOOK YOUR MOVE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <a
                href={BUSINESS_INFO.phoneHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#202327]/35 backdrop-blur-[2px] text-white border border-white/80 text-xs font-semibold tracking-widest uppercase hover:bg-white/15 transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>CALL {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* B. Introductory Brand Section */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6 space-y-6">
              <span className="font-signature text-3xl text-[#555B61] block leading-none">
                Moving forward, made simpler.
              </span>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                A More Straightforward Way to Arrange Your Move
              </h2>
              <p className="text-base text-[#555B61] leading-relaxed max-w-xl">
                Every successful move begins with clear preparation: knowing
                what needs collecting, where it is heading, and what access
                conditions exist at each property. MK Vane provides a structured
                starting point so you can share your moving details and discuss
                suitable arrangements directly.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#34383D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>DISCOVER MK VANE</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="aspect-[16/11] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                <SafeImage
                  src="/assets/photos/living_room_packed_boxes.jpg"
                  alt="Sunlit living room with taped cardboard moving boxes and protected furniture prepared for collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* C. How the Booking Journey Works */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-2xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-3">
              The Enquiry Process
            </p>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
              How the Booking Journey Works
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                num: '01',
                title: 'Enter Your Locations',
                desc: 'Provide the collection street address or postcode alongside the delivery destination.',
              },
              {
                num: '02',
                title: 'Describe What Is Moving',
                desc: 'Outline the property type, furniture items, approximate box count, and stair or parking access.',
              },
              {
                num: '03',
                title: 'Submit Your Enquiry',
                desc: 'Send your details to MK Vane so we can review the route, load size, and requested date.',
              },
              {
                num: '04',
                title: 'Confirm Arrangements',
                desc: 'Speak directly with MK Vane to agree availability, quote details, and your moving schedule.',
              },
            ].map((step, idx) => (
              <Reveal
                key={step.num}
                delay={idx * 0.05}
                className="bg-white border border-[#D9DDE1] p-8 h-full flex flex-col justify-between"
              >
                <div>
                  <span className="font-seasons text-3xl font-semibold text-[#858B91] tabular-nums block mb-4">
                    {step.num}
                  </span>
                  <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#555B61] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-[#D9DDE1]">
            <p className="text-sm text-[#555B61] max-w-2xl leading-relaxed">
              Please note: submitting our online form sends an enquiry for
              review and does not automatically confirm a booking until agreed
              with MK Vane.
            </p>
            <Link
              to="/book-a-move"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#34383D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0"
            >
              <span>START YOUR BOOKING</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* D. Services Preview */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-3">
                Moving &amp; Transport Enquiries
              </p>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                Services You Can Enquire About
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#34383D] hover:text-[#555B61] border-b border-[#34383D] pb-1 whitespace-nowrap shrink-0 self-start md:self-auto"
            >
              <span>View All Service Details</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service, idx) => (
              <Reveal
                key={service.id}
                delay={idx * 0.04}
                className="group border border-[#D9DDE1] bg-white h-full flex flex-col justify-between transition-colors hover:border-[#858B91]"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#F5F6F7] border-b border-[#D9DDE1]">
                    <SafeImage
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mb-2.5 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#555B61] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-1">
                  <Link
                    to={`/services#${service.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#34383D] group-hover:underline"
                  >
                    <span>Explore {service.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* E. Pickup and Drop-Off Interactive Preview */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <Reveal className="bg-white border border-[#D9DDE1] p-8 sm:p-12">
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-2">
                Quick Journey Planner
              </p>
              <h2 className="font-seasons text-3xl sm:text-4xl font-medium text-[#34383D] leading-tight text-balance">
                Where Are We Collecting and Delivering?
              </h2>
            </div>

            <form onSubmit={handlePreviewSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="home-collection"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Collection Postcode or Address
                  </label>
                  <input
                    id="home-collection"
                    type="text"
                    value={collectionInput}
                    onChange={(e) => setCollectionInput(e.target.value)}
                    placeholder="e.g. IP3 0QP or 3 Mersey Road, Ipswich"
                    className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="home-delivery"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Delivery Postcode or Address
                  </label>
                  <input
                    id="home-delivery"
                    type="text"
                    value={deliveryInput}
                    onChange={(e) => setDeliveryInput(e.target.value)}
                    placeholder="e.g. IP1 3QH or destination street"
                    className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="home-date"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Preferred Moving Date
                  </label>
                  <input
                    id="home-date"
                    type="date"
                    value={preferredDateInput}
                    onChange={(e) => setPreferredDateInput(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="home-move-type"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Type of Move
                  </label>
                  <select
                    id="home-move-type"
                    value={moveTypeInput}
                    onChange={(e) => setMoveTypeInput(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white transition-colors"
                  >
                    {activeServices.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#D9DDE1]">
                <p className="text-xs text-[#555B61] leading-relaxed max-w-xl">
                  Continuing opens the full Book a Move planner with these
                  route details pre-filled. Submitting a journey sends an
                  enquiry and does not confirm vehicle availability or a quote.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#34383D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>PLAN MY MOVE</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* F. Local Business Section */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-6 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
                Ipswich, Suffolk
              </p>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                Based in Ipswich. Ready to Hear About Your Move.
              </h2>
              <p className="text-base text-[#555B61] leading-relaxed max-w-xl">
                MK Vane operates from Ipswich, Suffolk. Whether you are moving
                within Ipswich or want to enquire about a collection and
                delivery route further afield, share both postcodes and we will
                review whether your journey can be accommodated.
              </p>

              <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1]">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                      Registered Base Location
                    </p>
                    <p className="text-base font-medium text-[#34383D] mt-0.5">
                      {BUSINESS_INFO.addressLine}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/areas-we-cover"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#34383D] border border-[#34383D] text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Check Areas We Cover</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="aspect-[16/10] w-full border border-[#D9DDE1] bg-[#F5F6F7] overflow-hidden">
                <SafeImage
                  src="/assets/photos/ipswich_waterfront.jpg"
                  alt="Sunny view of Ipswich Waterfront marina and quayside buildings in Suffolk, United Kingdom"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* G. Customer Information Section — Preparing for Moving Day */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
            <Reveal className="lg:col-span-7 space-y-4">
              <span className="font-signature text-3xl text-[#555B61] block leading-none">
                Practical preparation
              </span>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
                Preparing Details for a Smoother Move
              </h2>
              <p className="text-base text-[#555B61] leading-relaxed max-w-2xl">
                Sharing clear, practical information ahead of moving day helps
                prevent delays during loading and unloading at both properties.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="lg:col-span-5">
              <div className="aspect-[16/10] w-full border border-[#D9DDE1] bg-white overflow-hidden">
                <SafeImage
                  src="/assets/photos/writing_move_inventory_checklist.jpg"
                  alt="Preparing a written inventory list on top of sealed cardboard moving boxes"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Preparing Boxes and Belongings',
                body: 'Ensure cardboard boxes are securely taped underneath and on top, comfortable to lift, and clearly labelled by destination room.',
              },
              {
                title: 'Complete Addresses & Postcodes',
                body: 'Include full street names, house or apartment numbers, and accurate UK postcodes for every stop along your route.',
              },
              {
                title: 'Stairs, Lifts & Building Access',
                body: 'Let MK Vane know early if either address involves upper floors, narrow turns, communal hallways, or lift dimensions.',
              },
              {
                title: 'Parking & Loading Arrangements',
                body: 'Note residents-only parking zones, single or double yellow lines, narrow lanes, or timed loading bays outside each property.',
              },
              {
                title: 'Furniture Sizes & Quantities',
                body: 'List larger items such as corner sofas, wardrobes, beds, and dining tables alongside approximate box counts.',
              },
              {
                title: 'Fragile & Specialist Items',
                body: 'Highlight mirrors, glass tabletops, televisions, or delicate ornaments in your enquiry so safe handling can be planned.',
              },
            ].map((item, idx) => (
              <Reveal
                key={item.title}
                delay={idx * 0.04}
                className="bg-white border border-[#D9DDE1] p-7 h-full"
              >
                <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mb-2.5 leading-snug">
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

      {/* H. Professional Customer Reviews Section */}
      <CustomerReviewsSection />

      {/* I. Final Homepage CTA */}
      <section className="py-20 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.12] text-balance">
              Let&apos;s Get Your Move Started.
            </h2>
            <p className="text-base sm:text-lg text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Tell us where your move begins, where you are heading, and what
              needs transporting.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/book-a-move"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>BOOK A MOVE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/75 text-xs font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <span>CONTACT MK VANE</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
