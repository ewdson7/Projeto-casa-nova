import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const GUESTS_KEY = 'cha-casa-nova:guests'
const GIFTS_KEY  = 'cha-casa-nova:taken-gifts'

export default async function handler(req, res) {
  // Proteção simples: só aceita GET com o token correto
  if (req.query.token !== 'migrar-agora') {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  // Lê todos os convidados existentes
  const raw = await redis.lrange(GUESTS_KEY, 0, -1)
  const guests = raw.map(item => typeof item === 'string' ? JSON.parse(item) : item)

  // Filtra os que escolheram um presente real (não vazio e não "Outro")
  const giftsToAdd = guests
    .map(g => g.giftChoice)
    .filter(g => g && g.trim() && g.trim() !== 'Outro')

  if (giftsToAdd.length === 0) {
    return res.status(200).json({ message: 'Nenhum presente para migrar.', giftsToAdd })
  }

  // Adiciona todos de uma vez no Set do Redis
  await redis.sadd(GIFTS_KEY, ...giftsToAdd)

  return res.status(200).json({
    message: `✅ Migração concluída! ${giftsToAdd.length} presente(s) registrado(s).`,
    giftsAdded: giftsToAdd,
  })
}