"use client"

import { useState } from 'react'

export default function PricingPage() {
  const [hovered, setHovered] = useState<string | null>(null)

  const priceList = [
    { category: 'Saç Hizmetleri', items: [
      { name: 'Saç Kesim', price: '350 ₺' },
      { name: 'Fön', price: '200 ₺' },
      { name: 'Dip Boya', price: '700 ₺' },
      { name: 'Keratin Bakım', price: '1500 ₺' },
    ]},
    { category: 'Cilt Bakımı', items: [
      { name: 'Klasik Cilt Bakımı', price: '800 ₺' },
      { name: 'Hydrafacial', price: '1200 ₺' },
      { name: 'Leke Tedavisi', price: '950 ₺' },
    ]},
    { category: 'El & Ayak', items: [
      { name: 'Manikür', price: '400 ₺' },
      { name: 'Pedikür', price: '500 ₺' },
      { name: 'Kalıcı Oje', price: '350 ₺' },
    ]},
  ]

  return (
    <div style={{ padding: '80px 24px', background: 'var(--blush)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 className="section-title">Fiyat Listesi</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '16px auto' }}>
            Sunduğumuz profesyonel hizmetlerin güncel fiyatlandırması.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'flex-start'
        }}>
          {priceList.map(section => (
            <div 
              key={section.category} 
              className="card" 
              style={{ 
                padding: '32px',
                transition: 'all 0.3s ease',
                transform: hovered === section.category ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered === section.category ? 'var(--shadow-soft)' : 'var(--shadow-xs)',
              }}
              onMouseEnter={() => setHovered(section.category)}
              onMouseLeave={() => setHovered(null)}
            >
              <h2 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.75rem', 
                color: 'var(--rose-deep)',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)'
              }}>
                {section.category}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {section.items.map(item => (
                  <li key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                    <span style={{ color: 'var(--charcoal)' }}>{item.name}</span>
                    <span style={{ fontWeight: 500, color: 'var(--muted)' }}>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}