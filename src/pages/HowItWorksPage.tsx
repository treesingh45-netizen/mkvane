import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Edit3, Check } from 'lucide-react';
import { PageSeo } from '../components/PageSeo';
import { Reveal } from '../components/Reveal';
import { SafeImage } from '../components/SafeImage';
import { useSiteConfig } from '../context/SiteConfigContext';

const MOVING_DAY_SCENES = [
  {
    stage: 'Stage 01 · Loading at Collection',
    title: 'Loading Boxes into the Van',
    description:
      'Sealed, clearly labelled boxes and household items are stacked systematically inside the vehicle cargo area so weight is balanced for transit.',
    image: '/assets/photos/mover_loading_sprinter_rear.jpg',
    imageAlt:
      'Mover lifting stacked cardboard boxes carefully into the open rear cargo doors of a white Sprinter van',
  },
  {
    stage: 'Stage 02 · Handling Furniture',
    title: 'Carrying Furniture & Bulky Pieces',
    description:
      'Sofas, tables, and larger items are guided carefully through hallways, doorways, and stairwells using the access notes shared in your enquiry.',
    image: '/assets/photos/mover_carrying_sofa_hallway.jpg',
    imageAlt:
      'Mover carrying an upholstered green sofa carefully through an interior hallway and doorway',
  },
  {
    stage: 'Stage 03 · Arrival & Unloading',
    title: 'Unloading at Your Destination',
    description:
      'On arrival at your delivery postcode, boxes and furniture are carried directly into the destination property according to your agreed instructions.',
    image: '/assets/photos/movers_carrying_boxes_room.jpg',
    imageAlt:
      'Two movers carrying stacked cardboard moving boxes into a sunlit room at the destination home',
  },
];

const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Enter Your Pickup Location',
    summary: 'Identify where your collection begins.',
    details:
      'Provide the full collection street address and UK postcode. Select the property type (such as a house, flat, storage unit, or workplace) and include practical notes on floor levels, parking restrictions, or loading bays.',
  },
  {
    number: '02',
    title: 'Enter Your Drop-Off Location',
    summary: 'Specify the destination address and access notes.',
    details:
      'Enter the complete delivery street address and postcode, along with entry instructions, upper-floor access details, or multi-stop requirements if your move involves more than a single pickup and drop-off.',
  },
  {
    number: '03',
    title: 'Describe What Needs Moving',
    summary: 'Share a clear breakdown of items and boxes.',
    details:
      'Choose the relevant service category and list the furniture items and approximate box quantities. Add measurements where helpful, highlight heavy or fragile belongings, confirm stair or lift availability, and optionally attach photographs.',
  },
  {
    number: '04',
    title: 'Select a Preferred Date',
    summary: 'Let MK Vane know your ideal moving schedule.',
    details:
      'Pick your preferred moving date, an optional alternative date, and a preferred time window. Requested dates and times are recorded as preferences and are only reserved once confirmed directly by MK Vane.',
  },
  {
    number: '05',
    title: 'Provide Contact Details',
    summary: 'Share direct contact information for follow-up.',
    details:
      'Enter your full name, telephone number, and optional email address, together with any preferred contact notes so MK Vane can reach you promptly after reviewing your enquiry.',
  },
  {
    number: '06',
    title: 'Review and Submit',
    summary: 'Check every detail carefully before sending.',
    details:
      'Verify your route, item list, and contact details on the Review step before submitting. An enquiry reference appears on screen once our server confirms receipt of your submission.',
  },
  {
    number: '07',
    title: 'Confirm the Arrangement',
    summary: 'Agree availability, quote, and final booking terms.',
    details:
      'Submitting the online form requests a review rather than an instant booking. MK Vane assesses your enquiry and contacts you directly to confirm vehicle availability, quote details, and final moving arrangements.',
  },
];

export function HowItWorksPage() {
  const { howItWorksFaqs, updateHowItWorksFaq } = useSiteConfig();
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    howItWorksFaqs[0]?.id || null
  );
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [draftQ, setDraftQ] = useState('');
  const [draftA, setDraftA] = useState('');

  const beginEdit = (id: string, q: string, a: string) => {
    setEditingFaqId(id);
    setDraftQ(q);
    setDraftA(a);
  };

  const saveFaq = (id: string) => {
    updateHowItWorksFaq(id, draftQ, draftA);
    setEditingFaqId(null);
  };

  return (
    <div className="bg-white text-[#34383D] pt-20">
      <PageSeo
        title="How It Works — Moving & Transport Enquiry Guide | MK Vane Ipswich"
        description="See how to arrange a move with MK Vane in seven clear steps: provide your pickup and drop-off locations, describe your items, and confirm arrangements."
      />

      {/* Full-Colour Photographic Hero Banner with Dark Contrast Overlay */}
      <section className="relative py-24 lg:py-32 bg-[#202327] text-white overflow-hidden border-b border-[#34383D]">
        <SafeImage
          src="/assets/photos/team_loading_sprinter_trolley.jpg"
          alt="Uniformed movers loading cardboard boxes into the open rear doors of a white commercial van using a wheeled trolley"
          className="absolute inset-0 w-full h-full object-cover object-[center_38%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#202327]/88 via-[#202327]/70 to-[#202327]/34"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9DDE1]">
              Step-by-Step Customer Journey
            </p>
            <h1 className="font-seasons text-4xl sm:text-6xl font-medium text-white leading-[1.1] text-balance">
              A Clearer Way to Arrange Your Move
            </h1>
            <p className="text-base sm:text-lg text-[#F5F6F7]/90 leading-relaxed max-w-2xl">
              From sharing your pickup and destination postcodes to loading the
              van and unloading at your new address, here is how a move with MK
              Vane comes together.
            </p>
            <div className="pt-2">
              <Link
                to="/book-a-move"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#202327] text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Start Your Enquiry</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Moving Day in Practice — 3 Realistic Full-Colour Scenes */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-2xl mb-14 space-y-3">
            <span className="font-signature text-3xl text-[#555B61] block leading-none">
              From collection to arrival
            </span>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
              Moving Day in Practice
            </h2>
            <p className="text-base text-[#555B61] leading-relaxed">
              Accurate preparation before moving day ensures loading, furniture
              handling, and unloading run smoothly at both addresses.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOVING_DAY_SCENES.map((scene, idx) => (
              <Reveal
                key={scene.title}
                delay={idx * 0.05}
                className="bg-white border border-[#D9DDE1] h-full flex flex-col"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#F5F6F7] border-b border-[#D9DDE1]">
                  <SafeImage
                    src={scene.image}
                    alt={scene.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#858B91] mb-2">
                      {scene.stage}
                    </p>
                    <h3 className="font-seasons text-2xl font-semibold text-[#34383D] mb-2.5 leading-snug">
                      {scene.title}
                    </h3>
                    <p className="text-sm text-[#555B61] leading-relaxed">
                      {scene.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Step Customer Journey Timeline */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#D9DDE1]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <Reveal className="max-w-2xl mb-14 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91]">
              Online Enquiry Workflow
            </p>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D] leading-[1.14] text-balance">
              Seven Clear Steps to Request a Move
            </h2>
          </Reveal>

          <div className="space-y-6">
            {JOURNEY_STEPS.map((step, idx) => (
              <Reveal
                key={step.number}
                delay={idx * 0.04}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 p-8 sm:p-10 border border-[#D9DDE1] bg-white hover:border-[#858B91] transition-colors"
              >
                <div className="md:col-span-4 flex flex-col justify-between">
                  <div>
                    <span className="font-seasons text-3xl font-semibold text-[#858B91] tabular-nums block mb-2">
                      Step {step.number}
                    </span>
                    <h3 className="font-seasons text-2xl sm:text-3xl font-semibold text-[#34383D] leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-[#858B91] mt-3">
                    {step.summary}
                  </p>
                </div>

                <div className="md:col-span-8 flex items-center">
                  <p className="text-base text-[#555B61] leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 p-8 bg-[#F5F6F7] border border-[#D9DDE1]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#858B91] mb-2">
              Important Note on Enquiries
            </p>
            <p className="text-sm text-[#34383D] leading-relaxed">
              Once your enquiry is received, you will see an on-screen
              confirmation reference stating:{' '}
              <span className="italic text-[#555B61]">
                &ldquo;Thank you for contacting MK Vane. Your enquiry has been
                submitted successfully. The details you provided will be
                reviewed, and the business can contact you using your supplied
                contact information.&rdquo;
              </span>{' '}
              All availability, quotes, and moving schedules remain subject to
              direct confirmation with MK Vane.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Editable Frequently Asked Questions */}
      <section className="py-20 lg:py-28 bg-[#F5F6F7] border-b border-[#D9DDE1]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal className="mb-12">
            <span className="font-signature text-3xl text-[#555B61] block mb-1 leading-none">
              Helpful answers
            </span>
            <h2 className="font-seasons text-3xl sm:text-5xl font-medium text-[#34383D]">
              Frequently Asked Questions
            </h2>
          </Reveal>

          <div className="space-y-4">
            {howItWorksFaqs.map((faq) => {
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
                    <span className="font-seasons text-xl sm:text-2xl font-semibold text-[#34383D] leading-snug">
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
                    <div className="px-6 pb-6 pt-3 border-t border-[#F5F6F7] space-y-4">
                      {isEditing ? (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label
                              htmlFor={`faq-q-${faq.id}`}
                              className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1"
                            >
                              Question
                            </label>
                            <input
                              id={`faq-q-${faq.id}`}
                              type="text"
                              value={draftQ}
                              onChange={(e) => setDraftQ(e.target.value)}
                              className="w-full px-3 py-2 border border-[#D9DDE1] text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`faq-a-${faq.id}`}
                              className="block text-xs font-semibold uppercase tracking-wider text-[#34383D] mb-1"
                            >
                              Answer
                            </label>
                            <textarea
                              id={`faq-a-${faq.id}`}
                              rows={3}
                              value={draftA}
                              onChange={(e) => setDraftA(e.target.value)}
                              className="w-full px-3 py-2 border border-[#D9DDE1] text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveFaq(faq.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#34383D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFaqId(null)}
                              className="px-4 py-2 border border-[#D9DDE1] text-xs font-semibold uppercase tracking-wider text-[#555B61] cursor-pointer"
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
                              beginEdit(faq.id, faq.question, faq.answer)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#858B91] hover:text-[#34383D] cursor-pointer"
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
      <section className="py-20 lg:py-28 bg-[#34383D] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal className="space-y-6">
            <h2 className="font-seasons text-4xl sm:text-5xl font-medium text-white leading-[1.14] text-balance">
              Ready to Share Your Journey Details?
            </h2>
            <p className="text-base text-[#D9DDE1] max-w-xl mx-auto leading-relaxed">
              Enter your collection and delivery postcodes on our step-by-step
              booking page to get started.
            </p>
            <div className="pt-3">
              <Link
                to="/book-a-move"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#202327] text-xs font-semibold tracking-widest uppercase hover:bg-[#F5F6F7] transition-colors whitespace-nowrap shrink-0"
              >
                <span>START YOUR ENQUIRY</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
