import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const KEY = 'cha-casa-nova:guests'

export default async function handler(req, res) {
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

    // Adiciona ao final da lista — persiste permanentemente no Redis
    await redis.rpush(KEY, JSON.stringify(guest))

    return res.status(200).json({ success: true, guest })
  }

  if (req.method === 'GET') {
    const raw = await redis.lrange(KEY, 0, -1)
    const guests = raw.map(item =>
      typeof item === 'string' ? JSON.parse(item) : item
    )
    return res.status(200).json(guests)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}