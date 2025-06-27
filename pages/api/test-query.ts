import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Test Query Endpoint - Reached!');
  return res.status(200).json({ message: 'Hello from test-query API!', query: req.query });
}
