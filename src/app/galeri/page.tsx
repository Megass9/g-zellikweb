'use client'
import { useState, useEffect } from 'react'
import { db, collection, getDocs, query, orderBy } from '@/lib/firebase'
import type { GalleryImage } from '@/lib/types'

const DEMO_IMAGES = [
  { id: '1', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', caption: 'Saç Boyama', category: 'Saç' },
  { id: '2', url: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=600&q=80', caption: 'Manikür', category: 'El & Ayak' },
  { id: '3', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', caption: 'Yüz Bakımı', category: 'Cilt' },
  { id: '4', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', caption: 'Makyaj', category: 'Makyaj' },
  { id: '5', url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80', caption: 'Keratin Bakımı', category: 'Saç' },
  { id: '6', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', caption: 'Jel Manikür', category: 'El & Ayak' },
  { id: '7', url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', caption: 'Kaş Şekillendirme', category: 'Kaş & Kirpik' },
  { id: '8', url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80', caption: 'Saç Kesimi', category: 'Saç' },
  { id: '9', url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', caption: 'Gelin Makyajı', category: 'Makyaj' },
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(DEMO_IMAGES)
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage))
        if (data.length > 0) setImages(data)
      } catch (err) {
        console.error('Fetch gallery images error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  const categories = ['Tümü', ...Array.from(new Set(images.map(i => i.category || 'Diğer')))]
  const filtered = activeCategory === 'Tümü' ? images : images.filter(i => i.category === activeCategory)

  return (
    <>
      {/* Header */}
      <section style={{
        paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24,
        background: 'linear-gradient(135deg, var(--blush), var(--cream))',
        textAlign: 'center',
      }}>
        <div className="animate-fade-up">
          <div className="section-tag">✦ Çalışmalarımız</div>
          <h1 className="section-title">Galeri</h1>
          <div className="divider" style={{ margin: '16px auto' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Müşterilerimiz için gerçekleştirdiğimiz dönüşümlerden öne çıkan kareler.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section style={{ padding: '40px 24px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: '1.5px solid',
                  borderColor: activeCategory === cat ? 'var(--rose-deep)' : 'var(--border)',
                  background: activeCategory === cat ? 'var(--rose-deep)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--charcoal)',
                  fontSize: 13,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: activeCategory === cat ? 500 : 400,
                }}
              >{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section style={{ padding: '40px 24px 80px', background: 'white' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 64, color: 'var(--muted)' }}>Yükleniyor…</div>
          ) : (
            <div style={{
              columns: '3 280px',
              columnGap: 16,
            }}>
              {filtered.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightbox(img)}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: 16,
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'block',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    style={{
                      width: '100%',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
                  />
                  {img.caption && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                      color: 'white',
                      padding: '24px 16px 12px',
                      fontSize: 13,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                    >{img.caption}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 24, right: 24,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: 44, height: 44,
              borderRadius: '50%',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
          <img
            src={lightbox.url}
            alt={lightbox.caption || ''}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          />
          {lightbox.caption && (
            <div style={{
              position: 'absolute', bottom: 32,
              color: 'white',
              fontSize: 14,
              background: 'rgba(0,0,0,0.5)',
              padding: '8px 20px',
              borderRadius: 50,
            }}>{lightbox.caption}</div>
          )}
        </div>
      )}
    </>
  )
}
