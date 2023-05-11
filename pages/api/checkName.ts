import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const client = await db.connect();
    try {

        const id = request.body.replace(/^"|"$/g, '');
        const res = await client.query('SELECT * FROM idmap WHERE id = $1', [id]);
        const found = res.rows.length > 0
        const responseItem = { "found": found, "text": "" }

        if (found) {
            responseItem.text = res.rows.at(0).text
        }
            response.status(200).json(responseItem)
    }
    catch (error) {
        console.log("failed in db with error + " + error)
        response.status(500).json({ error });
    }
}