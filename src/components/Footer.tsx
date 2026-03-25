"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--charcoal)',
      color: 'rgba(255,255,255,0.7)',
      padding: '64px 24px 32px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 48,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 14 }}>✦</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                color: 'white',
              }}>Lumière</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>
              Güzelliğinizi keşfedin. Profesyonel ekibimizle kendinizi en iyi hissedin.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['Instagram', 'Facebook', 'TikTok'].map(s => (
                <a key={s} href="#" style={{
                  width: 36, height: 36,
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                  transition: 'all 0.3s',
                  color: 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                >{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Sayfalar</h4>
            {[
              { href: '/', label: 'Ana Sayfa' },
              { href: '/hizmetler', label: 'Hizmetler' },
              { href: '/galeri', label: 'Galeri' },
              { href: '/fiyatlar', label: 'Fiyat Listesi' },
              { href: '/randevu', label: 'Randevu Al' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'block',
                fontSize: 14,
                padding: '6px 0',
                transition: 'color 0.2s',
                color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--rose)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              >{item.label}</Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Hizmetler</h4>
            {['Saç Bakımı', 'Cilt Bakımı', 'Manikür & Pedikür', 'Kaş & Kirpik', 'Makyaj', 'Masaj'].map(s => (
              <span key={s} style={{ display: 'block', fontSize: 14, padding: '6px 0', color: 'rgba(255,255,255,0.6)' }}>{s}</span>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontSize: 14, fontWeight: 500, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>İletişim</h4>
            {[
              { icon: '📍', text: 'Kayseri, Türkiye' },
              { icon: '📞', text: '+90 555 000 00 00' },
              { icon: '✉️', text: 'info@lumiere.com' },
              { icon: '🕐', text: 'Pzt–Cmt: 09:00–20:00' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span>© 2025 Lumière Beauty. Tüm hakları saklıdır.</span>
          <span>Güzellik, zarafetle başlar ✦</span>
        </div>
      </div>
    </footer>
  )
}
