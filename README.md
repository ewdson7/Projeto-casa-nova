# 🏡 Chá de Casa Nova

Página de confirmação de presença para o chá de casa nova.

## Páginas

- `/` — Convite + formulário de confirmação de presença
- `/lista-convidados` — Painel com todos os convidados confirmados (apenas para você)

## Como fazer o deploy no Vercel

### Opção 1 — Via GitHub (recomendado)

1. Crie um repositório no GitHub e envie os arquivos deste projeto
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em **"Add New Project"**
4. Importe o repositório do GitHub
5. Clique em **Deploy** — o Vercel detecta Next.js automaticamente ✅

### Opção 2 — Via Vercel CLI

```bash
npm install -g vercel
cd cha-casa-nova
vercel
```

Siga as instruções no terminal. Em poucos segundos o projeto estará no ar.

---

## Personalização antes do deploy

Abra `pages/index.js` e altere:

```js
// Linha ~88 — cards de informação do evento
<div className="info-value">Sábado<br />12 de Abril</div>   // ← sua data
<div className="info-value">14h às 20h</div>                 // ← seu horário
<div className="info-value">Seu endereço<br />aqui</div>    // ← seu endereço
```

Também pode editar a lista de sugestões de presentes no array `gifts` no início do arquivo.

---

## Sobre os dados

Os dados são salvos em `/tmp/rsvp-data.json` no servidor do Vercel.  
> **Atenção:** o `/tmp` do Vercel é efêmero — os dados podem ser apagados se o servidor reiniciar.  
> Para persistência permanente, recomenda-se adicionar um banco de dados como **Vercel KV** (gratuito) ou **PlanetScale**.  
> Para um chá de casa nova (evento único e curto prazo), o `/tmp` funciona bem na prática.
