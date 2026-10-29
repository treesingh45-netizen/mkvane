import React, { useEffect, useState } from 'react';
import { Star, Check, X } from 'lucide-react';
import { Reveal } from './Reveal';
import {
  INITIAL_REVIEWS,
  type CustomerReview,
} from '../data/siteContent';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  validateReviewSubmission,
  type ReviewSubmissionPayload,
  type ValidationErrors,
} from '../utils/validation';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Reviews' },
  { id: 'House Removals', label: 'House Removals' },
  { id: 'Flat and Apartment Moves', label: 'Flats & Apartments' },
  { id: 'Furniture & Delivery', label: 'Furniture & Delivery' },
] as const;

function MonochromeStars({
  rating,
  sizeClass = 'w-4 h-4',
}: {
  rating: number;
  sizeClass?: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const filled = starIndex <= rating;
        return (
          <Star
            key={starIndex}
            className={`${sizeClass} ${
              filled
                ? 'fill-[#34383D] text-[#34383D]'
                : 'fill-transparent text-[#D9DDE1]'
            }`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function CustomerReviewsSection() {
  const { services } = useSiteConfig();
  const activeServices = services.filter((s) => s.active);

  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState<ReviewSubmissionPayload>({
    authorName: '',
    locationOrRoute: '',
    serviceType: activeServices[0]?.title || 'House Removals',
    rating: 5,
    title: '',
    comment: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(
    null
  );
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {
        // Keep seeded INITIAL_REVIEWS on transient network failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'Furniture & Delivery') {
      return (
        review.serviceType === 'Furniture Transportation' ||
        review.serviceType === 'Collection and Delivery' ||
        review.serviceType === 'Single-Item Moves' ||
        review.serviceType === 'Man and Van'
      );
    }
    return review.serviceType === selectedFilter;
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErrorMessage(null);

    const validationErrors = validateReviewSubmission(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result?.errors) {
          setErrors(result.errors);
        }
        setSubmitErrorMessage(
          result?.message || 'Unable to submit your review right now.'
        );
        return;
      }

      const savedReview = result.review as CustomerReview;
      setReviews((prev) => [savedReview, ...prev]);
      setSelectedFilter('all');
      setSubmitSuccessMessage(
        result.message ||
          'Thank you for sharing your moving experience with MK Vane.'
      );
      setFormData({
        authorName: '',
        locationOrRoute: '',
        serviceType: activeServices[0]?.title || 'House Removals',
        rating: 5,
        title: '',
        comment: '',
      });
      setIsFormOpen(false);
    } catch {
      setSubmitErrorMessage(
        'Unable to reach the server right now. Please try submitting again shortly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="py-24 lg:py-32 bg-white border-b border-[#D9DDE1]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Editorial Header + Aggregate Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-12">
          <Reveal className="lg:col-span-7 space-y-4">
            <span className="font-signature text-3xl text-[#555B61] block">
              Customer experiences
            </span>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-tight text-balance">
              What Customers Say About Moving with MK Vane
            </h2>
            <p className="text-base text-[#555B61] leading-relaxed max-w-2xl">
              Clear communication before moving day, realistic route planning,
              and careful handling at both addresses—read recent feedback from
              customers across Ipswich and surrounding postcodes.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <div className="bg-[#F5F6F7] border border-[#D9DDE1] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-seasons text-5xl font-semibold text-[#34383D] tabular-nums leading-none">
                    {averageRating}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#858B91]">
                    out of 5.0
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <MonochromeStars rating={Math.round(Number(averageRating))} />
                  <span className="text-xs text-[#555B61] tabular-nums">
                    &middot; {reviews.length} customer{' '}
                    {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccessMessage(null);
                  setIsFormOpen((prev) => !prev);
                }}
                aria-expanded={isFormOpen}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isFormOpen ? 'Close Form' : 'Leave a Review'}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Submission Confirmation Banner */}
        {submitSuccessMessage && (
          <div
            role="status"
            className="mb-10 p-5 bg-[#F5F6F7] border border-[#34383D] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-sm text-[#34383D] font-medium">
              <Check className="w-4 h-4 text-[#34383D] shrink-0" aria-hidden="true" />
              <span>{submitSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmitSuccessMessage(null)}
              aria-label="Dismiss review confirmation"
              className="p-1.5 text-[#555B61] hover:text-[#202327] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Collapsible Write-a-Review Form */}
        {isFormOpen && (
          <div className="mb-12 bg-[#F5F6F7] border border-[#D9DDE1] p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-[#D9DDE1]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-1">
                  Share Your Feedback
                </p>
                <h3 className="font-seasons text-2xl sm:text-3xl font-medium text-[#34383D]">
                  Leave a Customer Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close review form"
                className="p-2 text-[#555B61] hover:text-[#202327] border border-transparent hover:border-[#D9DDE1] cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {submitErrorMessage && (
              <div
                role="alert"
                className="mb-6 p-4 bg-white border border-[#34383D] text-sm text-[#34383D]"
              >
                {submitErrorMessage}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="review-author"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        authorName: e.target.value,
                      }))
                    }
                    placeholder="e.g. Hannah Brooks"
                    className="w-full px-4 py-3.5 bg-white border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D]"
                  />
                  {errors.authorName && (
                    <p className="mt-1.5 text-xs text-[#34383D] font-medium">
                      {errors.authorName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="review-route"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Area or Journey Route *
                  </label>
                  <input
                    id="review-route"
                    type="text"
                    value={formData.locationOrRoute}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        locationOrRoute: e.target.value,
                      }))
                    }
                    placeholder="e.g. Ipswich IP3 to Woodbridge IP12"
                    className="w-full px-4 py-3.5 bg-white border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D]"
                  />
                  {errors.locationOrRoute && (
                    <p className="mt-1.5 text-xs text-[#34383D] font-medium">
                      {errors.locationOrRoute}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="review-service"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                  >
                    Service Used *
                  </label>
                  <select
                    id="review-service"
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        serviceType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3.5 bg-white border border-[#D9DDE1] text-sm text-[#34383D] focus:outline-none focus:border-[#34383D]"
                  >
                    {activeServices.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1.5 text-xs text-[#34383D] font-medium">
                      {errors.serviceType}
                    </p>
                  )}
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2">
                    Overall Rating *
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Overall rating out of 5 stars"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D9DDE1] min-h-[48px]"
                  >
                    {[1, 2, 3, 4, 5].map((value) => {
                      const active = value <= formData.rating;
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={formData.rating === value}
                          aria-label={`Rate ${value} out of 5 stars`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating: value }))
                          }
                          className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34383D] cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              active
                                ? 'fill-[#34383D] text-[#34383D]'
                                : 'fill-transparent text-[#D9DDE1]'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-medium text-[#555B61] tabular-nums">
                      {formData.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                >
                  Review Headline *
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Short summary of your moving experience"
                  className="w-full px-4 py-3.5 bg-white border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D]"
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-[#34383D] font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-2"
                >
                  Your Experience *
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Describe what was moved, how access or timing was handled, and how the journey went..."
                  className="w-full px-4 py-3.5 bg-white border border-[#D9DDE1] text-sm text-[#34383D] placeholder:text-[#858B91] focus:outline-none focus:border-[#34383D]"
                />
                {errors.comment && (
                  <p className="mt-1.5 text-xs text-[#34383D] font-medium">
                    {errors.comment}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-end gap-4 border-t border-[#D9DDE1]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3.5 bg-white text-[#34383D] border border-[#D9DDE1] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5F6F7] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#202327] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Interactive Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#D9DDE1]">
          <div
            role="group"
            aria-label="Filter customer reviews by service category"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F5F6F7] border border-[#D9DDE1]"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = selectedFilter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#34383D] text-white'
                      : 'text-[#555B61] hover:text-[#202327]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#858B91] tabular-nums">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>

        {/* Architectural Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((review, idx) => (
            <Reveal
              key={review.id}
              delay={idx * 0.04}
              className="border border-[#D9DDE1] bg-white p-8 flex flex-col justify-between transition-colors hover:border-[#858B91]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <MonochromeStars rating={review.rating} />
                  <div className="flex items-center gap-2 text-xs text-[#858B91]">
                    <span>{review.serviceType}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{review.dateDisplay}</span>
                  </div>
                </div>

                <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mt-5 mb-3">
                  {review.title}
                </h3>

                <blockquote className="text-sm text-[#555B61] leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-5 mt-6 border-t border-[#D9DDE1] flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#34383D]">
                  {review.authorName}
                </span>
                <span className="text-xs text-[#555B61]">
                  {review.locationOrRoute}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
