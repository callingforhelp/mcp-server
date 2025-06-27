import { QdrantClient } from "@qdrant/js-client-rest";

console.log("QDRANT_URL from env:", process.env.QDRANT_URL);
const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  https: true, // Explicitly use HTTPS
  port: 443,   // Explicitly set port to 443
});

export default client;