"use client"

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth, onAuthStateChanged, db, doc, getDoc, signOut } from '@/lib/firebase'
import Link from 'next/link'

export default function PersonelLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Eğer zaten giriş sayfasındaysak, güvenlik kontrolü yapma
      if (pathname === '/personel/login') {
        setLoading(false)
        return
      }

      if (!user) {
        router.push('/personel/login')
        setLoading(false)
        return
      }
      
      // Sadece çalışanlar girebilir (Firestore'dan kontrol)
      const docRef = doc(db, 'employees', user.uid)
      const docSnap = await getDoc(docRef)
      const isEmployee = docSnap.exists()

      if (!isEmployee) {
        // Çalışan değilse (Patronsa) admin paneline gitmeli
        router.push('/admin')
        return
      }

      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [router, pathname])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Yükleniyor...</div>

  // Giriş sayfasında kenar çubuğu (sidebar) olmadan sadece içeriği göster
  if (pathname === '/personel/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <aside style={{
        width: '260px',
        background: 'white',
        borderRight: '1px solid var(--border)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        top: 0, left: 0,
      }}>
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: 12 }}>
           <div style={{
            width: 32, height: 32,
            background: 'var(--rose)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>👤</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Este Tuzla Personel</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link href="/personel" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
            color: 'var(--rose-deep)', background: 'var(--rose-light)', fontWeight: 500
          }}>
            <span>📅</span> Randevularım
          </Link>
        </nav>

        <button
          onClick={async () => {
            await signOut(auth)
            router.push('/personel/login')
          }}
          style={{
            marginTop: 'auto',
            padding: '12px',
            border: '1px solid var(--border)',
            background: 'white',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>Çıkış Yap</button>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        {children}
      </main>
    </div>
  )
}
