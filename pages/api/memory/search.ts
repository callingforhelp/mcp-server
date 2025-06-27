import type { NextApiRequest, NextApiResponse } from 'next';
import qdrantClient from '../../../lib/qdrant';
import { CohereClient } from 'cohere-ai';

const cohereClient = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { text, filter, collection } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Missing text query' });
    }

    try {
      const embeddingResponse = await cohereClient.embed({
        texts: [text],
        model: "embed-english-light-v3.0", // Or another suitable Cohere embedding model
        inputType: "search_query",
      });

      const vector = embeddingResponse.embeddings[0];

      const searchResult = await qdrantClient.search(collection || 'memory', {
        vector,
        filter,
        limit: 10,
      });

      res.status(200).json(searchResult);
    } catch (error) {
      console.error('Error during Qdrant search:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
