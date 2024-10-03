import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const response = await fetch('http://localhost:5034/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: req.body,
        });

        if (response.ok) {
            res.status(200).json(await response.json());
        } else {
            res.status(response.status).json(await response.json());
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
