import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/siteContent';

type LegalModalKey =
  | 'privacy'
  | 'terms'
  | 'booking-info'
  | 'accessibility'
  | 'cookies'
  | null;

const LEGAL_CONTENT: Record<
  Exclude<LegalModalKey, null>,
  { title: string; paragraphs: string[] }
> = {
  privacy: {
    title: 'Privacy Policy — MK Vane',
    paragraphs: [
      'MK Vane collects only the personal and journey information you choose to submit via our Book a Move and Contact forms—such as your full name, telephone number, optional email address, collection and delivery postcodes, moving details, and any optional item photographs.',
      'Submitted details are used solely to review your transport or removals enquiry, discuss quotes and route suitability, and communicate with you regarding potential arrangements.',
      'Customer contact information and uploaded item photographs are never published publicly or sold to third parties. To request an update or removal of an enquiry record, contact MK Vane at mkvane@gmail.com or +44 7708 632170.',
    ],
  },
  terms: {
    title: 'Terms and Conditions — Website Enquiries',
    paragraphs: [
      'This website provides information about MK Vane and offers an online enquiry facility for man-and-van, removals, and transport requests based in Ipswich, Suffolk.',
      'Submitting an enquiry form on this website does not create a binding transport contract, reserve a timeslot, or guarantee vehicle availability. All service dates, scope of items, access requirements, and charges must be reviewed and explicitly agreed directly between the customer and MK Vane.',
      'Photographs of vehicles used across the website are licensed illustrative photographs and are not presented as specific vehicles in an active company fleet.',
    ],
  },
  'booking-info': {
    title: 'Booking & Enquiry Information',
    paragraphs: [
      'Every move enquiry submitted through MK Vane is reviewed individually. Please provide accurate UK postcodes, floor levels, stair or lift details, parking conditions, and a clear description of the belongings to be moved.',
      'No online payments or automated instant prices are taken through this website. Quotes and final booking confirmations are arranged directly with MK Vane after reviewing your submitted details.',
    ],
  },
  accessibility: {
    title: 'Accessibility Information',
    paragraphs: [
      'MK Vane aims to make this website clear and usable across desktop computers, tablets, and mobile telephones. We maintain readable contrast across our charcoal and white design system, support keyboard focus navigation, and honour system reduced-motion preferences.',
      'If you experience any difficulty using our online forms or prefer to share your moving details by telephone, please call MK Vane directly on +44 7708 632170.',
    ],
  },
  cookies: {
    title: 'Cookie & Local Storage Preferences',
    paragraphs: [
      'This website uses essential session state to preserve your progress while completing multi-step move enquiries so that navigating between steps does not erase your typed addresses.',
      'We do not run third-party advertising trackers on this website.',
    ],
  },
};

export function Footer() {
  const [activeModal, setActiveModal] = useState<LegalModalKey>(null);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#202327] text-[#D9DDE1] border-t border-[#34383D]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#34383D]">
            {/* Column 1: Brand Overview */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-sm">
                  <img
                    src={BUSINESS_INFO.logoPath}
                    alt="MK Vane delivery van emblem"
                    className="h-7 w-auto object-contain"
                  />
                </span>
                <span className="font-seasons text-2xl font-semibold text-white tracking-tight">
                  {BUSINESS_INFO.brandName}
                </span>
              </Link>
              <p className="text-sm text-[#D9DDE1]/80 leading-relaxed max-w-sm">
                Man and van, removals, and transport enquiries based in Ipswich,
                Suffolk. Share your collection and delivery details clearly and
                discuss your move directly with MK Vane.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wider text-white">
                <Link
                  to="/book-a-move"
                  className="border-b border-white/60 pb-0.5 hover:border-white transition-colors"
                >
                  Plan a Move
                </Link>
                <span className="text-[#555B61]" aria-hidden="true">
                  &middot;
                </span>
                <a
                  href="/#reviews"
                  className="border-b border-white/60 pb-0.5 hover:border-white transition-colors"
                >
                  Customer Reviews
                </a>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="lg:col-span-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-5">
                Navigation
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/book-a-move" className="hover:text-white transition-colors">
                    Book a Move
                  </Link>
                </li>
                <li>
                  <Link
                    to="/areas-we-cover"
                    className="hover:text-white transition-colors"
                  >
                    Areas We Cover
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Verified Contact */}
            <div className="lg:col-span-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-5">
                Contact MK Vane
              </h2>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <span className="block text-xs text-[#858B91] mb-0.5">Telephone</span>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="text-white hover:underline font-medium tabular-nums"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </li>
                <li>
                  <span className="block text-xs text-[#858B91] mb-0.5">Email</span>
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="text-white hover:underline break-all"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </li>
                <li>
                  <span className="block text-xs text-[#858B91] mb-0.5">
                    Business Address
                  </span>
                  <a
                    href={BUSINESS_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D9DDE1] hover:text-white transition-colors leading-relaxed block"
                  >
                    {BUSINESS_INFO.addressLine}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Useful Links */}
            <div className="lg:col-span-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white mb-5">
                Useful Information
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('booking-info')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Booking Information
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('accessibility')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Accessibility Information
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('cookies')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Cookie Preferences
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#858B91]">
            <p>
              &copy; {currentYear} {BUSINESS_INFO.brandName}. Based in Ipswich,
              Suffolk, United Kingdom.
            </p>
            <p>
              Submitting an online enquiry requests a review and does not
              automatically confirm a booking.
            </p>
          </div>
        </div>
      </footer>

      {/* Accessible Information Dialog */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div className="bg-white text-[#34383D] max-w-lg w-full p-8 border border-[#D9DDE1] shadow-lg">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D9DDE1]">
              <h3
                id="legal-modal-title"
                className="font-seasons text-2xl font-semibold text-[#34383D]"
              >
                {LEGAL_CONTENT[activeModal].title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close information dialog"
                className="p-2 text-[#555B61] hover:text-[#202327] border border-transparent hover:border-[#D9DDE1]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="py-6 space-y-4 text-sm text-[#555B61] leading-relaxed">
              {LEGAL_CONTENT[activeModal].paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="pt-4 border-t border-[#D9DDE1] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
