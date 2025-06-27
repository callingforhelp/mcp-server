import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Store Endpoint - Method:', req.method);
  console.log('Store Endpoint - Headers:', req.headers);
  console.log('Store Endpoint - Raw Body (before any parsing):', req.body);

  // Just return a success to see if the request even reaches here
  return res.status(200).json({
    status: 'Received request, check logs for body content.',
    receivedMethod: req.method,
    receivedHeaders: req.headers,
  });
}
