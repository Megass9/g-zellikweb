"use client"

import { useEffect, useState, useCallback } from 'react'
import { db, auth, collection, getDocs, deleteDoc, doc, query, orderBy, setDoc, serverTimestamp } from '@/lib/firebase'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { Employee } from '@/lib/types'

export default function EmployeesAdmin() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'employees'), orderBy('name', 'asc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee))
      setEmployees(data)
    } catch (err) {
      console.error('Fetch employees error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployeeName.trim() || !email.trim() || !password.trim()) return

    // 1. Admin oturumunu bozmadan yeni kullanıcı oluşturmak için geçici Firebase App
    const tempConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };
    
    const tempApp = initializeApp(tempConfig, "tempApp");
    const tempAuth = getAuth(tempApp);

    try {
      // 2. Auth kullanıcısını oluştur
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const user = userCredential.user;

      // 3. Çalışanlar tablosuna ekle (Auth ID ile eşleştirerek)
      await setDoc(doc(db, 'employees', user.uid), {
        name: newEmployeeName,
        email: email, // Opsiyonel: E-posta bilgisini de saklayabiliriz
        created_at: serverTimestamp()
      });

      // 4. Geçici oturumu kapat ve uygulamayı temizle
      await signOut(tempAuth);
      await deleteApp(tempApp);

      setNewEmployeeName('')
      setEmail('')
      setPassword('')
      fetchEmployees()
      alert('Çalışan ve giriş hesabı başarıyla oluşturuldu! Çalışan artık /personel/login adresinden giriş yapabilir.')
    } catch (err: any) {
      alert('Hata oluştu: ' + err.message);
      try { await deleteApp(tempApp); } catch(e) {}
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) return
    
    try {
      await deleteDoc(doc(db, 'employees', id))
      fetchEmployees()
    } catch (err: any) {
      alert('Silme işlemi başarısız: ' + err.message)
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '32px' }}>Çalışan Yönetimi</h1>

      {/* Add New Form */}
      <div className="card" style={{ padding: '24px', marginBottom: '40px', background: '#f8fafc' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Yeni Çalışan Ekle</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              className="input-field" 
              value={newEmployeeName} 
              onChange={e => setNewEmployeeName(e.target.value)} 
              placeholder="Ad Soyad"
              required
              style={{ flex: 1 }}
            />
            <input 
              className="input-field" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="E-posta (Giriş için)"
              required
              style={{ flex: 1 }}
            />
            <input 
              className="input-field" 
              type="password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Şifre"
              required
              style={{ flex: 1 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '46px' }}>Ekle +</button>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {employees.map(employee => (
          <div key={employee.id} className="card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '20px' }}>👤</div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>{employee.name}</h3>
            </div>
            <button 
              onClick={() => handleDelete(employee.id)}
              style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
              title="Sil"
            >
              SİL
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}