import type { NextApiRequest, NextApiResponse } from 'next';
import qdrantClient from '../../../lib/qdrant';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let vector: number[] | undefined;
    let filter: object | undefined;

    try {
      if (req.query.vector) {
        vector = JSON.parse(req.query.vector as string);
      }
      if (req.query.filter) {
        filter = JSON.parse(req.query.filter as string);
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON for vector or filter in query parameters.' });
    }

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