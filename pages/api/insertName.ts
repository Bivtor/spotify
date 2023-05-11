

import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const client = await db.connect();

    try {
        const ds = JSON.parse(request.body)
        const res = await client.query('INSERT INTO names (id, name, text) VALUES ($1, $2, $3)', [ds.id, ds.name, ds.text]);
        console.log(res.rowCount)
        return res.rowCount === 1;


    } catch (error) {
        console.log("failed in insertName")
        console.log(error)
        return response.status(500).json({ error });
    }

    // const Names = await client.sql`SELECT * FROM Names;`;
    response.status(200).json("here is your respnse")
}
