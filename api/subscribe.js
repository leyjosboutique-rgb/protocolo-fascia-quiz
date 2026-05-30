export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, corpo_atual, corpo_meta, peso_atual, peso_meta, idade } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': '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',
      },
      body: JSON.stringify({
        email,
        listIds: [7],
        updateEnabled: true,
        attributes: {
          FONTE: 'Quiz Fascia Brasil',
          CORPO_ATUAL: corpo_atual || '',
          CORPO_META: corpo_meta || '',
          PESO_ATUAL: String(peso_atual || ''),
          PESO_META: String(peso_meta || ''),
          IDADE: String(idade || ''),
        }
      }),
    });

    const text = await response.text();
    console.log('Brevo response:', response.status, text);
    return res.status(200).json({ status: response.status, body: text });
  } catch (e) {
    console.error('Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
