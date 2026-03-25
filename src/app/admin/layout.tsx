"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth, onAuthStateChanged, db, doc, getDoc, signOut } from '@/lib/firebase'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login')
        setLoading(false)
        return
      }

      if (user) {
        // Kullanıcı çalışan mı kontrol et (Firestore'dan)
        const docRef = doc(db, 'employees', user.uid)
        const docSnap = await getDoc(docRef)
        const isEmployee = docSnap.exists()

        if (isEmployee) {
          console.log("Çalışan olarak algılandı, /personel adresine yönlendiriliyor.");
          router.push('/personel')
          return
        }
      }
      
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [router, pathname])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Yükleniyor...</div>

  // Login sayfasında layout gösterme
  if (pathname === '/admin/login') return <>{children}</>

  const menuItems = [
    { href: '/admin', label: 'Genel Bakış', icon: '📊' },
    { href: '/admin/randevular', label: 'Randevular', icon: '📅' },
    { href: '/admin/hizmetler', label: 'Hizmetler', icon: '✨' },
    { href: '/admin/calisanlar', label: 'Çalışanlar', icon: '👥' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
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
          }}>✦</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Este Tuzla Admin</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--rose-deep)' : 'var(--charcoal)',
                background: isActive ? 'var(--rose-light)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.2s',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={async () => {
            await signOut(auth)
            router.push('/admin/login')
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

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        {children}
      </main>
    </div>
  )
}