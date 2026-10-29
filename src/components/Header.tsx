import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/siteContent';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Areas We Cover', path: '/areas-we-cover' },
  { label: 'Contact', path: '/contact' },
];

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isTransparent = isHomePage && !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        isTransparent
          ? 'bg-transparent border-b border-white/15'
          : 'bg-white/95 backdrop-blur-md border-b border-[#D9DDE1]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand lockup (supplied logo + MK Vane) */}
        <Link
          to="/"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#34383D]"
          aria-label="MK Vane Home"
        >
          <span
            className={`inline-flex items-center justify-center rounded-sm overflow-hidden transition-colors duration-200 ${
              isTransparent ? 'bg-white/95 px-2 py-1' : 'bg-transparent p-0'
            }`}
          >
            <img
              src={BUSINESS_INFO.logoPath}
              alt="MK Vane delivery van emblem"
              className="h-8 w-auto object-contain select-none"
            />
          </span>
          <span
            className={`font-seasons text-2xl font-semibold tracking-tight transition-colors duration-200 ${
              isTransparent ? 'text-white' : 'text-[#34383D]'
            }`}
          >
            {BUSINESS_INFO.brandName}
          </span>
        </Link>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                  isTransparent
                    ? isActive
                      ? 'text-white border-white'
                      : 'text-white/85 border-transparent hover:text-white hover:border-white/50'
                    : isActive
                      ? 'text-[#34383D] border-[#34383D]'
                      : 'text-[#555B61] border-transparent hover:text-[#34383D] hover:border-[#858B91]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/book-a-move"
            className={`inline-flex items-center justify-center px-3.5 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isTransparent
                ? 'bg-white text-[#202327] hover:bg-[#F5F6F7]'
                : 'bg-[#34383D] text-white hover:bg-[#202327]'
            }`}
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book a Move</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isTransparent
                ? 'border-white/40 text-white hover:bg-white/10'
                : 'border-[#D9DDE1] text-[#34383D] hover:bg-[#F5F6F7]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-white border-b border-[#D9DDE1] px-6 py-6 shadow-sm"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-3 px-3 text-base font-medium border-b border-[#F5F6F7] transition-colors ${
                    isActive
                      ? 'text-[#202327] font-semibold bg-[#F5F6F7]'
                      : 'text-[#555B61] hover:text-[#34383D]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/book-a-move"
                className="w-full py-3.5 px-5 bg-[#34383D] text-white text-center text-xs font-semibold tracking-wider uppercase hover:bg-[#202327] transition-colors"
              >
                Book a Move
              </Link>
              <a
                href={BUSINESS_INFO.phoneHref}
                className="w-full py-3 px-5 bg-white text-[#34383D] border border-[#34383D] text-center text-xs font-semibold tracking-wider uppercase hover:bg-[#F5F6F7] transition-colors"
              >
                Call {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
