import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  Phone,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PageSeo } from '../components/PageSeo';
import { SafeImage } from '../components/SafeImage';
import { useSiteConfig } from '../context/SiteConfigContext';
import { BUSINESS_INFO } from '../data/siteContent';
import {
  createInitialBookingFormData,
  validateBookingStep,
  type BookingFormData,
  type ValidationErrors,
} from '../utils/validation';

const STEPS = [
  { id: 1, label: 'Collection' },
  { id: 2, label: 'Delivery' },
  { id: 3, label: 'Moving Details' },
  { id: 4, label: 'Date & Time' },
  { id: 5, label: 'Contact' },
  { id: 6, label: 'Review & Submit' },
];

const PROPERTY_TYPES = [
  'House',
  'Flat or Apartment',
  'Bungalow',
  'Storage Unit',
  'Business Premises / Office',
  'Retail Collection Point',
  'Other Location',
];

const TIME_RANGES = [
  'Flexible / To be discussed',
  'Morning (08:00 – 12:00)',
  'Afternoon (12:00 – 17:00)',
  'Evening (After 17:00)',
];

const STORAGE_KEY = 'mk_vane_booking_draft_v1';

export function BookMovePage() {
  const [searchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const { services } = useSiteConfig();
  const activeServices = services.filter((s) => s.active);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(() => {
    let savedDraft: Partial<BookingFormData> = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        savedDraft = JSON.parse(raw);
      }
    } catch {
      savedDraft = {};
    }

    const pickupParam = searchParams.get('pickup') || '';
    const dropoffParam = searchParams.get('dropoff') || '';
    const dateParam = searchParams.get('date') || '';
    const serviceParam = searchParams.get('service') || '';

    const prefill: Partial<BookingFormData> = { ...savedDraft };
    if (pickupParam) {
      if (pickupParam.length <= 9 && /\d/.test(pickupParam)) {
        prefill.collectionPostcode = pickupParam.toUpperCase();
      } else {
        prefill.collectionAddress = pickupParam;
      }
    }
    if (dropoffParam) {
      if (dropoffParam.length <= 9 && /\d/.test(dropoffParam)) {
        prefill.destinationPostcode = dropoffParam.toUpperCase();
      } else {
        prefill.destinationAddress = dropoffParam;
      }
    }
    if (dateParam) {
      prefill.preferredDate = dateParam;
    }
    if (serviceParam) {
      prefill.serviceType = serviceParam;
    }

    return createInitialBookingFormData(prefill);
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedReceipt, setConfirmedReceipt] = useState<{
    reference: string;
    message: string;
    receivedAt: string;
  } | null>(null);

  useEffect(() => {
    try {
      // Save text fields in sessionStorage so stepping back/forward or refreshing preserves progress
      const { photoAttachments: _omitPhotos, ...rest } = formData;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // Ignore storage quota issues
    }
  }, [formData]);

  const updateField = <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleNext = () => {
    const stepErrors = validateBookingStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const jumpToStep = (targetStep: number) => {
    setErrors({});
    setCurrentStep(targetStep);
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - formData.photoAttachments.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photoAttachments: 'Only JPEG, PNG, or WebP images can be attached.',
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photoAttachments: 'Each photograph must be under 2 MB.',
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            photoAttachments: [
              ...prev.photoAttachments,
              {
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result as string,
              },
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photoAttachments: prev.photoAttachments.filter((_, idx) => idx !== index),
    }));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const allErrors = validateBookingStep(6, formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/book-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
        }
        setSubmitError(
          payload.message ||
            'Unable to submit your move enquiry right now. Your details have been kept on screen—please retry or call MK Vane on +44 7708 632170.'
        );
        setIsSubmitting(false);
        return;
      }

      // Clear session draft only after backend confirms receipt
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      setConfirmedReceipt({
        reference: payload.reference,
        message: payload.message,
        receivedAt: payload.receivedAt,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError(
        'Network error while sending your enquiry. Your entered information is safe on this page—please try again or telephone +44 7708 632170.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAnotherEnquiry = () => {
    setConfirmedReceipt(null);
    setFormData(createInitialBookingFormData());
    setCurrentStep(1);
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="Book a Move — Plan Your Pickup & Delivery | MK Vane Ipswich"
        description="Enter your collection and destination details, describe what needs to move, and submit your moving or man-and-van enquiry to MK Vane in Ipswich."
      />

      {/* Full-Colour Photographic Hero Header with Readability Scrim */}
      <section className="relative py-20 lg:py-24 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/stacked_boxes_bright_room.jpg"
          alt="Stacked cardboard moving boxes in a sunlit room ready for packing and transport planning"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/72 to-[#202327]/38"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1] mb-3">
            Move &amp; Transport Enquiry
          </p>
          <h1 className="font-seasons text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.1] text-balance">
            Plan Your Pickup and Delivery
          </h1>
          <p className="text-base sm:text-lg text-[#F5F6F7]/90 mt-4 max-w-2xl leading-relaxed">
            Enter your collection and destination details, describe what needs
            moving, and send your enquiry directly to MK Vane.
          </p>
        </div>
      </section>

      {/* Main Booking Workspace */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {confirmedReceipt ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="border border-[#34383D] bg-[#F5F6F7] p-8 sm:p-12 space-y-6"
              role="status"
              aria-live="polite"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#34383D] text-white">
                <Check className="w-6 h-6" aria-hidden="true" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#555B61]">
                  Enquiry Reference: <span className="text-[#34383D] tabular-nums">{confirmedReceipt.reference}</span>
                </p>
                <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                  Move Enquiry Submitted for Review
                </h2>
                <p className="text-base text-[#34383D] leading-relaxed max-w-2xl">
                  {confirmedReceipt.message}
                </p>
              </div>

              <div className="p-5 bg-white border border-[#D9DDE1] text-sm text-[#555B61] space-y-2">
                <p className="font-semibold text-[#34383D]">What happens next?</p>
                <p>
                  Submitting an online enquiry does not automatically confirm a
                  booking or reserve a vehicle. MK Vane will review your
                  collection postcode ({formData.collectionPostcode.toUpperCase()}),
                  destination postcode ({formData.destinationPostcode.toUpperCase()}),
                  and item details before contacting you to discuss availability
                  and quote arrangements.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={startAnotherEnquiry}
                  className="px-7 py-3.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
                <Link
                  to="/"
                  className="px-7 py-3.5 bg-white text-[#34383D] border border-[#34383D] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5F6F7] transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {/* Progress Indicator */}
              <nav aria-label="Booking enquiry steps" className="border-b border-[#D9DDE1] pb-6">
                <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {STEPS.map((s) => {
                    const isCurrent = s.id === currentStep;
                    const isCompleted = s.id < currentStep;
                    const isUpcoming = s.id > currentStep;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (isCompleted) jumpToStep(s.id);
                          }}
                          disabled={isUpcoming}
                          aria-current={isCurrent ? 'step' : undefined}
                          className={`w-full text-left p-3 border transition-colors ${
                            isCurrent
                              ? 'border-[#34383D] bg-[#34383D] text-white'
                              : isCompleted
                                ? 'border-[#858B91] bg-[#F5F6F7] text-[#34383D] hover:border-[#34383D] cursor-pointer'
                                : 'border-[#D9DDE1] bg-white text-[#858B91] cursor-default'
                          }`}
                        >
                          <span
                            className={`block text-[10px] font-semibold uppercase tracking-widest tabular-nums ${
                              isCurrent ? 'text-[#D9DDE1]' : 'text-[#858B91]'
                            }`}
                          >
                            Step 0{s.id}
                          </span>
                          <span className="block text-xs font-semibold mt-0.5 truncate">
                            {s.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Form Card */}
              <form
                onSubmit={handleFinalSubmit}
                noValidate
                className="border border-[#D9DDE1] bg-white p-6 sm:p-10 lg:p-12 space-y-8"
              >
                {submitError && (
                  <div
                    role="alert"
                    className="p-4 bg-[#F5F6F7] border border-[#34383D] flex items-start gap-3 text-sm text-[#202327]"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="font-semibold">Submission could not be completed</p>
                      <p className="text-[#555B61]">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* STEP 1 — COLLECTION LOCATION */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 1 of 6 &middot; Collection Location
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        Where Should We Collect From?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="collectionAddress"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Collection Address <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="collectionAddress"
                          type="text"
                          required
                          value={formData.collectionAddress}
                          onChange={(e) =>
                            updateField('collectionAddress', e.target.value)
                          }
                          placeholder="Street name, house/flat number, and town"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.collectionAddress && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.collectionAddress}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="collectionPostcode"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Collection Postcode <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="collectionPostcode"
                          type="text"
                          required
                          value={formData.collectionPostcode}
                          onChange={(e) =>
                            updateField('collectionPostcode', e.target.value)
                          }
                          placeholder="e.g. IP3 0QP"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm uppercase text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.collectionPostcode && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.collectionPostcode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="collectionPropertyType"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Property or Location Type <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="collectionPropertyType"
                        value={formData.collectionPropertyType}
                        onChange={(e) =>
                          updateField('collectionPropertyType', e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      >
                        {PROPERTY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="collectionAccessInstructions"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Access &amp; Parking Instructions (Optional)
                      </label>
                      <textarea
                        id="collectionAccessInstructions"
                        rows={3}
                        value={formData.collectionAccessInstructions}
                        onChange={(e) =>
                          updateField(
                            'collectionAccessInstructions',
                            e.target.value
                          )
                        }
                        placeholder="Share helpful details about stairs, lifts, driveway access, loading bays, or street parking restrictions."
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2 — DELIVERY LOCATION */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 2 of 6 &middot; Delivery Location
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        Where Should We Deliver To?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="destinationAddress"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Destination Address <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="destinationAddress"
                          type="text"
                          required
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            updateField('destinationAddress', e.target.value)
                          }
                          placeholder="Destination street name, number, and town"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.destinationAddress && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.destinationAddress}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="destinationPostcode"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Destination Postcode <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="destinationPostcode"
                          type="text"
                          required
                          value={formData.destinationPostcode}
                          onChange={(e) =>
                            updateField('destinationPostcode', e.target.value)
                          }
                          placeholder="e.g. IP1 3QH"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm uppercase text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.destinationPostcode && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.destinationPostcode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="destinationPropertyType"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Destination Property or Location Type{' '}
                        <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="destinationPropertyType"
                        value={formData.destinationPropertyType}
                        onChange={(e) =>
                          updateField('destinationPropertyType', e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      >
                        {PROPERTY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="destinationAccessInstructions"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Delivery Access Instructions (Optional)
                      </label>
                      <textarea
                        id="destinationAccessInstructions"
                        rows={3}
                        value={formData.destinationAccessInstructions}
                        onChange={(e) =>
                          updateField(
                            'destinationAccessInstructions',
                            e.target.value
                          )
                        }
                        placeholder="Note any floor levels, lift access, entry intercoms, or parking rules at the delivery address."
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>

                    {/* Multi-Stop Option (Backed by Server Schema) */}
                    <div className="p-5 bg-[#F5F6F7] border border-[#D9DDE1] space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasAdditionalStops}
                          onChange={(e) =>
                            updateField('hasAdditionalStops', e.target.checked)
                          }
                          className="mt-1 w-4 h-4 accent-[#34383D]"
                        />
                        <span className="text-sm font-medium text-[#34383D]">
                          Does this journey involve more than two stops (an
                          additional pickup or drop-off point)?
                        </span>
                      </label>

                      {formData.hasAdditionalStops && (
                        <div>
                          <label
                            htmlFor="additionalStopsDetails"
                            className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                          >
                            Additional Stop Address(es) &amp; Notes{' '}
                            <span aria-hidden="true">*</span>
                          </label>
                          <textarea
                            id="additionalStopsDetails"
                            rows={2}
                            value={formData.additionalStopsDetails}
                            onChange={(e) =>
                              updateField(
                                'additionalStopsDetails',
                                e.target.value
                              )
                            }
                            placeholder="List the extra postcode(s) and specify what is being collected or delivered there."
                            className="w-full px-4 py-3 bg-white border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D]"
                          />
                          {errors.additionalStopsDetails && (
                            <p className="text-xs text-[#202327] font-medium mt-1.5">
                              {errors.additionalStopsDetails}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3 — WHAT NEEDS MOVING? */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 3 of 6 &middot; Moving Details
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        Tell Us About Your Move
                      </h2>
                      <p className="text-sm text-[#555B61] mt-2">
                        Provide enough detail for MK Vane to understand the
                        scope of the job before discussing a quote.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="serviceType"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Type of Service <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="serviceType"
                          value={formData.serviceType}
                          onChange={(e) =>
                            updateField('serviceType', e.target.value)
                          }
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        >
                          {activeServices.map((s) => (
                            <option key={s.id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="numberOfItems"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Approximate Number of Items / Boxes (Optional)
                        </label>
                        <input
                          id="numberOfItems"
                          type="text"
                          value={formData.numberOfItems}
                          onChange={(e) =>
                            updateField('numberOfItems', e.target.value)
                          }
                          placeholder="e.g. 3 furniture items + ~15 boxes"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="itemDescription"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Item Description <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="itemDescription"
                        rows={4}
                        required
                        value={formData.itemDescription}
                        onChange={(e) =>
                          updateField('itemDescription', e.target.value)
                        }
                        placeholder="List the main furniture pieces, appliances, boxes, or single item you need transported."
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                      {errors.itemDescription && (
                        <p className="text-xs text-[#202327] font-medium mt-1.5">
                          {errors.itemDescription}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="approximateDimensions"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Approximate Item Dimensions (Optional)
                        </label>
                        <input
                          id="approximateDimensions"
                          type="text"
                          value={formData.approximateDimensions}
                          onChange={(e) =>
                            updateField('approximateDimensions', e.target.value)
                          }
                          placeholder="e.g. Sofa 210cm x 95cm x 85cm"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="propertySize"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Property Size (Optional)
                        </label>
                        <input
                          id="propertySize"
                          type="text"
                          value={formData.propertySize}
                          onChange={(e) =>
                            updateField('propertySize', e.target.value)
                          }
                          placeholder="e.g. 1-bedroom flat, 3-bedroom house"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="floorsOrStairs"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Floors or Stairs (Optional)
                        </label>
                        <select
                          id="floorsOrStairs"
                          value={formData.floorsOrStairs}
                          onChange={(e) =>
                            updateField('floorsOrStairs', e.target.value)
                          }
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        >
                          <option value="Ground floor only">Ground floor only</option>
                          <option value="First floor (stairs)">First floor (stairs)</option>
                          <option value="Second floor (stairs)">Second floor (stairs)</option>
                          <option value="Third floor or above">Third floor or above</option>
                          <option value="Internal house stairs only">Internal house stairs only</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="liftAvailability"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Lift Availability (Optional)
                        </label>
                        <select
                          id="liftAvailability"
                          value={formData.liftAvailability}
                          onChange={(e) =>
                            updateField('liftAvailability', e.target.value)
                          }
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        >
                          <option value="Not applicable">Not applicable</option>
                          <option value="Standard passenger lift">Standard passenger lift</option>
                          <option value="Large / service lift">Large / service lift</option>
                          <option value="No lift available">No lift available</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="largeOrHeavyItems"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Large or Heavy Items (Optional)
                        </label>
                        <input
                          id="largeOrHeavyItems"
                          type="text"
                          value={formData.largeOrHeavyItems}
                          onChange={(e) =>
                            updateField('largeOrHeavyItems', e.target.value)
                          }
                          placeholder="e.g. Solid oak wardrobe, washing machine"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="fragileItems"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Fragile Items (Optional)
                        </label>
                        <input
                          id="fragileItems"
                          type="text"
                          value={formData.fragileItems}
                          onChange={(e) =>
                            updateField('fragileItems', e.target.value)
                          }
                          placeholder="e.g. Wall mirror, glass dining top, television"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="additionalRequirements"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Additional Requirements (Optional)
                      </label>
                      <textarea
                        id="additionalRequirements"
                        rows={2}
                        value={formData.additionalRequirements}
                        onChange={(e) =>
                          updateField('additionalRequirements', e.target.value)
                        }
                        placeholder="Any other practical notes useful for reviewing the move."
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>

                    {/* Secure Private Photograph Attachment */}
                    <div className="p-5 bg-[#F5F6F7] border border-[#D9DDE1] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#34383D]">
                            Optional Photograph Upload (Up to 4 images)
                          </p>
                          <p className="text-xs text-[#555B61] mt-0.5">
                            Attach photos of bulky items or access points if
                            helpful. Images remain private to your enquiry.
                          </p>
                        </div>

                        {formData.photoAttachments.length < 4 && (
                          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#34383D] text-xs font-semibold uppercase tracking-wider text-[#34383D] hover:bg-[#F5F6F7] cursor-pointer whitespace-nowrap shrink-0">
                            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Select Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              multiple
                              onChange={handlePhotoUpload}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>

                      {errors.photoAttachments && (
                        <p className="text-xs text-[#202327] font-medium">
                          {errors.photoAttachments}
                        </p>
                      )}

                      {formData.photoAttachments.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {formData.photoAttachments.map((photo, index) => (
                            <li
                              key={`${photo.name}-${index}`}
                              className="p-2.5 bg-white border border-[#D9DDE1] flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={photo.dataUrl}
                                  alt={`Uploaded item preview ${index + 1}`}
                                  className="w-11 h-11 object-cover border border-[#D9DDE1] shrink-0"
                                />
                                <span className="text-xs text-[#34383D] truncate">
                                  {photo.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                aria-label={`Remove photograph ${photo.name}`}
                                className="p-1.5 text-[#555B61] hover:text-[#202327]"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4 — DATE AND TIME */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 4 of 6 &middot; Date &amp; Time Preferences
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        When Would You Like to Move?
                      </h2>
                      <p className="text-sm text-[#555B61] mt-2">
                        You are sharing a preferred moving date and time window,
                        not reserving a confirmed timeslot. MK Vane will confirm
                        availability after reviewing your enquiry.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="preferredDate"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Preferred Moving Date <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="preferredDate"
                          type="date"
                          required
                          value={formData.preferredDate}
                          onChange={(e) =>
                            updateField('preferredDate', e.target.value)
                          }
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.preferredDate && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.preferredDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="alternativeDate"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Alternative Date (Optional)
                        </label>
                        <input
                          id="alternativeDate"
                          type="date"
                          value={formData.alternativeDate}
                          onChange={(e) =>
                            updateField('alternativeDate', e.target.value)
                          }
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="preferredTimeRange"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Preferred Time Range <span aria-hidden="true">*</span>
                      </label>
                      <select
                        id="preferredTimeRange"
                        value={formData.preferredTimeRange}
                        onChange={(e) =>
                          updateField('preferredTimeRange', e.target.value)
                        }
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      >
                        {TIME_RANGES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="flexibilityNotes"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Date or Time Flexibility Notes (Optional)
                      </label>
                      <textarea
                        id="flexibilityNotes"
                        rows={3}
                        value={formData.flexibilityNotes}
                        onChange={(e) =>
                          updateField('flexibilityNotes', e.target.value)
                        }
                        placeholder="e.g. Key collection expected around 13:00, or flexible across that weekend."
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5 — CONTACT INFORMATION */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 5 of 6 &middot; Contact Information
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        How Can We Contact You?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Full Name <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            updateField('fullName', e.target.value)
                          }
                          placeholder="Your full name"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.fullName && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                        >
                          Telephone Number <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            updateField('phoneNumber', e.target.value)
                          }
                          placeholder="e.g. 07708 632170 or +44 7708 632170"
                          className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-[#202327] font-medium mt-1.5">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="emailAddress"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Email Address (Optional)
                      </label>
                      <input
                        id="emailAddress"
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) =>
                          updateField('emailAddress', e.target.value)
                        }
                        placeholder="you@example.co.uk"
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                      {errors.emailAddress && (
                        <p className="text-xs text-[#202327] font-medium mt-1.5">
                          {errors.emailAddress}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="additionalContactInstructions"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                      >
                        Additional Contact Instructions (Optional)
                      </label>
                      <input
                        id="additionalContactInstructions"
                        type="text"
                        value={formData.additionalContactInstructions}
                        onChange={(e) =>
                          updateField(
                            'additionalContactInstructions',
                            e.target.value
                          )
                        }
                        placeholder="e.g. Best reached by telephone after 17:30 or via WhatsApp"
                        className="w-full px-4 py-3.5 bg-[#F5F6F7] border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D] focus:bg-white"
                      />
                    </div>

                    <div className="p-4 bg-[#F5F6F7] border border-[#D9DDE1] text-xs text-[#555B61] leading-relaxed">
                      <strong className="text-[#34383D]">Privacy Notice:</strong>{' '}
                      Your submitted contact details, addresses, and any
                      attached photographs are used exclusively by MK Vane to
                      review your transport enquiry and communicate with you
                      about potential moving arrangements. They are never
                      published publicly.
                    </div>
                  </div>
                )}

                {/* STEP 6 — REVIEW YOUR REQUEST */}
                {currentStep === 6 && (
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                        Step 6 of 6 &middot; Review &amp; Submit
                      </p>
                      <h2 className="font-seasons text-3xl sm:text-4xl font-semibold text-[#34383D]">
                        Review Your Move Enquiry
                      </h2>
                      <p className="text-sm text-[#555B61] mt-2">
                        Check your pickup, delivery, item, and contact details
                        below before sending your enquiry to MK Vane.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Summary 1: Pickup */}
                      <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                            Collection Location
                          </h3>
                          <button
                            type="button"
                            onClick={() => jumpToStep(1)}
                            className="text-xs font-semibold text-[#34383D] underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#34383D]">
                          {formData.collectionAddress},{' '}
                          {formData.collectionPostcode.toUpperCase()}
                        </p>
                        <p className="text-xs text-[#555B61]">
                          Property: {formData.collectionPropertyType}
                        </p>
                        {formData.collectionAccessInstructions && (
                          <p className="text-xs text-[#555B61]">
                            Access: {formData.collectionAccessInstructions}
                          </p>
                        )}
                      </div>

                      {/* Summary 2: Destination */}
                      <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                            Delivery Location
                          </h3>
                          <button
                            type="button"
                            onClick={() => jumpToStep(2)}
                            className="text-xs font-semibold text-[#34383D] underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#34383D]">
                          {formData.destinationAddress},{' '}
                          {formData.destinationPostcode.toUpperCase()}
                        </p>
                        <p className="text-xs text-[#555B61]">
                          Property: {formData.destinationPropertyType}
                        </p>
                        {formData.destinationAccessInstructions && (
                          <p className="text-xs text-[#555B61]">
                            Access: {formData.destinationAccessInstructions}
                          </p>
                        )}
                        {formData.hasAdditionalStops && (
                          <p className="text-xs text-[#34383D] font-medium pt-1">
                            Additional Stops: {formData.additionalStopsDetails}
                          </p>
                        )}
                      </div>

                      {/* Summary 3: Moving Details */}
                      <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                            Moving Details
                          </h3>
                          <button
                            type="button"
                            onClick={() => jumpToStep(3)}
                            className="text-xs font-semibold text-[#34383D] underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#34383D]">
                          {formData.serviceType}
                          {formData.numberOfItems
                            ? ` · ${formData.numberOfItems}`
                            : ''}
                        </p>
                        <p className="text-sm text-[#555B61] leading-relaxed">
                          {formData.itemDescription}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#555B61]">
                          <span>Stairs/Floors: {formData.floorsOrStairs}</span>
                          <span>&middot;</span>
                          <span>Lift: {formData.liftAvailability}</span>
                          {formData.photoAttachments.length > 0 && (
                            <>
                              <span>&middot;</span>
                              <span>
                                {formData.photoAttachments.length} photo(s)
                                attached
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Summary 4: Date & Time */}
                      <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                            Requested Date &amp; Time
                          </h3>
                          <button
                            type="button"
                            onClick={() => jumpToStep(4)}
                            className="text-xs font-semibold text-[#34383D] underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#34383D] tabular-nums">
                          Preferred Date: {formData.preferredDate}
                        </p>
                        {formData.alternativeDate && (
                          <p className="text-xs text-[#555B61] tabular-nums">
                            Alternative Date: {formData.alternativeDate}
                          </p>
                        )}
                        <p className="text-xs text-[#555B61]">
                          Time Window: {formData.preferredTimeRange}
                        </p>
                      </div>

                      {/* Summary 5: Contact */}
                      <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                            Customer Contact Details
                          </h3>
                          <button
                            type="button"
                            onClick={() => jumpToStep(5)}
                            className="text-xs font-semibold text-[#34383D] underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#34383D]">
                          {formData.fullName}
                        </p>
                        <p className="text-xs text-[#555B61] tabular-nums">
                          Tel: {formData.phoneNumber}
                        </p>
                        {formData.emailAddress && (
                          <p className="text-xs text-[#555B61]">
                            Email: {formData.emailAddress}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Accuracy & Booking Rules Confirmation */}
                    <div className="p-6 border border-[#34383D] bg-[#F5F6F7] space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.accuracyConfirmed}
                          onChange={(e) =>
                            updateField('accuracyConfirmed', e.target.checked)
                          }
                          className="mt-1 w-4 h-4 accent-[#34383D]"
                        />
                        <span className="text-sm text-[#34383D] leading-relaxed">
                          I confirm that the collection, delivery, item, and
                          contact details above are accurate, and I understand
                          that submitting this form sends an enquiry for review
                          and does not automatically confirm a booking or take
                          any payment.
                        </span>
                      </label>
                      {errors.accuracyConfirmed && (
                        <p className="text-xs text-[#202327] font-semibold">
                          {errors.accuracyConfirmed}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="pt-6 border-t border-[#D9DDE1] flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#34383D] border border-[#34383D] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5F6F7] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      <span>Previous Step</span>
                    </button>
                  ) : (
                    <div className="text-xs text-[#858B91]">
                      Prefer to speak directly? Call{' '}
                      <a
                        href={BUSINESS_INFO.phoneHref}
                        className="text-[#34383D] font-semibold underline tabular-nums"
                      >
                        {BUSINESS_INFO.phoneDisplay}
                      </a>
                    </div>
                  )}

                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#202327] disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      <span>
                        {isSubmitting
                          ? 'Submitting Enquiry...'
                          : 'SUBMIT MOVE ENQUIRY'}
                      </span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </form>

              {/* Important Booking Rules Transparency Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1]">
                  <h3 className="font-seasons text-xl font-semibold text-[#34383D] mb-2">
                    Enquiry Review First
                  </h3>
                  <p className="text-xs text-[#555B61] leading-relaxed">
                    Submitting your journey does not guarantee vehicle
                    availability. MK Vane reviews every enquiry before
                    confirming dates and quotes.
                  </p>
                </div>
                <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1]">
                  <h3 className="font-seasons text-xl font-semibold text-[#34383D] mb-2">
                    No Instant Charges
                  </h3>
                  <p className="text-xs text-[#555B61] leading-relaxed">
                    No payment is taken on this website and no automated
                    estimate is generated without first reviewing your items
                    and property access notes.
                  </p>
                </div>
                <div className="p-6 bg-[#F5F6F7] border border-[#D9DDE1] flex flex-col justify-between">
                  <div>
                    <h3 className="font-seasons text-xl font-semibold text-[#34383D] mb-2">
                      Direct Assistance
                    </h3>
                    <p className="text-xs text-[#555B61] leading-relaxed">
                      Need help describing a complex move? Speak directly with
                      MK Vane.
                    </p>
                  </div>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34383D] hover:underline mt-3 tabular-nums"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{BUSINESS_INFO.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
