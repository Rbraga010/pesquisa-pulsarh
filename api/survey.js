export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { answers, submittedAt } = req.body

    // Save to War Room via webhook
    await fetch('http://72.60.6.61:3000/api/webhooks/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer PulsarH_Lead_Capture_2026',
      },
      body: JSON.stringify({
        name: `Pesquisa: ${answers.cargo || 'Líder'} - ${answers.setor || 'N/A'}`,
        email: `pesquisa_${Date.now()}@survey.pulsarh`,
        origem: 'Pesquisa_Lideres',
        role: answers.cargo,
        income: answers.investiu,
        challenge: answers.desafio,
      }),
    })

    // Also save full survey data as a file on the VPS
    await fetch('http://72.60.6.61:3000/api/webhooks/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer PulsarH_Lead_Capture_2026',
      },
      body: JSON.stringify({
        name: `Survey ${submittedAt}`,
        email: `survey_full_${Date.now()}@survey.pulsarh`,
        origem: 'Pesquisa_Lideres',
        notes: Object.entries(answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n'),
      }),
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Survey submit error:', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
