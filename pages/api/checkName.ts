import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const client = await db.connect();
    try {
        const name = request.body.replace(/^"|"$/g, '');
        const res = await client.query('SELECT * FROM names WHERE name = $1', [name]);
        const found = res.rows.length > 0
        const responseItem = { "found": found, "text": "sampletext" }
        response.status(200).json(responseItem)
    }
    catch (error) {
        console.log("failed")
        response.status(500).json({ error });
    }
}