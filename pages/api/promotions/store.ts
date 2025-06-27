import type { NextApiRequest, NextApiResponse } from 'next';
import qdrantClient from '../../../lib/qdrant';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const authHeader = req.headers.get('authorization');
    console.log('Incoming Authorization Header:', authHeader);
    console.log('Configured API Key:', process.env.API_KEY);

    let rawBody = '';
    for await (const chunk of req) {
      rawBody += chunk.toString();
    }
    console.log('Raw Request Body:', rawBody);

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
      console.log('Parsed Request Body:', parsedBody);
    } catch (e) {
      console.error('Error parsing request body:', e);
      return res.status(400).json({ success: false, message: 'Invalid JSON body' });
    }

    if (!authHeader || authHeader !== `Bearer ${process.env.API_KEY}`) {
      return res.status(401).json({ success: false, message: 'authentication failed' });
    }

    const { id, vector, payload } = parsedBody;

    try {
      await qdrantClient.upsert('promotions', {
        wait: true,
        points: [
          {
            id,
            vector,
            payload,
          },
        ],
      });

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error during Qdrant upsert:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
