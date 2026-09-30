import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Smartphone,
  Sparkles,
  Zap,
  TrendingUp,
  Store,
  Coffee,
  Scissors,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Top Navbar */}
      <nav className="h-16 sm:h-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-all">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block leading-none">
                Price<span className="text-brand-600">QR</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                Live
              </span>
            </div>
            <span className="hidden md:block text-[11px] font-medium text-slate-400 mt-0.5">
              Digital Business Profile & Price Lists
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </a>
          <a href="#advantages" className="hover:text-slate-900 transition-colors">
            Advantages
          </a>
          <a href="#use-cases" className="hover:text-slate-900 transition-colors">
            For All Businesses
          </a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/m/BUS_8F72K9"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs font-semibold px-2.5 sm:px-3">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="text-xs font-bold px-3 sm:px-4 shadow-sm">
              <span className="hidden sm:inline">Create Your Business</span>
              <span className="sm:hidden">Get Started</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-6 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>One QR code. Unlimited live catalog & price updates.</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Your business, <span className="text-brand-600 underline decoration-brand-200 decoration-wavy underline-offset-4">beautifully online.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Create your digital price list, showcase products & services, share active deals, and let customers browse and contact you instantly with one scannable QR code.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 text-base">
              <span>Create Your Business</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/m/BUS_8F72K9" target="_blank" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 text-base">
              <span>See How It Works</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Button>
          </Link>
        </div>

        {/* Visual Architecture Demonstration */}
        <div className="mt-14 p-6 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-premium max-w-4xl mx-auto text-left relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Step 1: The QR Doorway */}
            <div className="flex-1 flex flex-col items-center text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 w-full">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm mb-3">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=http://localhost:5173/m/BUS_8F72K9&color=111111"
                  alt="Live Demonstration QR"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">Static Scannable QR</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">/m/BUS_8F72K9</div>
              <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">
                Print once for counters, desks, or displays. The QR never needs reprinting!
              </p>
            </div>

            {/* Transition Arrow */}
            <div className="flex flex-col items-center text-slate-400">
              <div className="p-2.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">Instant Scan</span>
            </div>

            {/* Step 2: Instant Mobile Storefront Preview */}
            <div className="flex-1 bg-slate-950 p-3 sm:p-4 rounded-3xl shadow-xl border-4 border-slate-800 w-full max-w-[280px]">
              <div className="bg-white rounded-2xl overflow-hidden text-left p-3.5">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px]">
                    AR
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-900 truncate">Artisan & Co.</div>
                    <div className="text-[9px] text-emerald-600 font-medium">● Open now</div>
                  </div>
                </div>

                <div className="p-2 bg-brand-50 border border-brand-200 rounded-lg mb-2">
                  <div className="text-[10px] font-bold text-brand-800">SUMMER SPECIAL OFFER</div>
                  <div className="text-[9px] text-brand-600">Flat 20% off all catalog items</div>
                </div>

                <div className="space-y-1.5">
                  <div className="p-1.5 bg-slate-50 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 truncate">Premium Service Package</span>
                    <span className="font-bold text-slate-900">₹399</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 truncate">Custom Crafted Product</span>
                    <span className="font-bold text-slate-900">₹499</span>
                  </div>
                </div>

                <Link
                  to="/m/BUS_8F72K9"
                  target="_blank"
                  className="mt-3 block text-center py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-black transition-colors"
                >
                  View Full Live Storefront →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-brand-600 tracking-wider uppercase mb-2">
              Simple 3-Step Setup
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              From zero to your live digital catalog in 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Create Business Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Add your business name, logo, opening hours, contact details, and social links.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Add Products & Services
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Organize items by categories, upload photos directly, set original & discount prices, and create promotional deals.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Download & Print QR
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Download high-res PNG or vector SVG. Print counter standees or window posters. Update your catalog anytime without changing the QR!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Use Cases - UNIVERSAL */}
      <section id="use-cases" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-brand-600 tracking-wider uppercase mb-2">
            Built For Every Business
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for retail, services, hospitality, healthcare & more
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: 'Retail & Local Stores', desc: 'Product catalogs, stock pricing & promotional discounts', icon: ShoppingBag },
            { title: 'Salons, Spas & Beauty', desc: 'Service rate cards, treatment packages & stylists', icon: Scissors },
            { title: 'Automotive & Repair', desc: 'Service tariffs, parts pricing & maintenance packages', icon: Zap },
            { title: 'Clinics & Healthcare', desc: 'Doctor consultations, lab test lists & health packages', icon: ShieldCheck },
            { title: 'Gyms & Fitness Centers', desc: 'Membership tiers, personal trainer fees & class schedules', icon: TrendingUp },
            { title: 'Restaurants & Cafes', desc: 'Digital menus, chef specials & dietary choices', icon: Coffee },
            { title: 'Electronic & Tech Stores', desc: 'Gadget specs, accessories & warranty pricing', icon: Smartphone },
            { title: 'Home & Professional Services', desc: 'Hourly rates, fixed service fees & booking options', icon: Store },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Advantages */}
      <section id="advantages" className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xs font-bold text-brand-600 tracking-wider uppercase mb-2">
                The PriceQR Advantage
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                The QR Code Never Changes. Your Live Prices Always Do.
              </h3>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Traditional printed price lists and PDF menus require reprinting your physical flyers or QR codes every time a price changes. With PriceQR, your QR points to a smart cloud storefront. Change a price, add a festival offer, or mark an item out of stock in your dashboard — and customers see it instantly.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Instant search and category filters for customers',
                  'Zero app download required — opens instantly on iOS & Android browsers',
                  'Direct Call, WhatsApp, Directions, and Share buttons',
                  'Built-in real-time Open / Closed business hours calculation',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Analytics Preview
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  +34% this week
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-subtle">
                  <div>
                    <div className="text-xs text-slate-500">Total QR Scans</div>
                    <div className="text-xl font-extrabold text-slate-900">1,842</div>
                  </div>
                  <QrCode className="w-8 h-8 text-brand-500" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-subtle">
                  <div>
                    <div className="text-xs text-slate-500">Catalog Views</div>
                    <div className="text-xl font-extrabold text-slate-900">3,421</div>
                  </div>
                  <Smartphone className="w-8 h-8 text-slate-800" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-subtle">
                  <div>
                    <div className="text-xs text-slate-500">Active Deals</div>
                    <div className="text-xl font-extrabold text-slate-900">2 Running</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-brand-600 tracking-wider uppercase mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-4 text-left">
          {[
            {
              q: 'Is PriceQR only for restaurants?',
              a: 'No! PriceQR is built for EVERY business — including retail stores, salons, spas, repair shops, clinics, gyms, groceries, freelance services, as well as cafes and restaurants.',
            },
            {
              q: 'Do customers need to download an app?',
              a: 'No! Customers simply open their standard phone camera, scan the QR code, and your digital business profile & price list opens in their web browser within seconds.',
            },
            {
              q: 'What happens if I update my prices or add new items?',
              a: 'Your QR code stays exactly the same. You update your prices or items in your dashboard, and when customers scan the QR, they immediately see the updated information.',
            },
            {
              q: 'Can I print counter cards, acrylic standees or wall posters?',
              a: 'Yes! PriceQR comes with a built-in Print Studio supporting counter cards, acrylic standees, and A4/A5 layouts with your business logo and clear scanning instructions.',
            },
            {
              q: 'Can I upload photos of my products and logo?',
              a: 'Yes! You can directly upload image files from your computer or phone (JPG, PNG, WEBP, etc.) or provide image links.',
            },
            {
              q: 'How do customers contact my business?',
              a: 'Your digital profile features direct one-tap Call, WhatsApp, Google Maps directions, and social media buttons.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-1">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              One QR. Your entire business, beautifully online.
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Join modern shops, salons, clinics, services, and eateries providing effortless digital experiences.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="brand" size="lg" className="w-full sm:w-auto text-base">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/m/BUS_8F72K9" target="_blank" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800 text-base">
                  Explore Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-slate-800">PriceQR Platform</span>
            <span>— Digital Business Profile & Price List Engine</span>
          </div>
          <div>© {new Date().getFullYear()} PriceQR. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
