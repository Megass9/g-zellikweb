"use client"

import Link from 'next/link'

export default function HomePage() {
  const features = [
    { icon: '✦', title: 'Uzman Kadro', desc: '10+ yıl deneyimli güzellik uzmanlarımız her zaman yanınızda.' },
    { icon: '◈', title: 'Premium Ürünler', desc: 'Sadece en kaliteli, sertifikalı ürünleri kullanıyoruz.' },
    { icon: '◎', title: 'Huzurlu Ortam', desc: 'Kendinizi tamamen bırakabileceğiniz sakin bir atmosfer.' },
    { icon: '◇', title: 'Kişisel Bakım', desc: 'Her müşterimize özel bakım ve ilgi gösteriyoruz.' },
  ]

  const services = [
    { title: 'Saç Bakımı', desc: 'Kesim, boyama, keratin ve daha fazlası', icon: '✂️', color: '#fce8ef' },
    { title: 'Cilt Bakımı', desc: 'Profesyonel yüz ve vücut bakımı', icon: '✨', color: '#f0eaff' },
    { title: 'Manikür & Pedikür', desc: 'Klasik ve jel uygulamaları', icon: '💅', color: '#e8f4ff' },
    { title: 'Kaş & Kirpik', desc: 'Şekillendirme, lifting, laminasyon', icon: '👁️', color: '#fff3e8' },
    { title: 'Makyaj', desc: 'Günlük, özel gün ve gelin makyajı', icon: '💄', color: '#fce8ef' },
    { title: 'Masaj', desc: 'Rahatlatıcı ve terapötik masajlar', icon: '🌿', color: '#e8fff0' },
  ]

  const testimonials = [
    { name: 'Ayşe K.', text: 'Harika bir deneyimdi! Ekip çok ilgili ve profesyoneldi. Kesinlikle tekrar geleceğim.', rating: 5 },
    { name: 'Fatma D.', text: 'Saç boyama ve bakımdan çok memnun kaldım. Sonuç tam hayal ettiğim gibi oldu.', rating: 5 },
    { name: 'Zeynep M.', text: 'Cilt bakımı sonrası cildimdeki fark inanılmazdı. Uzmanlar gerçekten biliyor işini.', rating: 5 },
  ]

  return (
    <>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--blush) 0%, var(--cream) 50%, var(--rose-pale) 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '72px',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(244,167,185,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '2%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(224,122,150,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}>
            {/* Left */}
            <div className="animate-fade-up">
              <div className="section-tag">✦ Este Tuzla | Güzellik & Bakım</div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                lineHeight: 1.1,
                color: 'var(--charcoal)',
                marginBottom: '24px',
                fontWeight: 300,
              }}>
                Güzelliğinizi<br />
                <em style={{ color: 'var(--rose-deep)', fontStyle: 'italic' }}>Keşfedin</em>
              </h1>
              <p style={{
                fontSize: '16px',
                color: 'var(--muted)',
                maxWidth: '420px',
                lineHeight: 1.8,
                marginBottom: '36px',
              }}>
                Profesyonel ekibimiz ve premium ürünlerimizle kendinizi en güzel, en özel hissedeceğiniz bir deneyim yaşatıyoruz.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/randevu" className="btn-primary">
                  Hemen Randevu Al →
                </Link>
                <Link href="/hizmetler" className="btn-outline">
                  Hizmetleri Gör
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex', gap: '40px', marginTop: '48px',
                paddingTop: '36px', borderTop: '1px solid var(--border)',
              }}>
                {[
                  { num: '2000+', label: 'Mutlu Müşteri' },
                  { num: '8+', label: 'Yıl Deneyim' },
                  { num: '15+', label: 'Uzman Kadro' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 400,
                      color: 'var(--rose-deep)',
                    }}>{s.num}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="animate-fade-up delay-3" style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '4/5',
                borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
                background: 'linear-gradient(145deg, var(--rose-light), var(--rose))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                position: 'relative',
                animation: 'float 7s ease-in-out infinite',
              }}>
                <span style={{ filter: 'drop-shadow(0 8px 24px rgba(224,122,150,0.4))' }}>💆‍♀️</span>

                {/* Floating badges */}
                <div style={{
                  position: 'absolute', top: '10%', right: '-8%',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  animation: 'float 5s ease-in-out infinite',
                }}>
                  <span style={{ fontSize: '20px' }}>⭐</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>4.9 / 5.0</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Müşteri Puanı</div>
                  </div>
                </div>

                <div style={{
                  position: 'absolute', bottom: '15%', left: '-10%',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  animation: 'float 6s ease-in-out infinite reverse',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--rose-deep)' }}>Bugün 8 Randevu</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Hâlâ boş slot var!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-tag">Neden Bizi Seçmelisiniz?</div>
            <h2 className="section-title">Fark Yaratan Detaylar</h2>
            <div className="divider" style={{ margin: '16px auto 0' }} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {features.map((f, i) => (
              <div key={f.title} className={`card animate-fade-up delay-${i + 1}`} style={{ padding: '32px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: 'var(--rose-light)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', color: 'var(--rose-deep)',
                  marginBottom: '20px',
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section style={{ padding: '80px 24px', background: 'var(--blush)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-tag">Neler Sunuyoruz</div>
              <h2 className="section-title">Hizmetlerimiz</h2>
            </div>
            <Link href="/hizmetler" className="btn-outline">Tümünü Gör →</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {services.map((s) => (
              <Link href="/hizmetler" key={s.title}>
                <div style={{
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  padding: '28px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = 'var(--shadow-soft)'
                  el.style.background = s.color
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                  el.style.background = 'white'
                }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '14px' }}>{s.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-tag">Müşteri Yorumları</div>
            <h2 className="section-title">Ne Diyorlar?</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {testimonials.map((t) => (
              <div key={t.name} className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--rose-deep)', fontSize: '14px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
                  &quot;{t.text}&quot;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: 'var(--rose-light)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    color: 'var(--rose-deep)',
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Müşterimiz</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, var(--rose-deep), #c96a84)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'white',
            marginBottom: '16px',
          }}>
            Kendinizi Şımartmaya Hazır mısınız?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '36px' }}>
            Hemen randevu alın, size özel bir deneyim yaşayın.
          </p>
          <Link href="/randevu" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            color: 'var(--rose-deep)',
            padding: '16px 40px',
            borderRadius: '50px',
            fontWeight: 500,
            fontSize: '15px',
            transition: 'all 0.3s',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            Randevu Al →
          </Link>
        </div>
      </section>
    </>
  )
}
