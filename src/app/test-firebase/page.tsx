'use client'
import { useEffect, useState } from 'react'
import { app, auth, db } from '@/lib/firebase'

export default function TestFirebasePage() {
  const [status, setStatus] = useState('Yükleniyor...')

  useEffect(() => {
    try {
      if (app) {
        setStatus(`Firebase Başarıyla Bağlandı! Proje ID: ${app.options.projectId}`)
        console.log('Firebase App:', app)
        console.log('Firebase Auth:', auth)
        console.log('Firebase DB:', db)
      }
    } catch (error) {
      setStatus(`Hata: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Firebase Bağlantı Testi</h1>
      <p style={{ 
        padding: '20px', 
        background: status.includes('Hata') ? '#fee2e2' : '#f0fdf4',
        color: status.includes('Hata') ? '#991b1b' : '#166534',
        borderRadius: '8px',
        border: '1px solid currentColor'
      }}>
        {status}
      </p>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Detaylar için tarayıcı konsoluna (F12) bakabilirsiniz.
      </div>
      <a href="/" style={{ display: 'inline-block', marginTop: '20px', color: 'var(--rose-deep)' }}> Ana Sayfaya Dön</a>
    </div>
  )
}
