import fs from 'fs'
import path from 'path'

// File path para persistência (funciona no Vercel com /tmp)
const DATA_FILE = path.join('/tmp', 'rsvp-data.json')

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    }
  } catch (_) {}
  return []
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (_) {}
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, attend, guestCount, giftChoice, message } = req.body

    if (!name || !attend) {
      return res.status(400).json({ error: 'Nome e confirmação são obrigatórios.' })
    }

    const guests = readData()

    const newGuest = {
      id: Date.now(),
      name,
      attend,
      guestCount: guestCount || '1',
      giftChoice: giftChoice || '',
      message: message || '',
      createdAt: new Date().toISOString(),
    }

    guests.push(newGuest)
    writeData(guests)

    return res.status(200).json({ success: true, guest: newGuest })
  }

  if (req.method === 'GET') {
    const guests = readData()
    return res.status(200).json(guests)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
