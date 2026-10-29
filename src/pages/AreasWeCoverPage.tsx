import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Plus,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { BUSINESS_INFO } from '../data/siteContent';
import { useSiteConfig } from '../context/SiteConfigContext';

export function AreasWeCoverPage() {
  const { coverageAreas, addCoverageArea, removeCoverageArea } = useSiteConfig();
  const [manageAreas, setManageAreas] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaNotes, setNewAreaNotes] = useState('');

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    addCoverageArea(newAreaName, newAreaNotes);
    setNewAreaName('');
    setNewAreaNotes('');
  };

  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="Areas We Cover — Ipswich Base & Journey Enquiries | MK Vane"
        description="MK Vane is based at 3 Mersey Road, Ipswich, Suffolk (IP3 0QP). Share your collection and destination postcodes to check whether your move can be accommodated."
      />

      {/* Full-Colour UK Residential Removals Hero Banner with Dark Contrast Scrim */}
      <section className="relative py-24 lg:py-32 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/moving_house_uk.jpg"
          alt="Residential UK brick street with a removals vehicle parked outside homes on moving day"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/68 to-[#202327]/32"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1]">
              Ipswich, Suffolk &middot; IP3 0QP
            </p>
            <h1 className="font-seasons text-4xl sm:text-6xl font-medium text-white leading-[1.1] text-balance">
              Serving Ipswich &amp; Reviewing Your Route Enquiries
            </h1>
            <p className="text-base sm:text-lg text-[#F5F6F7]/90 leading-relaxed max-w-2xl">
              MK Vane operates from 3 Mersey Road in Ipswich, Suffolk. Share
              your collection and destination postcodes so we can confirm
              whether your local or onward route can be accommodated.
            </p>
            <div className="pt-2">
              <Link
                to="/book-a-move"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#202327] text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Check Your Postcodes</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Business Address & Full-Colour Directions Map Section */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Address Card */}
            <Reveal className="lg:col-span-5 bg-[#F5F6F7] border border-[#D9DDE1] p-8 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
                  Verified Base Location
                </p>
                <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                  {BUSINESS_INFO.brandName}
                </h2>
                <div className="flex items-start gap-3 text-base text-[#34383D]">
                  <MapPin
                    className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <address className="not-italic leading-relaxed">
                    3 Mersey Road
                    <br />
                    Ipswich, Suffolk
                    <br />
                    IP3 0QP
                    <br />
                    United Kingdom
                  </address>
                </div>

                <p className="text-xs text-[#555B61] leading-relaxed pt-3 border-t border-[#D9DDE1]">
                  Please note: 3 Mersey Road is MK Vane&apos;s registered base
                  address and is not a public drop-in counter unless arranged
                  directly beforehand.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#34383D] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link
                  to="/book-a-move"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-[#34383D] border border-[#34383D] text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Enter Your Postcodes</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            {/* Responsive Full-Colour Map Container */}
            <Reveal delay={0.08} className="lg:col-span-7 flex flex-col">
              <div className="flex-1 min-h-[380px] border border-[#D9DDE1] bg-[#F5F6F7] flex flex-col">
                <iframe
                  title="Map showing 3 Mersey Road, Ipswich, IP3 0QP, United Kingdom"
                  src={BUSINESS_INFO.googleMapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full flex-1 min-h-[340px] border-0"
                />
                <div className="px-5 py-3.5 bg-white border-t border-[#D9DDE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#555B61]">
                  <span>
                    Base Address: 3 Mersey Road, Ipswich, IP3 0QP, United Kingdom
                  </span>
                  <a
                    href={BUSINESS_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#34383D] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Coverage Information & Editable Service-Area List */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="font-signature text-3xl text-[#555B61] block mb-1 leading-none">
                Local focus, clear scope
              </span>
              <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14]">
                Coverage Information
              </h2>
              <p className="text-sm text-[#555B61] mt-3 leading-relaxed">
                Ipswich is MK Vane&apos;s confirmed primary base. Additional
                routes and surrounding postcode areas are reviewed individually
                based on your enquiry details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setManageAreas((prev) => !prev)}
              aria-expanded={manageAreas}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#858B91] hover:text-[#34383D] transition-colors self-start md:self-auto cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{manageAreas ? 'Close area editor' : 'Update coverage areas'}</span>
            </button>
          </div>

          {manageAreas && (
            <form
              onSubmit={handleAddArea}
              className="mb-10 p-6 sm:p-8 bg-white border border-[#34383D] space-y-4"
            >
              <h3 className="font-seasons text-2xl font-semibold text-[#34383D]">
                Add Confirmed Town or Postcode Area
              </h3>
              <p className="text-xs text-[#555B61]">
                Only add towns or postcode districts once MK Vane confirms
                regular service coverage for those locations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-area-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1.5"
                  >
                    Town or Postcode District
                  </label>
                  <input
                    id="new-area-name"
                    type="text"
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="e.g. Felixstowe (IP11) or Woodbridge (IP12)"
                    className="w-full px-3.5 py-2.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-area-notes"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1.5"
                  >
                    Coverage Notes
                  </label>
                  <input
                    id="new-area-notes"
                    type="text"
                    value={newAreaNotes}
                    onChange={(e) => setNewAreaNotes(e.target.value)}
                    placeholder="e.g. Available for house and flat moves upon enquiry"
                    className="w-full px-3.5 py-2.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Confirmed Area</span>
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coverageAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white border border-[#D9DDE1] p-7 h-full flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                        {area.status}
                      </p>
                      <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mt-1">
                        {area.name}
                      </h3>
                    </div>
                    {manageAreas && area.id !== 'ipswich-central' && (
                      <button
                        type="button"
                        onClick={() => removeCoverageArea(area.id)}
                        aria-label={`Remove ${area.name}`}
                        className="p-1.5 text-[#555B61] hover:text-[#202327] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[#555B61] leading-relaxed mt-3">
                    {area.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Residential Streets & Connected Routes Photographic Section */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-2xl mb-14 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
              Route Suitability Check
            </p>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
              Local Streets &amp; Onward Journey Enquiries
            </h2>
            <p className="text-base text-[#555B61] leading-relaxed">
              Even if one end of your move lies outside central Ipswich, enter
              both collection and destination postcodes on the Book a Move page
              so MK Vane can review the full route.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal className="border border-[#D9DDE1] bg-[#F5F6F7] flex flex-col">
              <div className="aspect-[16/10] w-full overflow-hidden bg-white border-b border-[#D9DDE1]">
                <SafeImage
                  src="/assets/photos/suffolk_houses.jpg"
                  alt="Residential brick and rendered semi-detached homes along a street in Suffolk, England"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-7 space-y-2.5">
                <h3 className="font-seasons text-2xl font-semibold text-[#34383D]">
                  Residential Streets &amp; Property Access
                </h3>
                <p className="text-sm text-[#555B61] leading-relaxed">
                  Sharing driveway access, street width, permit zones, or cul-de-sac
                  turning details helps us plan safe loading outside terraced,
                  semi-detached, and apartment properties.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06} className="border border-[#D9DDE1] bg-[#F5F6F7] flex flex-col">
              <div className="aspect-[16/10] w-full overflow-hidden bg-white border-b border-[#D9DDE1]">
                <SafeImage
                  src="/assets/photos/ipswich_station.jpg"
                  alt="Historic brick station forecourt and transport connection hub in Ipswich, Suffolk"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-7 space-y-2.5">
                <h3 className="font-seasons text-2xl font-semibold text-[#34383D]">
                  Ipswich Origins &amp; Connected Destinations
                </h3>
                <p className="text-sm text-[#555B61] leading-relaxed">
                  Moving from Ipswich to another town, or collecting an item
                  elsewhere for delivery back into Suffolk? Provide both full
                  UK postcodes and preferred dates for a direct review.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl font-medium text-white leading-[1.14] text-balance">
              Share Your Pickup &amp; Destination Postcodes.
            </h2>
            <p className="text-base text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Submit your route details and preferred moving date for a direct
              review from MK Vane.
            </p>
            <div className="pt-3">
              <Link
                to="/book-a-move"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>CHECK YOUR JOURNEY</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
