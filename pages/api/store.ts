import { NextApiRequest, NextApiResponse } from 'next';
import qdrant from '../../lib/qdrant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { collection, points } = req.body;

  if (!collection || !points) {
    return res.status(400).json({ message: 'Missing collection or points' });
  }

  try {
    await qdrant.upsert(collection, { wait: true, points });
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing data in Qdrant' });
  }
}
