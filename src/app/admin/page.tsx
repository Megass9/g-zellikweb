"use client"

import { useEffect, useState } from 'react'
import { db, collection, getDocs } from '@/lib/firebase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    services: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const appSnapshot = await getDocs(collection(db, 'appointments'))
        const srvSnapshot = await getDocs(collection(db, 'services'))
        
        setStats({
          appointments: appSnapshot.size,
          services: srvSnapshot.size,
        })
      } catch (err) {
        console.error('Fetch stats error:', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '32px' }}>Genel Bakış</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {/* Card 1 */}
        <div className="card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: 64, height: 64,
            background: 'var(--rose-light)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
          }}>📅</div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--rose-deep)' }}>{stats.appointments}</div>
            <div style={{ color: 'var(--muted)' }}>Toplam Randevu</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: 64, height: 64,
            background: '#e8f4ff',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
          }}>✨</div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#0070f3' }}>{stats.services}</div>
            <div style={{ color: 'var(--muted)' }}>Aktif Hizmet</div>
          </div>
        </div>
      </div>
    </div>
  )
}