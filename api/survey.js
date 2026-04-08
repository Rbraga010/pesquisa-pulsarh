const SURVEY_API = 'http://72.60.6.61:3000/api/survey-responses'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method === 'POST') {
    try {
      const { answers, submittedAt } = req.body
      const response = await fetch(SURVEY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, submittedAt }),
      })
      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Survey submit error:', error)
      return res.status(500).json({ error: 'Internal error' })
    }
  }

  if (req.method === 'GET') {
    const { key } = req.query
    if (key !== 'pulsar2026') {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    try {
      const response = await fetch(`${SURVEY_API}?key=pulsar2026`)
      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Survey fetch error:', error)
      return res.status(500).json({ error: 'Internal error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
