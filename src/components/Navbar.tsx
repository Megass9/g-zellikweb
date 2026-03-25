'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.4s ease',
        maxWidth: '100%',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 16 }}>✦</span>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 500,
            color: 'var(--charcoal)',
            letterSpacing: '0.5px',
          }}>Lumière</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="desktop-nav">
          {[
            { href: '/', label: 'Ana Sayfa' },
            { href: '/hizmetler', label: 'Hizmetler' },
            { href: '/galeri', label: 'Galeri' },
            { href: '/fiyatlar', label: 'Fiyatlar' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--charcoal)',
              opacity: 0.75,
              transition: 'opacity 0.2s',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/randevu" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
            Randevu Al
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: 5,
            padding: 4,
          }}
          aria-label="Menü"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 24, height: 1.5,
              background: 'var(--charcoal)',
              borderRadius: 2,
              display: 'block',
              transition: 'all 0.3s',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 72, left: 0, right: 0,
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {[
            { href: '/', label: 'Ana Sayfa' },
            { href: '/hizmetler', label: 'Hizmetler' },
            { href: '/galeri', label: 'Galeri' },
            { href: '/fiyatlar', label: 'Fiyatlar' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '15px', color: 'var(--charcoal)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/randevu" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center', marginTop: 8 }}>
            Randevu Al
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
