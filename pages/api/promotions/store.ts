import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const authHeader = req.headers.get('authorization');
    console.log('Incoming Authorization Header:', authHeader);
    console.log('Configured API Key:', process.env.API_KEY);
    console.log('Incoming Request Body:', req.body);

    if (!authHeader || authHeader !== `Bearer ${process.env.API_KEY}`) {
      return res.status(401).json({ success: false, message: 'authentication failed' });
    }

    // If we reach here, authentication passed.
    // We are temporarily skipping Qdrant interaction to debug the 400 error.
    return res.status(200).json({ status: 'Authentication successful, and request received.' });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}