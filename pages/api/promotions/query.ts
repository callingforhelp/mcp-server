import type { NextApiRequest, NextApiResponse } from 'next';
import qdrantClient from '../../../lib/qdrant';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { vector, filter } = req.body;

    try {
      const searchResult = await qdrantClient.search('promotions', {
        vector,
        filter,
        limit: 10,
      });

      res.status(200).json(searchResult);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
