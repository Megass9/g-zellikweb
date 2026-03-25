"use client"

import { useEffect, useState } from 'react'
import { db, collection, getDocs, query, orderBy } from '@/lib/firebase'
import type { Service } from '@/lib/types'
import Link from 'next/link'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), orderBy('category', 'asc'))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service))
        setServices(data)
      } catch (err) {
        console.error('Fetch services error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div style={{ padding: '80px 24px', minHeight: '100vh', background: 'var(--blush)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 className="section-title">Hizmetlerimiz</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '16px auto' }}>
            Size özel hazırladığımız bakım ve güzellik hizmetlerimizi keşfedin.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {services.map(service => (
              <div key={service.id} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--rose-deep)', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  marginBottom: '12px',
                  letterSpacing: '1px'
                }}>
                  {service.category}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '12px' }}>
                  {service.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', flex: 1 }}>
                  {service.description || 'Profesyonel bakım hizmeti.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--charcoal)' }}>
                    {service.price} ₺
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    {service.duration} dk
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Link href="/randevu" className="btn-primary">Hemen Randevu Al →</Link>
        </div>
      </div>
    </div>
  )
}