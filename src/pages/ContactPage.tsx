import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  Check,
  AlertCircle,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { BUSINESS_INFO } from '../data/siteContent';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  validateContactForm,
  type ContactFormPayload,
  type ValidationErrors,
} from '../utils/validation';

const ENQUIRY_TYPES = [
  'Quote / Move Enquiry',
  'House or Flat Removals Question',
  'Man and Van Availability',
  'Single-Item or Furniture Transport',
  'Updating an Existing Enquiry',
  'General Question',
];

export function ContactPage() {
  const { contactFaqs, updateContactFaq } = useSiteConfig();

  const [formState, setFormState] = useState<ContactFormPayload>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    enquiryType: ENQUIRY_TYPES[0],
    collectionPostcode: '',
    destinationPostcode: '',
    message: '',
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    reference: string;
    message: string;
  } | null>(null);

  const [openFaqId, setOpenFaqId] = useState<string | null>(
    contactFaqs[0]?.id || null
  );
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [draftQ, setDraftQ] = useState('');
  const [draftA, setDraftA] = useState('');

  const updateField = <K extends keyof ContactFormPayload>(
    key: K,
    val: ContactFormPayload[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateContactForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
        }
        setSubmitError(
          payload.message ||
            'Unable to send your enquiry right now. Please try again or call MK Vane directly.'
        );
        setSubmitting(false);
        return;
      }

      setReceipt({
        reference: payload.reference,
        message: payload.message,
      });
    } catch {
      setSubmitError(
        'Network error while sending your message. Please try again or call +44 7708 632170.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetContactForm = () => {
    setReceipt(null);
    setFormState({
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      enquiryType: ENQUIRY_TYPES[0],
      collectionPostcode: '',
      destinationPostcode: '',
      message: '',
      privacyAccepted: false,
    });
    setErrors({});
  };

  const startFaqEdit = (id: string, q: string, a: string) => {
    setEditingFaqId(id);
    setDraftQ(q);
    setDraftA(a);
  };

  const saveFaqEdit = (id: string) => {
    updateContactFaq(id, draftQ, draftA);
    setEditingFaqId(null);
  };

  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="Contact & Help — Speak to MK Vane About Your Move | Ipswich"
        description="Have a question about a collection, delivery, or moving requirement in Ipswich? Call +44 7708 632170, WhatsApp, email, or send an online enquiry to MK Vane."
      />

      {/* Full-Colour Photographic Hero Banner with Dark Contrast Overlay */}
      <section className="relative py-24 lg:py-32 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/driver_checking_manifest.jpg"
          alt="Transport coordinator reviewing move enquiry notes on a tablet beside stacked cardboard boxes inside a white van"
          className="absolute inset-0 w-full h-full object-cover object-[center_28%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/70 to-[#202327]/35"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1]">
              Contact &amp; Customer Support
            </p>
            <h1 className="font-seasons text-4xl sm:text-6xl font-medium text-white leading-[1.1] text-balance">
              Talk to MK Vane About Your Move
            </h1>
            <p className="text-base sm:text-lg text-[#F5F6F7]/90 leading-relaxed max-w-2xl">
              Have a question about a collection, delivery, or household move
              in Ipswich? Get in touch directly by phone, WhatsApp, email, or
              our online enquiry form.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Channels + Functional Contact Form */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Contact Cards */}
            <Reveal className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-signature text-3xl text-[#555B61] block mb-1">
                  Direct ways to reach us
                </span>
                <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="block p-6 bg-[#F5F6F7] border border-[#D9DDE1] hover:border-[#34383D] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Phone
                      className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                        Telephone
                      </span>
                      <span className="block text-lg font-semibold text-[#34383D] mt-1 tabular-nums">
                        {BUSINESS_INFO.phoneDisplay}
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-[#F5F6F7] border border-[#D9DDE1] hover:border-[#34383D] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <MessageSquare
                        className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                          WhatsApp Conversation
                        </span>
                        <span className="block text-base font-semibold text-[#34383D] mt-1">
                          Message MK Vane on WhatsApp
                        </span>
                        <span className="block text-xs text-[#555B61] mt-1">
                          Opens with a pre-filled moving enquiry greeting
                        </span>
                      </div>
                    </div>
                    <ExternalLink
                      className="w-4 h-4 text-[#555B61] shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </a>

                <a
                  href={BUSINESS_INFO.emailHref}
                  className="block p-6 bg-[#F5F6F7] border border-[#D9DDE1] hover:border-[#34383D] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Mail
                      className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                        Email Address
                      </span>
                      <span className="block text-base font-semibold text-[#34383D] mt-1 break-all">
                        {BUSINESS_INFO.email}
                      </span>
                    </div>
                  </div>
                </a>

                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-[#F5F6F7] border border-[#D9DDE1] hover:border-[#34383D] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <MapPin
                        className="w-5 h-5 text-[#34383D] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                          Business Address
                        </span>
                        <span className="block text-sm font-semibold text-[#34383D] mt-1 leading-relaxed">
                          {BUSINESS_INFO.addressLine}
                        </span>
                        <span className="block text-xs text-[#555B61] mt-1">
                          View location on Google Maps
                        </span>
                      </div>
                    </div>
                    <ExternalLink
                      className="w-4 h-4 text-[#555B61] shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </div>
            </Reveal>

            {/* Right Column: Contact Form */}
            <Reveal delay={0.08} className="lg:col-span-7">
              {receipt ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-8 sm:p-12 bg-[#F5F6F7] border border-[#34383D] space-y-6"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 bg-[#34383D] text-white">
                    <Check className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#555B61]">
                      Reference:{' '}
                      <span className="text-[#34383D] tabular-nums">
                        {receipt.reference}
                      </span>
                    </p>
                    <h3 className="font-seasons text-3xl font-semibold text-[#34383D]">
                      Enquiry Received
                    </h3>
                    <p className="text-sm text-[#555B61] leading-relaxed">
                      {receipt.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetContactForm}
                    className="px-6 py-3 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  noValidate
                  className="p-8 sm:p-10 border border-[#D9DDE1] bg-white space-y-6"
                >
                  <div>
                    <h2 className="font-seasons text-3xl font-semibold text-[#34383D]">
                      Send an Online Enquiry
                    </h2>
                    <p className="text-sm text-[#555B61] mt-1">
                      Have a specific question before planning your move? Fill
                      in the form below.
                    </p>
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="p-4 bg-[#F5F6F7] border border-[#34383D] flex items-start gap-3 text-sm text-[#202327]"
                    >
                      <AlertCircle
                        className="w-5 h-5 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-fullName"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Full Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-fullName"
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-[#202327] font-medium mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Phone Number <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formState.phoneNumber}
                        onChange={(e) =>
                          updateField('phoneNumber', e.target.value)
                        }
                        placeholder="e.g. 07708 632170"
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                      {errors.phoneNumber && (
                        <p className="text-xs text-[#202327] font-medium mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Email Address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formState.emailAddress}
                        onChange={(e) =>
                          updateField('emailAddress', e.target.value)
                        }
                        placeholder="you@example.co.uk"
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                      {errors.emailAddress && (
                        <p className="text-xs text-[#202327] font-medium mt-1">
                          {errors.emailAddress}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-type"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Enquiry Type <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="contact-type"
                        value={formState.enquiryType}
                        onChange={(e) =>
                          updateField('enquiryType', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      >
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-pickup"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Collection Postcode (Optional)
                      </label>
                      <input
                        id="contact-pickup"
                        type="text"
                        value={formState.collectionPostcode || ''}
                        onChange={(e) =>
                          updateField('collectionPostcode', e.target.value)
                        }
                        placeholder="e.g. IP3 0QP"
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm uppercase text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-dropoff"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Destination Postcode (Optional)
                      </label>
                      <input
                        id="contact-dropoff"
                        type="text"
                        value={formState.destinationPostcode || ''}
                        onChange={(e) =>
                          updateField('destinationPostcode', e.target.value)
                        }
                        placeholder="e.g. IP1 3QH"
                        className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm uppercase text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                    >
                      Message or Question <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Tell us about your moving question, item details, or preferred dates..."
                      className="w-full px-4 py-3 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                    />
                    {errors.message && (
                      <p className="text-xs text-[#202327] font-medium mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Privacy Notice Checkbox */}
                  <div className="p-4 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.privacyAccepted}
                        onChange={(e) =>
                          updateField('privacyAccepted', e.target.checked)
                        }
                        className="mt-1 w-4 h-4 accent-[#34383D]"
                      />
                      <span className="text-xs text-[#555B61] leading-relaxed">
                        <strong className="text-[#34383D]">Privacy Notice:</strong>{' '}
                        I understand that MK Vane will review and store the
                        contact and postcode details provided above solely to
                        respond to my enquiry and discuss potential moving
                        arrangements.
                      </span>
                    </label>
                    {errors.privacyAccepted && (
                      <p className="text-xs text-[#202327] font-semibold">
                        {errors.privacyAccepted}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#34383D] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#202327] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <span>
                      {submitting ? 'Sending Enquiry...' : 'SEND ENQUIRY'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Help & Frequently Asked Questions */}
      <section className="py-24 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-2">
              Help &amp; Guidance
            </p>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D]">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="space-y-4">
            {contactFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const isEditing = editingFaqId === faq.id;

              return (
                <div key={faq.id} className="bg-white border border-[#D9DDE1]">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#F5F6F7]/50 transition-colors cursor-pointer"
                  >
                    <span className="font-seasons text-xl sm:text-2xl font-semibold text-[#34383D]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#555B61] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#F5F6F7] space-y-4">
                      {isEditing ? (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label
                              htmlFor={`cfaq-q-${faq.id}`}
                              className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1"
                            >
                              Question
                            </label>
                            <input
                              id={`cfaq-q-${faq.id}`}
                              type="text"
                              value={draftQ}
                              onChange={(e) => setDraftQ(e.target.value)}
                              className="w-full px-3 py-2 border border-[#D9DDE1] text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`cfaq-a-${faq.id}`}
                              className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1"
                            >
                              Answer
                            </label>
                            <textarea
                              id={`cfaq-a-${faq.id}`}
                              rows={3}
                              value={draftA}
                              onChange={(e) => setDraftA(e.target.value)}
                              className="w-full px-3 py-2 border border-[#D9DDE1] text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveFaqEdit(faq.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider"
                            >
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFaqId(null)}
                              className="px-4 py-2 border border-[#D9DDE1] text-xs font-semibold uppercase tracking-wider text-[#555B61]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[#555B61] leading-relaxed">
                            {faq.answer}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              startFaqEdit(faq.id, faq.question, faq.answer)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#858B91] hover:text-[#34383D]"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Edit answer</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl font-medium text-white leading-tight text-balance">
              Let&apos;s Talk About Your Moving Requirements.
            </h2>
            <p className="text-base text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Call directly to speak with MK Vane or plan your full collection
              and delivery online.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>CALL MK VANE</span>
              </a>
              <Link
                to="/book-a-move"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/75 text-xs font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <span>BOOK A MOVE</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
