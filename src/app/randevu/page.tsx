'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { db, collection, getDocs, addDoc, query, where, orderBy, serverTimestamp } from '@/lib/firebase'
import type { Employee, Service, Appointment } from '@/lib/types'

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

const DEMO_SERVICES: Service[] = [
  { id: '1', name: 'Saç Kesimi', description: '', price: 250, duration: 60, category: 'Saç' },
  { id: '2', name: 'Saç Boyama', description: '', price: 450, duration: 120, category: 'Saç' },
  { id: '3', name: 'Keratin Bakımı', description: '', price: 800, duration: 180, category: 'Saç' },
  { id: '4', name: 'Klasik Manikür', description: '', price: 150, duration: 45, category: 'El & Ayak' },
  { id: '5', name: 'Jel Manikür', description: '', price: 220, duration: 60, category: 'El & Ayak' },
  { id: '6', name: 'Pedikür', description: '', price: 200, duration: 60, category: 'El & Ayak' },
  { id: '7', name: 'Yüz Bakımı', description: '', price: 350, duration: 60, category: 'Cilt' },
  { id: '8', name: 'Kaş Şekillendirme', description: '', price: 120, duration: 30, category: 'Kaş & Kirpik' },
  { id: '9', name: 'Kirpik Lifting', description: '', price: 280, duration: 60, category: 'Kaş & Kirpik' },
  { id: '10', name: 'Günlük Makyaj', description: '', price: 300, duration: 45, category: 'Makyaj' },
  { id: '11', name: 'Gelin Makyajı', description: '', price: 800, duration: 120, category: 'Makyaj' },
  { id: '12', name: 'Rahatlatıcı Masaj', description: '', price: 450, duration: 50, category: 'Masaj' },
]

function getDays(startOffset: number, count: number) {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(today.getDate() + startOffset + i);
    
    let label = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    let dayOfWeek = date.toLocaleDateString('tr-TR', { weekday: 'long' });

    const diff = startOffset + i;
    if (diff === 0) {
      label = 'Bugün';
    }
    if (diff === 1) {
      label = 'Yarın';
    }

    days.push({
      label,
      dayOfWeek,
      value: date.toISOString().split('T')[0]
    });
  }
  return days;
}

function AppointmentForm() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service') || ''

  const [services, setServices] = useState<Service[]>(DEMO_SERVICES)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [step, setStep] = useState(1) // 1: Service, 2: Employee, 3: Date/Time, 4: Info, 5: Confirm
  const [dateOffset, setDateOffset] = useState(0)
  const [form, setForm] = useState<Appointment>({
    name: '',
    phone: '',
    email: '',
    service_id: preselectedService,
    employee_id: '',
    date: '',
    time: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), orderBy('name'))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service))
        if (data.length > 0) setServices(data)
      } catch (err) {
        console.error('Fetch services error:', err)
      }
    }
    const fetchEmployees = async () => {
      try {
        const q = query(collection(db, 'employees'), orderBy('name'))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee))
        if (data.length > 0) setEmployees(data)
      } catch (err) {
        console.error('Fetch employees error:', err)
      }
    }
    fetchServices()
    fetchEmployees()
  }, [])

  // Fetch booked times when date or employee changes
  useEffect(() => {
    if (!form.date || !form.employee_id) return;

    const fetchBookedTimes = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('date', '==', form.date),
          where('employee_id', '==', form.employee_id)
        )
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => doc.data() as Appointment)
        setBookedTimes(data.map(d => d.time))
      } catch (err) {
        console.error('Fetch booked times error:', err)
      }
    }

    fetchBookedTimes();
  }, [form.date, form.employee_id])

  const selectedService = services.find(s => s.id === form.service_id)
  const selectedEmployee = employees.find(e => e.id === form.employee_id)

  const availableDays = getDays(dateOffset, 4);

  const handleChange = (field: keyof Appointment, value: string) => {
    setForm(prev => ({ ...prev, [field]: value, ...(field === 'date' && { time: '' }) })) // Reset time when date changes
    setError('')
  }

  const canProceedStep1 = form.service_id !== ''
  const canProceedStep2 = form.employee_id !== ''
  const canProceedStep3 = form.date !== '' && form.time !== ''
  const canProceedStep4 = form.name.trim() !== '' && form.phone.trim() !== '' && form.email.trim() !== ''

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      await addDoc(collection(db, 'appointments'), {
        ...form,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      setSuccess(true)
    } catch (err: any) {
      setError('Randevu kaydedilemedi: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 24px',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        <div style={{
          width: 80, height: 80,
          background: 'var(--rose-light)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          margin: '0 auto 24px',
        }}>✓</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>
          Randevunuz Alındı!
        </h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>
          <strong>{form.date}</strong> tarihinde saat <strong>{form.time}</strong>'de sizi bekliyoruz.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
          Onay mesajı <strong>{form.phone}</strong> numaralı telefonunuza gönderilecektir.
        </p>
        <button
          onClick={() => { setSuccess(false); setStep(1); setForm({ name: '', phone: '', email: '', service_id: '', employee_id: '', date: '', time: '', notes: '' }) }}
          className="btn-outline"
        >Yeni Randevu Al</button>
      </div>
    )
  }

  const steps = ['Hizmet', 'Çalışan', 'Tarih & Saat', 'Bilgiler', 'Onay']

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: '50%',
                background: i + 1 <= step ? 'var(--rose-deep)' : 'var(--border)',
                color: i + 1 <= step ? 'white' : 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600,
                transition: 'all 0.3s',
              }}>{i + 1 < step ? '✓' : i + 1}</div>
              <span style={{ fontSize: 11, color: i + 1 <= step ? 'var(--rose-deep)' : 'var(--muted)', fontWeight: i + 1 === step ? 600 : 400 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 60, height: 2,
                background: i + 1 < step ? 'var(--rose-deep)' : 'var(--border)',
                marginBottom: 22, marginLeft: 4, marginRight: 4,
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>Hizmet Seçin</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Almak istediğiniz hizmeti seçin</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {services.map(s => (
              <div
                key={s.id}
                onClick={() => handleChange('service_id', s.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: `2px solid ${form.service_id === s.id ? 'var(--rose-deep)' : 'var(--border)'}`,
                  background: form.service_id === s.id ? 'var(--rose-pale)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.category} · {s.duration} dk</div>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--rose-deep)', fontSize: '1.1rem', marginTop: 6 }}>{s.price.toLocaleString('tr-TR')} ₺</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: 32 }}>
            <button className="btn-primary" disabled={!canProceedStep1} onClick={() => setStep(2)} // Go to step 2
              style={{ opacity: canProceedStep1 ? 1 : 0.4, cursor: canProceedStep1 ? 'pointer' : 'not-allowed' }}>
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Employee */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>Çalışan Seçin</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Hizmeti kimden almak istersiniz?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {employees.map(e => (
              <div
                key={e.id}
                onClick={() => handleChange('employee_id', e.id)}
                style={{
                  padding: '24px 20px',
                  borderRadius: 12,
                  border: `2px solid ${form.employee_id === e.id ? 'var(--rose-deep)' : 'var(--border)'}`,
                  background: form.employee_id === e.id ? 'var(--rose-pale)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: 8 }}>👤</div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{e.name}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button className="btn-outline" onClick={() => setStep(1)}>← Geri</button>
            <button className="btn-primary" disabled={!canProceedStep2} onClick={() => setStep(3)} // Go to step 3
              style={{ opacity: canProceedStep2 ? 1 : 0.4, cursor: canProceedStep2 ? 'pointer' : 'not-allowed' }}>
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>Tarih & Saat</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Size uygun tarih ve saati seçin</p>
          
          <div className="form-group">
            <label>Tarih</label>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
              {dateOffset > 0 && (
                <button
                  onClick={() => setDateOffset(prev => Math.max(0, prev - 4))}
                  style={{
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'white',
                    cursor: 'pointer',
                    color: 'var(--charcoal)',
                    fontSize: 18,
                  }}
                  title="Önceki günler"
                >‹</button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10, flex: 1 }}>
                {availableDays.map(day => (
                <button 
                  key={day.value} 
                  onClick={() => handleChange('date', day.value)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 8,
                    border: `1.5px solid ${form.date === day.value ? 'var(--rose-deep)' : 'var(--border)'}`,
                    background: form.date === day.value ? 'var(--rose-deep)' : 'white',
                    color: form.date === day.value ? 'white' : 'var(--charcoal)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 60,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{day.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{day.dayOfWeek}</div>
                </button>
              ))}
              </div>

              <button
                onClick={() => setDateOffset(prev => prev + 4)}
                style={{
                  padding: '0 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'white',
                  cursor: 'pointer',
                  color: 'var(--charcoal)',
                  fontSize: 18,
                }}
                title="Sonraki 4 gün"
              >›</button>
            </div>
          </div>

          {form.date && (
            <div style={{marginTop: '32px'}}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Saat</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
                {TIMES.map(t => (
                  <button key={t} onClick={() => handleChange('time', t)} style={{
                    padding: '10px',
                    borderRadius: 8,
                    border: `1.5px solid ${form.time === t ? 'var(--rose-deep)' : 'var(--border)'}`,
                    background: form.time === t ? 'var(--rose-deep)' : 'white',
                    color: form.time === t ? 'white' : 'var(--charcoal)',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s',
                  }}>{t}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button className="btn-outline" onClick={() => setStep(2)}>← Geri</button>
            <button className="btn-primary" disabled={!canProceedStep3} onClick={() => setStep(4)}
              style={{ opacity: canProceedStep3 ? 1 : 0.4, cursor: canProceedStep3 ? 'pointer' : 'not-allowed' }}>
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Personal Info */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>Bilgileriniz</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Sizi tanıyalım</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Ad Soyad *</label>
              <input type="text" placeholder="Ayşe Yılmaz" value={form.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefon *</label>
              <input type="tel" placeholder="0555 000 00 00" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>E-posta *</label>
              <input type="email" placeholder="ayse@mail.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Notlar (isteğe bağlı)</label>
              <textarea rows={3} placeholder="Eklemek istediğiniz bir şey var mı?" value={form.notes} onChange={e => handleChange('notes', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <button className="btn-outline" onClick={() => setStep(3)}>← Geri</button>
            <button className="btn-primary" disabled={!canProceedStep4} onClick={() => setStep(5)}
              style={{ opacity: canProceedStep4 ? 1 : 0.4, cursor: canProceedStep4 ? 'pointer' : 'not-allowed' }}>
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>Randevuyu Onayla</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Bilgilerinizi kontrol edin</p>
          <div style={{ background: 'var(--blush)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
            {[
              { label: 'Hizmet', value: selectedService?.name },
              { label: 'Çalışan', value: selectedEmployee?.name },
              { label: 'Fiyat', value: selectedService ? `${selectedService.price.toLocaleString('tr-TR')} ₺` : '' },
              { label: 'Süre', value: selectedService ? `${selectedService.duration} dakika` : '' },
              { label: 'Tarih', value: form.date },
              { label: 'Saat', value: form.time },
              { label: 'Ad Soyad', value: form.name },
              { label: 'Telefon', value: form.phone },
              { label: 'E-posta', value: form.email },
              ...(form.notes ? [{ label: 'Notlar', value: form.notes }] : []),
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                <span style={{ fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-outline" onClick={() => setStep(3)}>← Geri</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}
              style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer', minWidth: 160 }}>
              {submitting ? 'Kaydediliyor…' : 'Randevuyu Onayla ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AppointmentPage() {
  return (
    <>
      <section style={{
        paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24,
        background: 'linear-gradient(135deg, var(--blush), var(--cream))',
        textAlign: 'center',
      }}>
        <div className="animate-fade-up">
          <div className="section-tag">✦ Online Randevu</div>
          <h1 className="section-title">Randevu Al</h1>
          <div className="divider" style={{ margin: '16px auto' }} />
        </div>
      </section>
      <section style={{ padding: '64px 24px 80px', background: 'white' }}>
        <div className="container">
          <Suspense fallback={<div>Yükleniyor…</div>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
