import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Echo Endpoint - Method:', req.method);
  console.log('Echo Endpoint - Headers:', req.headers);
  console.log('Echo Endpoint - Body:', req.body);

  res.status(200).json({
    method: req.method,
    headers: req.headers,
    body: req.body,
    message: 'Echo successful',
  });
}