"use client"

import { useEffect, useState, useCallback } from 'react'
import { db, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from '@/lib/firebase'
import type { Service } from '@/lib/types'

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [newService, setNewService] = useState({ name: '', price: '', category: 'Saç', duration: '60' })

  const fetchServices = useCallback(async () => {
    try {
      const q = query(collection(db, 'services'), orderBy('created_at', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service))
      setServices(data)
    } catch (err) {
      console.error('Fetch services error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'services'), {
        name: newService.name,
        price: parseInt(newService.price),
        duration: parseInt(newService.duration),
        category: newService.category,
        description: 'Yeni eklenen hizmet',
        created_at: serverTimestamp()
      })
      
      setNewService({ name: '', price: '', category: 'Saç', duration: '60' })
      setLoading(true)
      fetchServices()
    } catch (err: any) {
      alert('Hata oluştu: ' + err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return
    
    try {
      await deleteDoc(doc(db, 'services', id))
      setLoading(true)
      fetchServices()
    } catch (err: any) {
      console.error('Silme hatası:', err)
      alert('Silme işlemi başarısız: ' + err.message)
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '32px' }}>Hizmet Yönetimi</h1>

      {/* Add New Form */}
      <div className="card" style={{ padding: '24px', marginBottom: '40px', background: '#f8fafc' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Yeni Hizmet Ekle</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Hizmet Adı</label>
            <input 
              className="input-field" 
              value={newService.name} 
              onChange={e => setNewService({...newService, name: e.target.value})} 
              placeholder="Örn: Gelin Makyajı"
              required
            />
          </div>
          <div style={{ width: '120px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Fiyat (₺)</label>
            <input 
              type="number"
              className="input-field" 
              value={newService.price} 
              onChange={e => setNewService({...newService, price: e.target.value})} 
              required
            />
          </div>
          <div style={{ width: '150px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Kategori</label>
            <select 
              className="input-field"
              value={newService.category}
              onChange={e => setNewService({...newService, category: e.target.value})}
            >
              {['Saç', 'Cilt', 'Makyaj', 'Masaj', 'El & Ayak', 'Kaş & Kirpik'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ height: '46px' }}>Ekle +</button>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {services.map(service => (
          <div key={service.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--rose-deep)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                {service.category}
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: 4 }}>{service.name}</h3>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                {service.price} ₺ • {service.duration} dk
              </div>
            </div>
            <button 
              onClick={() => handleDelete(service.id)}
              style={{
                width: 32, height: 32,
                borderRadius: '8px',
                border: '1px solid #fee2e2',
                background: '#fff5f5',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Sil"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
