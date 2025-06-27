import { NextApiRequest, NextApiResponse } from 'next';
import qdrant from '../../../lib/qdrant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { collection, query } = req.body;

  if (!collection || !query) {
    return res.status(400).json({ message: 'Missing collection or query' });
  }

  try {
    const results = await qdrant.search(collection, query);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error querying data from Qdrant' });
  }
}
