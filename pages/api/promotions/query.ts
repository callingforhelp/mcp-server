import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Query Endpoint - Method:', req.method);
  console.log('Query Endpoint - Headers:', req.headers);
  console.log('Query Endpoint - Query Parameters:', req.query);

  // Just return the query parameters to see what's received
  res.status(200).json({
    status: 'Received query, check logs for parameters.',
    receivedMethod: req.method,
    receivedHeaders: req.headers,
    receivedQuery: req.query,
  });
}
