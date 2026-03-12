'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PropertySearchCard from '@/components/PropertySearchCard';
import PropertyGrid from '@/components/PropertyGrid';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, DollarSign, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';

/* ── tiny scroll-reveal hook ─────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children, delay = 0, from = 'bottom',
}: { children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' }) {
  const { ref, visible } = useInView();
  const map = { bottom: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : map[from],
      transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── animated counter ────────────────────────────────────────── */
function Counter({ value }: { value: string }) {
  const num = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/[\d,]/g, '');
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let c = 0;
    const step = Math.ceil(num / 55);
    const id = setInterval(() => { c += step; if (c >= num) { setCount(num); clearInterval(id); } else setCount(c); }, 16);
    return () => clearInterval(id);
  }, [visible, num]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 60); return () => clearTimeout(t); }, []);

  const handleSearch = () => setHasSearched(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --sand:    #f5f0e8;
          --parchment: #ede8df;
          --ink:     #1c1714;
          --brass:   #b07d3a;
          --brass-lt:#d4a055;
          --sage:    #4e7a6a;
          --rust:    #9e3d2b;
          --white:   #ffffff;
          --muted:   #7a6f65;
          --card-bg: rgba(255,255,255,0.72);
          --card-border: rgba(176,125,58,0.15);
          --r: 1.25rem;
        }

        .home-page { font-family: 'Outfit', sans-serif; background: var(--sand); color: var(--ink); overflow-x: hidden; }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          overflow: hidden;
          background: var(--ink);
          padding: 7rem 1.5rem 5rem;
        }

        /* Layered background: blueprint grid + radial glow */
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 50% 40%, rgba(176,125,58,0.12) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: auto, 48px 48px, 48px 48px;
          background-position: 0 0, -1px -1px, -1px -1px;
        }

        /* Floating orbs */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .orb-1 { width: 500px; height: 500px; top:-160px; right:-100px; background: rgba(176,125,58,.09); animation: orb1 12s ease-in-out infinite; }
        .orb-2 { width: 420px; height: 420px; bottom:-140px; left:-100px; background: rgba(78,122,106,.07); animation: orb2 15s ease-in-out infinite; }
        .orb-3 { width: 280px; height: 280px; top:40%; left:60%; background: rgba(176,125,58,.06); animation: orb3 10s ease-in-out infinite; }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-25px)} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }

        .hero-inner { position:relative; z-index:1; text-align:center; max-width:900px; width:100%; }

        .hero-pill {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .4rem 1.1rem;
          border: 1px solid rgba(176,125,58,.4);
          border-radius: 2rem;
          background: rgba(176,125,58,.1);
          font-size: .72rem; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
          color: var(--brass-lt);
          margin-bottom: 2rem;
          opacity: 0; animation: fadeUp .5s ease .1s forwards;
        }
        .hero-pill-dot { width: 6px; height: 6px; background: var(--brass-lt); border-radius: 50%; animation: pulse 1.5s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        .hero h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 700;
          line-height: 1.0;
          color: #fff;
          margin-bottom: 1.75rem;
          opacity: 0; animation: fadeUp .7s ease .25s forwards;
        }
        .hero h1 em { font-style: italic; color: var(--brass-lt); }

        .hero-desc {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: rgba(255,255,255,.55);
          max-width: 560px; margin: 0 auto 2.5rem;
          line-height: 1.8; font-weight: 300;
          opacity: 0; animation: fadeUp .7s ease .4s forwards;
        }

        .hero-ctas {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          margin-bottom: 3.5rem;
          opacity: 0; animation: fadeUp .7s ease .55s forwards;
        }
        .btn-brass {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .85rem 2rem;
          background: var(--brass);
          color: #fff; font-weight: 600; font-size: .95rem;
          border-radius: 3rem; text-decoration: none;
          transition: transform .2s, box-shadow .2s, background .2s;
          border: none; cursor: pointer;
        }
        .btn-brass:hover { transform: translateY(-2px); background: var(--brass-lt); box-shadow: 0 10px 30px rgba(176,125,58,.35); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .85rem 2rem;
          border: 1px solid rgba(255,255,255,.22);
          color: rgba(255,255,255,.8); font-weight: 500; font-size: .95rem;
          border-radius: 3rem; text-decoration: none; background: transparent;
          transition: border-color .2s, background .2s; cursor: pointer;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,.5); background: rgba(255,255,255,.06); }

        /* Stats row in hero */
        .hero-stats {
          display: flex; gap: 0; justify-content: center;
          border: 1px solid rgba(176,125,58,.2);
          border-radius: var(--r);
          overflow: hidden;
          background: rgba(255,255,255,.04);
          backdrop-filter: blur(12px);
          max-width: 600px; margin: 0 auto 3.5rem;
          opacity: 0; animation: fadeUp .7s ease .7s forwards;
        }
        .hero-stat {
          flex: 1; padding: 1.5rem 1rem; text-align: center;
          border-right: 1px solid rgba(176,125,58,.15);
          transition: background .2s;
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat:hover { background: rgba(255,255,255,.06); }
        .hero-stat strong {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 700;
          color: var(--brass-lt); line-height: 1;
        }
        .hero-stat span {
          display: block; margin-top: .3rem;
          font-size: .72rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.38);
        }

        /* Search card wrapper */
        .search-wrapper {
          position: relative;
          opacity: 0; animation: fadeUp .8s ease .85s forwards;
        }
        .search-wrapper::before {
          content: '';
          position: absolute; inset: -1px;
          border-radius: calc(var(--r) + 1px);
          background: linear-gradient(135deg, rgba(176,125,58,.4), rgba(78,122,106,.2), rgba(176,125,58,.3));
          z-index: 0;
        }
        .search-inner { position: relative; z-index: 1; border-radius: var(--r); overflow: hidden; }

        /* Scroll cue */
        .scroll-cue {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: .4rem;
          color: rgba(255,255,255,.25); font-size: .65rem; letter-spacing: .15em; text-transform: uppercase;
          opacity: 0; animation: fadeIn 1s ease 1.4s forwards;
        }
        .scroll-track { width: 18px; height: 28px; border: 1px solid rgba(255,255,255,.2); border-radius: 9px; position: relative; }
        .scroll-track::after {
          content: ''; position: absolute; top: 4px; left: 50%; transform: translateX(-50%);
          width: 3px; height: 5px; background: var(--brass); border-radius: 2px;
          animation: scrollBob 1.6s ease infinite;
        }
        @keyframes scrollBob { 0%,100%{top:4px;opacity:1} 60%{top:14px;opacity:.2} }

        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        /* ── FEATURED SECTION ── */
        .section { padding: 6rem 1.5rem; }
        .container { max-width: 1160px; margin: auto; }

        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem; margin-bottom: 3rem;
        }
        .section-eyebrow {
          display: block; font-size: .7rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--brass); margin-bottom: .5rem;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3.5vw, 2.75rem);
          font-weight: 700; line-height: 1.15;
        }
        .section-link {
          display: inline-flex; align-items: center; gap: .4rem;
          font-size: .9rem; font-weight: 600; color: var(--brass);
          text-decoration: none; white-space: nowrap;
          border-bottom: 1px solid transparent;
          transition: border-color .2s;
        }
        .section-link:hover { border-color: var(--brass); }

        /* ── WHY US ── */
        .why-bg {
          background: var(--ink);
          padding: 6rem 1.5rem;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
          gap: 1.5rem; margin-top: 3.5rem;
        }
        .why-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(176,125,58,.12);
          border-radius: var(--r);
          padding: 2.5rem 2rem;
          transition: background .3s, border-color .3s, transform .3s;
        }
        .why-card:hover { background: rgba(255,255,255,.07); border-color: rgba(176,125,58,.3); transform: translateY(-4px); }
        .why-icon-wrap {
          width: 52px; height: 52px;
          border: 1px solid rgba(176,125,58,.3);
          border-radius: .875rem;
          display: flex; align-items: center; justify-content: center;
          background: rgba(176,125,58,.1);
          margin-bottom: 1.5rem;
          color: var(--brass-lt);
        }
        .why-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 700; color: #fff;
          margin-bottom: .6rem;
        }
        .why-card p { color: rgba(255,255,255,.45); line-height: 1.75; font-size: .93rem; }

        /* ── TESTIMONIAL ── */
        .testi-strip {
          background: var(--parchment);
          padding: 5rem 1.5rem;
          overflow: hidden;
        }
        .testi-cards {
          display: flex; gap: 1.5rem;
          margin-top: 2.5rem;
          overflow-x: auto; padding-bottom: .5rem;
          scrollbar-width: none;
        }
        .testi-cards::-webkit-scrollbar { display: none; }
        .testi-card {
          flex: 0 0 320px;
          background: var(--white);
          border: 1px solid var(--card-border);
          border-radius: var(--r);
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(28,23,20,.06);
          transition: transform .3s, box-shadow .3s;
        }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(28,23,20,.10); }
        .stars { display: flex; gap: 3px; margin-bottom: 1rem; color: var(--brass); }
        .testi-card blockquote {
          font-size: .95rem; line-height: 1.75; color: var(--muted);
          margin-bottom: 1.25rem;
          font-style: italic;
        }
        .testi-author { display: flex; align-items: center; gap: .75rem; }
        .testi-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, var(--brass), var(--rust));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 700; color: #fff;
        }
        .testi-name { font-weight: 600; font-size: .9rem; }
        .testi-role { font-size: .78rem; color: var(--muted); }

        /* ── CTA BOTTOM ── */
        .cta-bottom {
          background: #231e1b;
          padding: 6rem 1.5rem;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-bottom::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
          background-size: 180px; opacity: .5; pointer-events: none;
        }
        .cta-bottom h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem,5vw,3.5rem); font-weight: 700; color: #fff;
          margin-bottom: 1rem; position: relative;
        }
        .cta-bottom p {
          color: rgba(255,255,255,.7); font-size: 1.05rem;
          max-width: 520px; margin: 0 auto 2.5rem; line-height: 1.7; position: relative;
        }
        .btn-white {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .9rem 2.25rem;
          background: #fff; color: var(--brass);
          font-weight: 700; font-size: .95rem;
          border-radius: 3rem; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          position: relative;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,.2); }

        .cta-feats {
          display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
          margin-top: 3rem; position: relative;
        }
        .cta-feat {
          display: flex; align-items: center; gap: .5rem;
          color: rgba(255,255,255,.75); font-size: .88rem;
        }
        .cta-feat svg { color: rgba(255,255,255,.5); }
      `}</style>

      <div className="home-page">

        {/* ═══ HERO ═══ */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          <div className="hero-inner">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              Discover Premium Properties
            </div>

            <h1>
              Find Your<br /><em>Dream Home.</em>
            </h1>

            <p className="hero-desc">
              Browse thousands of curated listings, connect with expert agents, and
              make the most important decision of your life with total confidence.
            </p>

            <div className="hero-ctas">
              <Link href="/admin/login">
                <button className="btn-brass">
                  Start Searching <ArrowRight size={16} />
                </button>
              </Link>
              <button className="btn-ghost">Learn More</button>
            </div>

            <div className="hero-stats">
              {[
                { value: '5000+', label: 'Active Listings' },
                { value: '10000+', label: 'Happy Clients' },
                { value: '50+', label: 'Expert Agents' },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <strong><Counter value={s.value} /></strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="search-wrapper">
              <div className="search-inner">
                <PropertySearchCard
                  onSearch={handleSearch}
                  searchCity={searchCity}
                  setSearchCity={setSearchCity}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  propertyType={propertyType}
                  setPropertyType={setPropertyType}
                />
              </div>
            </div>
          </div>

          <div className="scroll-cue">
            <div className="scroll-track" />
            Scroll
          </div>
        </section>

        {/* ═══ FEATURED PROPERTIES ═══ */}
        <section className="section text-white relative" style={{ background: '#231e1b' }}>
          <div className="hero-bg" />
          <div className="container">
            <Reveal>
              <div className="section-header">
                <div>
                  <span className="section-eyebrow" style={{ color: '#fff' }}>Handpicked For You</span>
                  <h2 className="section-title" style={{ color: '#fff' }}>
                    {hasSearched ? 'Search Results' : 'Featured Properties'}
                  </h2>
                </div>
                {!hasSearched && (
                  <Link href="/listings" className="section-link text-white">
                    View all listings <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <PropertyGrid
                searchCity={searchCity}
                minPrice={minPrice}
                maxPrice={maxPrice}
                propertyType={propertyType}
                hasSearched={hasSearched}
              />
            </Reveal>
          </div>
        </section>



        {/* ═══ CTA BOTTOM ═══ */}
        <section className="cta-bottom">
          <Reveal>
            <h2>Ready to find your forever home?</h2>
            <p>
              Join thousands of happy homeowners who trusted Real Estate Hub to
              make the biggest decision of their lives feel effortless.
            </p>
            <Link href="/admin/login">
              <span className="btn-white">Get Started Today <ArrowRight size={16} /></span>
            </Link>
            <div className="cta-feats">
              {['No sign-up fee', '5,000+ verified listings', 'Expert agents on call'].map((f) => (
                <div key={f} className="cta-feat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

      </div>
    </>
  );
}