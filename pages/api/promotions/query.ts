import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Query Endpoint - Method:', req.method);
  console.log('Query Endpoint - Headers:', req.headers);
  console.log('Query Endpoint - Raw Query Parameters:', req.query);

  // Just return a static success to see if the request even reaches here
  return res.status(200).json({
    status: 'Received query request, check logs for parameters.',
    receivedMethod: req.method,
    receivedHeaders: req.headers,
    receivedQuery: req.query,
  });
}