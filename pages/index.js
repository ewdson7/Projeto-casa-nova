import { useState } from 'react'
import Head from 'next/head'

const gifts = [
  { id: 1, emoji: '🫖', name: 'Jogo de Chá' },
  { id: 2, emoji: '🛁', name: 'Jogo de Toalhas' },
  { id: 3, emoji: '🍽️', name: 'Jogo de Pratos' },
  { id: 4, emoji: '🛏️', name: 'Jogo de Cama' },
  { id: 5, emoji: '☕', name: 'Cafeteira' },
  { id: 6, emoji: '🍰', name: 'Forma de Fazer Bolo' },
  { id: 7, emoji: '🫗', name: 'Jarra' },
  { id: 8, emoji: '🍳', name: 'Jogo de Panela' },
  { id: 9, emoji: '🌪️', name: 'Liquidificador' },
  { id: 10, emoji: '🍲', name: 'Pirex' },
  { id: 11, emoji: '🪟', name: 'Cortina' },
  { id: 12, emoji: '🎁', name: 'Outro' },
]

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    attend: '',
    guestCount: '1',
    giftChoice: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Por favor, informe seu nome 💛')
    if (!form.attend) return setError('Nos diga se você vai comparecer 🌸')

    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const firstName = form.name.split(' ')[0]

  return (
    <>
      <Head>
        <title>Chá de Casa Nova 🏡</title>
        <meta name="description" content="Você está convidado para o nosso chá de casa nova!" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏡</text></svg>" />
      </Head>

      <style>{`
        .page-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 90% 10%, rgba(232,196,176,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 5% 90%, rgba(195,212,197,0.2) 0%, transparent 55%);
        }
        .wrap { max-width: 720px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }

        /* HEADER */
        header { text-align: center; padding: 72px 0 52px; }
        .floral { display: flex; justify-content: center; gap: 12px; margin-bottom: 28px; }
        .petal { font-size: 22px; display: inline-block; animation: sway 4s ease-in-out infinite; }
        .petal:nth-child(2) { animation-delay: .6s; }
        .petal:nth-child(3) { animation-delay: 1.2s; }
        .petal:nth-child(4) { animation-delay: 1.8s; }
        .petal:nth-child(5) { animation-delay: 2.4s; }
        @keyframes sway {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-5px) rotate(4deg); }
        }
        .eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 4px;
          text-transform: uppercase; color: var(--rose); margin-bottom: 14px;
        }
        h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(50px, 10vw, 78px);
          font-weight: 300; line-height: 1.05;
          color: var(--dark); letter-spacing: -1px;
        }
        h1 em { font-style: italic; color: var(--rose); }
        .subtitle {
          margin-top: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 19px;
          color: var(--taupe); font-weight: 300;
        }
        .divider {
          display: flex; align-items: center;
          gap: 16px; max-width: 300px;
          margin: 36px auto;
        }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--blush), transparent); }
        .divider-dot { color: var(--rose); font-size: 16px; }

        /* INFO CARDS */
        .info-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 14px; margin-bottom: 60px;
        }
        @media(max-width:520px) { .info-grid { grid-template-columns: 1fr; } }
        .info-card {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(232,196,176,0.4);
          border-radius: 20px; padding: 26px 16px;
          text-align: center; backdrop-filter: blur(8px);
          transition: transform .3s, box-shadow .3s;
        }
        .info-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(160,90,69,.1); }
        .info-icon { font-size: 26px; margin-bottom: 10px; }
        .info-label {
          font-size: 10px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--rose); margin-bottom: 5px;
        }
        .info-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; color: var(--dark); line-height: 1.3;
        }

        /* SECTION */
        .sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 300;
          color: var(--dark); text-align: center; margin-bottom: 6px;
        }
        .sec-title em { font-style: italic; color: var(--rose); }
        .sec-note {
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 16px;
          color: var(--text-light); margin-bottom: 36px;
        }

        /* FORM */
        .form-section { margin-bottom: 72px; }
        .form-card {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(232,196,176,0.4);
          border-radius: 28px; padding: 44px 40px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 60px rgba(160,90,69,.07);
        }
        @media(max-width:520px) { .form-card { padding: 28px 20px; } }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:480px) { .form-row { grid-template-columns: 1fr; } }
        .form-group { margin-bottom: 18px; }
        label {
          display: block; font-size: 11px; font-weight: 500;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--rose); margin-bottom: 7px;
        }
        input, select, textarea {
          width: 100%; padding: 13px 17px;
          border: 1px solid rgba(181,169,154,.4);
          border-radius: 12px;
          background: rgba(255,255,255,.85);
          font-family: 'Jost', sans-serif;
          font-size: 14px; color: var(--dark);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          -webkit-appearance: none; appearance: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--blush);
          box-shadow: 0 0 0 3px rgba(232,196,176,.22);
        }
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9856A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          padding-right: 38px; cursor: pointer;
        }
        textarea { resize: none; }

        /* GIFT OPTIONAL AREA */
        .gift-area {
          border: 1px dashed rgba(181,169,154,.5);
          border-radius: 14px; padding: 18px; margin-bottom: 22px;
        }
        .gift-area-title {
          font-size: 11px; font-weight: 500;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--rose); margin-bottom: 3px;
        }
        .gift-area-note {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 15px;
          color: var(--text-light); margin-bottom: 13px;
        }
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          padding: 6px 13px; border-radius: 20px;
          border: 1px solid rgba(181,169,154,.4);
          background: rgba(255,255,255,.7);
          font-size: 12px; color: var(--text);
          cursor: pointer; transition: all .2s;
          font-family: 'Jost', sans-serif;
          user-select: none;
        }
        .chip:hover { border-color: var(--rose); color: var(--rose); }
        .chip.active { background: var(--rose); border-color: var(--rose); color: #fff; }

        /* ERROR */
        .error-msg {
          background: rgba(201,133,106,.1); border: 1px solid rgba(201,133,106,.3);
          border-radius: 10px; padding: 12px 16px;
          font-size: 14px; color: var(--deep-rose);
          margin-bottom: 18px; text-align: center;
        }

        /* SUBMIT */
        .btn-submit {
          width: 100%; padding: 17px;
          background: linear-gradient(135deg, var(--rose), var(--deep-rose));
          color: #fff; border: none; border-radius: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          cursor: pointer; transition: all .3s;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(160,90,69,.3);
        }
        .btn-submit:disabled { opacity: .65; cursor: not-allowed; }

        /* SUCCESS */
        .success-box {
          text-align: center; padding: 56px 32px;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(232,196,176,.4);
          border-radius: 28px;
          backdrop-filter: blur(12px);
        }
        .success-icon { font-size: 56px; margin-bottom: 18px; }
        .success-box h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 300;
          color: var(--dark); margin-bottom: 12px;
        }
        .success-box p {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 18px;
          color: var(--text-light); line-height: 1.6;
        }

        /* FOOTER */
        footer {
          text-align: center; padding: 40px 24px 56px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 16px; color: var(--taupe);
        }
        footer span { color: var(--rose); }

        /* ANIM */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp .8s ease forwards; }
        .fade-up-2 { animation: fadeUp .8s ease forwards .15s; opacity: 0; }
        .fade-up-3 { animation: fadeUp .8s ease forwards .3s; opacity: 0; }
      `}</style>

      <div className="page-bg" />

      <div className="wrap">
        <header className="fade-up">
          <div className="floral">
            <span className="petal">🌸</span>
            <span className="petal">🌿</span>
            <span className="petal">🌼</span>
            <span className="petal">🌿</span>
            <span className="petal">🌸</span>
          </div>
          <p className="eyebrow">Você está convidado</p>
          <h1>Chá de<br /><em>Casa Nova</em></h1>
          <p className="subtitle">Um novo lar, novas memórias, muito amor</p>
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-dot">✦</span>
            <div className="divider-line" />
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📅</div>
              <div className="info-label">Data</div>
              <div className="info-value">Sábado<br />18 de Abril</div>
            </div>
            <div className="info-card">
              <div className="info-icon">🕑</div>
              <div className="info-label">Horário</div>
              <div className="info-value">às 17h</div>
            </div>
           <a 
  href="https://maps.app.goo.gl/62oAx2DXYkgZBDQP7" 
  target="_blank" 
  rel="noopener noreferrer"
  style={{ textDecoration: 'none', color: 'inherit' }}
>
  <div className="info-card">
    <div className="info-icon">📍</div>
    <div className="info-label">Local</div>
    <div className="info-value">R. do Campo da feira<br />N°55</div>
  </div>
</a>
          </div>
        </header>

        <section className="form-section fade-up-2">
          <h2 className="sec-title"><em>Confirme</em> sua Presença</h2>
          <p className="sec-note">Nos avise para podermos nos preparar com todo o carinho ✨</p>

          <div className="form-card">
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">
                  {form.attend === 'sim' ? '🎉' : form.attend === 'talvez' ? '🌸' : '💛'}
                </div>
                <h2>
                  {form.attend === 'sim' ? 'Que alegria!' : form.attend === 'talvez' ? 'Anotado!' : 'Obrigado!'}
                </h2>
                <p>
                  {form.attend === 'sim'
                    ? `Mal podemos esperar para te receber, ${firstName}! Nossa casa já fica mais bonita com a sua presença.`
                    : form.attend === 'talvez'
                    ? `Entendemos, ${firstName}! Esperamos te ver por lá. 🌿`
                    : `Sentiremos sua falta, ${firstName}! Mas agradecemos muito por nos avisar. 💛`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Seu nome</label>
                  <input
                    type="text"
                    placeholder="Como posso te chamar?"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Você virá?</label>
                    <select value={form.attend} onChange={e => set('attend', e.target.value)}>
                      <option value="">Selecione...</option>
                      <option value="sim">✅ Sim, com certeza!</option>
                      <option value="talvez">🤔 Talvez</option>
                      <option value="nao">❌ Não poderei ir</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantas pessoas?</label>
                    <select value={form.guestCount} onChange={e => set('guestCount', e.target.value)}>
                      <option value="1">Só eu</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                      <option value="5+">5 ou mais</option>
                    </select>
                  </div>
                </div>

                <div className="gift-area">
                  <div className="gift-area-title">Pensou em trazer algum presente?</div>
                  <div className="gift-area-note">Completamente opcional — marque apenas se quiser 😊</div>
                  <div className="chips">
                    {gifts.map(g => (
                      <span
                        key={g.id}
                        className={`chip ${form.giftChoice === g.name ? 'active' : ''}`}
                        onClick={() => set('giftChoice', form.giftChoice === g.name ? '' : g.name)}
                      >
                        {g.emoji} {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Mensagem carinhosa (opcional)</label>
                  <textarea
                    rows={3}
                    placeholder="Escreva algo para os anfitriões..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                  />
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button className="btn-submit" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar Presença ✨'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      <footer className="fade-up-3">
        Feito com muito amor para celebrar o nosso novo lar 🏡 <span>♥</span>
      </footer>
    </>
  )
}
