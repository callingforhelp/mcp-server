import type { NextApiRequest, NextApiResponse } from 'next';
import qdrantClient from '../../../lib/qdrant';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { id, vector, payload } = req.body;

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
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
