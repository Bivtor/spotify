

import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const client = await db.connect();

    try {
        const ds = JSON.parse(request.body)
        const res = await client.query('INSERT INTO idmap (id, text) VALUES ($1, $2)', [ds.id, ds.text]);
        console.log(res.rowCount)
        return res.rowCount === 1;
    } catch (error) {
        console.log("failed in DB insert function")
        console.log(error)
        return response.status(500).json({ error });
    }
}
