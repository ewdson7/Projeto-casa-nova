import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const GUESTS_KEY = 'cha-casa-nova:guests'
const GIFTS_KEY  = 'cha-casa-nova:taken-gifts'

export default async function handler(req, res) {

  // GET — retorna convidados e presentes já escolhidos
  if (req.method === 'GET') {
    const [rawGuests, takenGifts] = await Promise.all([
      redis.lrange(GUESTS_KEY, 0, -1),
      redis.smembers(GIFTS_KEY),
    ])

    const guests = rawGuests.map(item =>
      typeof item === 'string' ? JSON.parse(item) : item
    )

    return res.status(200).json({ guests, takenGifts })
  }

  // POST — salva confirmação de presença
  if (req.method === 'POST') {
    const { name, attend, guestCount, giftChoice, message } = req.body

    if (!name?.trim() || !attend) {
      return res.status(400).json({ error: 'Nome e confirmação são obrigatórios.' })
    }

    const guest = {
      id: Date.now(),
      name: name.trim(),
      attend,
      guestCount: guestCount || '1',
      giftChoice: giftChoice || '',
      message: message?.trim() || '',
      createdAt: new Date().toISOString(),
    }

    const ops = [redis.rpush(GUESTS_KEY, JSON.stringify(guest))]

    // Marca presente como reservado no Set (sem revelar quem escolheu)
    // "Outro" nunca entra no Set — permanece sempre disponível na fila
    if (giftChoice && giftChoice.trim() && giftChoice.trim() !== 'Outro') {
      ops.push(redis.sadd(GIFTS_KEY, giftChoice.trim()))
    }

    await Promise.all(ops)

    return res.status(200).json({ success: true, guest })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}