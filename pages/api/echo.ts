import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Echo Endpoint - Method:', req.method);
  console.log('Echo Endpoint - Headers:', req.headers);

  let bodyContent;
  if (req.method === 'POST' || req.method === 'PUT') {
    // For POST/PUT, try to read the raw body if not already parsed
    if (typeof req.body === 'object' && req.body !== null) {
      bodyContent = req.body;
    } else {
      let rawBody = '';
      for await (const chunk of req) {
        rawBody += chunk.toString();
      }
      try {
        bodyContent = JSON.parse(rawBody);
      } catch (e) {
        bodyContent = rawBody; // If not JSON, send raw string
      }
    }
  } else {
    // For GET/DELETE, body should be empty or handled via query params
    bodyContent = req.query; // Echo query parameters for GET requests
  }

  console.log('Echo Endpoint - Body:', bodyContent);

  res.status(200).json({
    method: req.method,
    headers: req.headers,
    body: bodyContent,
    message: 'Echo successful',
  });
}
