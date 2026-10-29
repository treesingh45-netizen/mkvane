import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_SERVICES,
  INITIAL_COVERAGE_AREAS,
  HOW_IT_WORKS_FAQS,
  CONTACT_FAQS,
  type ServiceCategory,
  type CoverageArea,
  type FaqItem,
} from '../data/siteContent';

interface SiteConfigContextValue {
  services: ServiceCategory[];
  toggleServiceActive: (id: string) => void;
  updateServiceCopy: (id: string, title: string, fullDescription: string) => void;
  coverageAreas: CoverageArea[];
  addCoverageArea: (name: string, notes: string) => void;
  removeCoverageArea: (id: string) => void;
  howItWorksFaqs: FaqItem[];
  updateHowItWorksFaq: (id: string, question: string, answer: string) => void;
  contactFaqs: FaqItem[];
  updateContactFaq: (id: string, question: string, answer: string) => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<ServiceCategory[]>(INITIAL_SERVICES);
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>(INITIAL_COVERAGE_AREAS);
  const [howItWorksFaqs, setHowItWorksFaqs] = useState<FaqItem[]>(HOW_IT_WORKS_FAQS);
  const [contactFaqs, setContactFaqs] = useState<FaqItem[]>(CONTACT_FAQS);

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const updateServiceCopy = (id: string, title: string, fullDescription: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title: title.trim() || s.title,
              fullDescription: fullDescription.trim() || s.fullDescription,
              shortDescription: fullDescription.trim() || s.shortDescription,
            }
          : s
      )
    );
  };

  const addCoverageArea = (name: string, notes: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    setCoverageAreas((prev) => [
      ...prev,
      {
        id: `area-${Date.now()}`,
        name: cleanName,
        status: 'Enquiry Basis',
        notes:
          notes.trim() ||
          'Confirmed for enquiries—share both postcodes on the Book a Move page.',
        active: true,
      },
    ]);
  };

  const removeCoverageArea = (id: string) => {
    if (id === 'ipswich-central') return; // Keep primary verified location
    setCoverageAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const updateHowItWorksFaq = (id: string, question: string, answer: string) => {
    setHowItWorksFaqs((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, question: question.trim() || f.question, answer: answer.trim() || f.answer }
          : f
      )
    );
  };

  const updateContactFaq = (id: string, question: string, answer: string) => {
    setContactFaqs((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, question: question.trim() || f.question, answer: answer.trim() || f.answer }
          : f
      )
    );
  };

  return (
    <SiteConfigContext.Provider
      value={{
        services,
        toggleServiceActive,
        updateServiceCopy,
        coverageAreas,
        addCoverageArea,
        removeCoverageArea,
        howItWorksFaqs,
        updateHowItWorksFaq,
        contactFaqs,
        updateContactFaq,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used inside SiteConfigProvider');
  }
  return ctx;
}
