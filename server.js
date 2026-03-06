import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/create-web-call', async (req, res) => {
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
        res.json(data); // Returns access_token
    } catch (error) {
        console.error('Error creating web call:', error);
        res.status(500).json({ error: 'Failed to create web call' });
    }
});

app.listen(port, () => {
    console.log(`Backend bridge running on http://localhost:${port}`);
});
