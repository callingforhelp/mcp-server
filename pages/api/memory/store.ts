import { NextApiRequest, NextApiResponse } from 'next';
import qdrant from '../../../lib/qdrant';
import { CohereClient } from 'cohere-ai';

const cohereClient = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_KEY}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { collection, text } = req.body;

  if (!collection || !text) {
    return res.status(400).json({ message: 'Missing collection or text' });
  }

  try {
    // Check if collection exists, create if not
    try {
      await qdrant.getCollection(collection);
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`Collection ${collection} not found, creating it manually...`);
        const createCollectionUrl = `${process.env.QDRANT_URL}/collections`;
        const createCollectionResponse = await fetch(createCollectionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': `${process.env.QDRANT_API_KEY || ''}`,
          },
          body: JSON.stringify({
            name: collection,
            vectors: { size: 384, distance: 'Cosine' }, // Cohere embed-english-light-v3.0 produces 384-dim vectors
          }),
        });
        console.log("Qdrant API Key being sent:", process.env.QDRANT_API_KEY ? "[KEY PRESENT]" : "[KEY MISSING]");

        if (!createCollectionResponse.ok) {
          const responseText = await createCollectionResponse.text(); // Read body once
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (jsonError) {
            errorData = responseText; // Use raw text if not JSON
          }
          console.error('Error creating collection manually:', errorData);
          throw new Error(`Failed to create collection: ${createCollectionResponse.status} ${createCollectionResponse.statusText}`);
        }
        console.log(`Collection ${collection} created manually.`);
      } else {
        throw error; // Re-throw other errors
      }
    }

    const embeddingResponse = await cohereClient.embed({
      texts: [text],
      model: "embed-english-light-v3.0", // Or another suitable Cohere embedding model
      inputType: "search_document",
    });

    const vector = embeddingResponse.embeddings[0];

    const points = [{
      id: text.hashCode(), // Simple hash for ID, consider a more robust solution for production
      vector: vector,
      payload: { text: text },
    }];

    await qdrant.upsert(collection, { wait: true, points });
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing data in Qdrant' });
  }
}

// Simple hashCode function for demonstration.
// In a real application, consider a more robust ID generation strategy.
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};