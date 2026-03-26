import Head from 'next/head'

export async function getServerSideProps() {
  const { Redis } = await import('@upstash/redis')

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  let guests = []
  try {
    const raw = await redis.lrange('cha-casa-nova:guests', 0, -1)
    guests = raw.map(item => typeof item === 'string' ? JSON.parse(item) : item)
  } catch (_) {}

  return { props: { guests } }
}

const attendLabel = { sim: 'Confirmado ✅', nao: 'Não virá ❌', talvez: 'Talvez 🤔' }
const attendColor = { sim: '#8A9E8C', nao: '#B5A99A', talvez: '#C9856A' }
const attendBg   = { sim: 'rgba(138,158,140,.15)', nao: 'rgba(181,169,154,.15)', talvez: 'rgba(232,196,176,.25)' }

export default function ListaConvidados({ guests }) {
  const total = guests.length
  const confirmados = guests.filter(g => g.attend === 'sim')
  const totalPessoas = confirmados.reduce((acc, g) => {
    const n = g.guestCount === '5+' ? 5 : Number(g.guestCount) || 1
    return acc + n
  }, 0)
  const comPresente = guests.filter(g => g.giftChoice).length

  return (
    <>
      <Head>
        <title>Lista de Convidados — Chá de Casa Nova</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏡</text></svg>" />
      </Head>

      <style>{`
        .page-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 90% 10%, rgba(232,196,176,.22) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 5% 90%, rgba(195,212,197,.18) 0%, transparent 55%);
        }
        .wrap { max-width: 860px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }

        header { text-align: center; padding: 60px 0 48px; }
        .eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 4px;
          text-transform: uppercase; color: var(--rose); margin-bottom: 12px;
        }
        h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 7vw, 60px);
          font-weight: 300; color: var(--dark); line-height: 1.1;
        }
        h1 em { font-style: italic; color: var(--rose); }
        .divider {
          display: flex; align-items: center;
          gap: 16px; max-width: 240px; margin: 28px auto 0;
        }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--blush), transparent); }
        .divider-dot { color: var(--rose); }

        /* STATS */
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin: 40px 0 48px; }
        @media(max-width:480px) { .stats { grid-template-columns: 1fr; } }
        .stat-card {
          background: rgba(255,255,255,.65);
          border: 1px solid rgba(232,196,176,.4);
          border-radius: 18px; padding: 24px 16px;
          text-align: center; backdrop-filter: blur(8px);
        }
        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px; font-weight: 300;
          color: var(--rose); line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--taupe);
        }

        /* TABLE */
        .table-section { margin-bottom: 64px; }
        .table-wrap {
          background: rgba(255,255,255,.68);
          border: 1px solid rgba(232,196,176,.35);
          border-radius: 24px; overflow: hidden;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 40px rgba(160,90,69,.06);
        }
        table { width: 100%; border-collapse: collapse; }
        thead { background: linear-gradient(135deg, rgba(232,196,176,.2), rgba(195,212,197,.15)); }
        th {
          padding: 16px 20px; font-size: 10px; font-weight: 500;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--rose); text-align: left; white-space: nowrap;
        }
        td {
          padding: 14px 20px; font-size: 14px;
          color: var(--text); border-top: 1px solid rgba(232,196,176,.18);
          vertical-align: middle;
        }
        tr:hover td { background: rgba(232,196,176,.05); }
        .badge {
          display: inline-block; padding: 4px 12px;
          border-radius: 20px; font-size: 11px; font-weight: 500;
          white-space: nowrap;
        }
        .msg-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 13px;
          color: var(--text-light); margin-top: 3px;
        }

        /* EMPTY */
        .empty {
          text-align: center; padding: 64px 24px;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty p {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 20px; color: var(--taupe);
        }

        /* BACK LINK */
        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 32px;
          font-size: 13px; font-weight: 500;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--rose); text-decoration: none;
          transition: gap .2s;
        }
        .back-link:hover { gap: 12px; }

        footer {
          text-align: center; padding: 32px 24px 48px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 15px; color: var(--taupe);
        }
        footer span { color: var(--rose); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to { opacity:1; transform:translateY(0); }
        }
        .f1 { animation: fadeUp .7s ease forwards; }
        .f2 { animation: fadeUp .7s ease forwards .1s; opacity:0; }
        .f3 { animation: fadeUp .7s ease forwards .2s; opacity:0; }

        @media(max-width:600px) {
          th:nth-child(4), td:nth-child(4) { display: none; }
        }
      `}</style>

      <div className="page-bg" />
      <div className="wrap">
        <header className="f1">
          <p className="eyebrow">Painel de controle</p>
          <h1>Lista de <em>Convidados</em></h1>
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-dot">✦</span>
            <div className="divider-line" />
          </div>
        </header>

        <div className="f2">
          <a href="/" className="back-link">← Voltar ao convite</a>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{total}</div>
              <div className="stat-label">Respostas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalPessoas}</div>
              <div className="stat-label">Pessoas confirmadas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{comPresente}</div>
              <div className="stat-label">Com presente</div>
            </div>
          </div>
        </div>

        <section className="table-section f3">
          <div className="table-wrap">
            {guests.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🌸</div>
                <p>Nenhuma confirmação ainda.<br />Compartilhe o link do convite!</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Presença</th>
                    <th>Pessoas</th>
                    <th>Presente</th>
                    <th>Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => (
                    <tr key={g.id}>
                      <td><strong>{g.name}</strong></td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: attendBg[g.attend],
                            color: attendColor[g.attend],
                          }}
                        >
                          {attendLabel[g.attend]}
                        </span>
                      </td>
                      <td>{g.guestCount}</td>
                      <td>{g.giftChoice ? `🎁 ${g.giftChoice}` : <span style={{color:'var(--text-light)'}}>—</span>}</td>
                      <td>
                        {g.message
                          ? <span className="msg-text">"{g.message}"</span>
                          : <span style={{color:'var(--text-light)'}}>—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <footer>
        Chá de Casa Nova 🏡 <span>♥</span> Só para os olhos de quem organiza
      </footer>
    </>
  )
}