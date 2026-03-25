'use client'
import { useState } from 'react'
import { db, collection, addDoc, setDoc, doc, serverTimestamp } from '@/lib/firebase'

const DEMO_SERVICES = [
  { name: 'Saç Kesimi', description: 'Modern ve şık kesimler', price: 250, duration: 60, category: 'Saç' },
  { name: 'Saç Boyama', description: 'Kişiye özel renk tasarımları', price: 450, duration: 120, category: 'Saç' },
  { name: 'Keratin Bakımı', description: 'Saçlarınıza canlılık ve güç', price: 800, duration: 180, category: 'Saç' },
  { name: 'Klasik Manikür', description: 'Tırnak bakımı ve şekillendirme', price: 150, duration: 45, category: 'El & Ayak' },
  { name: 'Jel Manikür', description: 'Uzun süre kalıcı ve şık tırnaklar', price: 220, duration: 60, category: 'El & Ayak' },
  { name: 'Pedikür', description: 'Ayak bakımı ve ferahlama', price: 200, duration: 60, category: 'El & Ayak' },
  { name: 'Yüz Bakımı', description: 'Cildiniz için derinlemesine temizlik', price: 350, duration: 60, category: 'Cilt' },
  { name: 'Kaş Şekillendirme', description: 'Yüz hattınıza uygun kaş tasarımı', price: 120, duration: 30, category: 'Kaş & Kirpik' },
  { name: 'Kirpik Lifting', description: 'Doğal ve etkileyici bakışlar', price: 280, duration: 60, category: 'Kaş & Kirpik' },
  { name: 'Günlük Makyaj', description: 'Doğal güzelliğinizi öne çıkarın', price: 300, duration: 45, category: 'Makyaj' },
  { name: 'Gelin Makyajı', description: 'En özel gününüzde kusursuz görünüm', price: 800, duration: 120, category: 'Makyaj' },
  { name: 'Rahatlatıcı Masaj', description: 'Günün stresinden arının', price: 450, duration: 50, category: 'Masaj' },
]

const DEMO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', caption: 'Saç Boyama', category: 'Saç' },
  { url: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=600&q=80', caption: 'Manikür', category: 'El & Ayak' },
  { url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', caption: 'Yüz Bakımı', category: 'Cilt' },
  { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', caption: 'Makyaj', category: 'Makyaj' },
  { url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80', caption: 'Keratin Bakımı', category: 'Saç' },
  { url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', caption: 'Jel Manikür', category: 'El & Ayak' },
]

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])

  const seedData = async () => {
    setLoading(true)
    setLogs([])
    try {
      addLog('Veri yükleme işlemi başlatıldı...')

      // Seed Services
      addLog('Hizmetler yükleniyor...')
      for (const service of DEMO_SERVICES) {
        await addDoc(collection(db, 'services'), { ...service, created_at: serverTimestamp() })
      }
      addLog(`${DEMO_SERVICES.length} hizmet başarıyla eklendi.`)

      // Seed Gallery
      addLog('Galeri resimleri yükleniyor...')
      for (const image of DEMO_IMAGES) {
        await addDoc(collection(db, 'gallery'), { ...image, created_at: serverTimestamp() })
      }
      addLog(`${DEMO_IMAGES.length} galeri resmi başarıyla eklendi.`)

      addLog('İŞLEM TAMAMLANDI! Artık web sitesinde verileri görebilirsiniz.')
    } catch (err: any) {
      addLog(`HATA: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 24 }}>Firebase Veritabanı Kurulumu</h1>
      <p style={{ marginBottom: 32, color: '#666' }}>
        Bu araç, Firestore veritabanınızı varsayılan hizmetler ve galeri resimleri ile doldurur.
      </p>

      <button 
        onClick={seedData} 
        disabled={loading}
        className="btn-primary"
        style={{ padding: '12px 32px' }}
      >
        {loading ? 'Yükleniyor...' : 'Varsayılan Verileri Yükle'}
      </button>

      <div style={{ 
        marginTop: 40, 
        padding: 24, 
        background: '#f1f5f9', 
        borderRadius: 12,
        minHeight: 200,
        fontFamily: 'monospace',
        fontSize: 14,
        lineHeight: 1.6
      }}>
        {logs.length === 0 && <span style={{ color: '#94a3b8' }}>İşlem günlükleri burada görünecek...</span>}
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  )
}
