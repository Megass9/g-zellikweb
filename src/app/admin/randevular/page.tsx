"use client"

import { useEffect, useState } from 'react'
import { db, collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from '@/lib/firebase'
import type { Appointment, Employee } from '@/lib/types'

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Fetch appointments
      const q = query(collection(db, 'appointments'), orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      const appointmentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment))

      // Fetch employees to map names (client-side join replacement)
      const employeeSnapshot = await getDocs(collection(db, 'employees'))
      const employeesMap: Record<string, string> = {}
      employeeSnapshot.forEach(doc => {
        employeesMap[doc.id] = (doc.data() as Employee).name
      })

      // Map employee names to appointments
      const enrichedAppointments = appointmentData.map(app => ({
        ...app,
        employees: app.employee_id && employeesMap[app.employee_id] 
          ? { name: employeesMap[app.employee_id] } 
          : null
      }))

      setAppointments(enrichedAppointments)
    } catch (err) {
      console.error('Randevu çekme hatası:', err);
      alert('Randevular yüklenirken bir hata oluştu.');
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
      alert('Onaylama başarısız: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return
    
    try {
      await deleteDoc(doc(db, 'appointments', id))
      fetchAppointments()
    } catch (err: any) {
      alert('Silme işlemi başarısız oldu: ' + err.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Randevular</h1>
        <button onClick={fetchAppointments} className="btn-outline" style={{ fontSize: '14px', padding: '8px 16px' }}>Yenile ↻</button>
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Müşteri</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Çalışan</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Tarih & Saat</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>İletişim</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Notlar</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Durum</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>Yükleniyor...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>Gösterilecek randevu bulunamadı.</td></tr>
            ) : (
              appointments.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 500 }}>{app.name}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                    {app.employees?.name || <span style={{color: 'var(--muted)'}}>Atanmamış</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px' }}>{app.date}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.time}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px' }}>{app.phone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px', maxWidth: '200px', fontSize: '14px', color: 'var(--muted)' }}>
                    {app.notes || '-'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: app.status === 'confirmed' ? '#dcfce7' : '#fff7ed',
                      color: app.status === 'confirmed' ? '#166534' : '#c2410c'
                    }}>
                      {app.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {app.status !== 'confirmed' && (
                      <button onClick={() => app.id && handleApprove(app.id)} style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
                        Onayla
                      </button>
                    )}
                    <button 
                      onClick={() => app.id && handleDelete(app.id)}
                      style={{ 
                        background: '#fee2e2', 
                        color: '#dc2626', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>Sil</button>
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