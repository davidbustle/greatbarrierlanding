// api/create-web-call.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_id: process.env.RETELL_AGENT_ID,
            }),
        });

        if (!response.ok) {
            throw new Error(`Retell API error: ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data); // Returns access_token
    } catch (error) {
        console.error('Error creating web call:', error);
        return res.status(500).json({ error: 'Failed to create web call' });
    }
}
