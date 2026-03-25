"use client"

import { useEffect, useState } from 'react'
import { auth, db, collection, getDocs, query, where, orderBy, doc, updateDoc } from '@/lib/firebase'
import type { Appointment } from '@/lib/types'

export default function PersonelDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    const user = auth.currentUser
    
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const q = query(
        collection(db, 'appointments'),
        where('employee_id', '==', user.uid),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment))
      setAppointments(data)
    } catch (err) {
      console.error('Fetch appointments error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const docRef = doc(db, 'appointments', id)
      await updateDoc(docRef, { status: 'confirmed' })
      fetchAppointments()
    } catch (err: any) {
      alert('Hata: ' + err.message)
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '32px' }}>Randevularım</h1>
      
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Müşteri</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Tarih & Saat</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>İletişim</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Notlar</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Durum</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center' }}>Yükleniyor...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>Size atanmış randevu bulunmuyor.</td></tr>
            ) : (
              appointments.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{app.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px' }}>{app.date}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.time}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px' }}>{app.phone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px', maxWidth: '200px', fontSize: '14px', color: 'var(--muted)' }}>{app.notes || '-'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      fontSize: '12px', padding: '4px 8px', borderRadius: '4px', 
                      background: app.status === 'confirmed' ? '#dcfce7' : '#fff7ed',
                      color: app.status === 'confirmed' ? '#166534' : '#c2410c'
                    }}>
                      {app.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {app.status !== 'confirmed' && (
                      <button onClick={() => app.id && handleApprove(app.id)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
                        Onayla
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
