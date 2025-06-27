import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Query Endpoint - Reached minimal handler');
  return res.status(200).json({ status: 'Minimal query endpoint reached successfully.' });
}
