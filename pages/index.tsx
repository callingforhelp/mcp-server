import { useState } from 'react';

export default function Home() {
  const [memoryText, setMemoryText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [storeResponse, setStoreResponse] = useState(null);
  const [searchResponse, setSearchResponse] = useState(null);

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreResponse(null);
    try {
      const res = await fetch('/api/memory/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_KEY}`,
        },
        body: JSON.stringify({ collection: 'memory', text: memoryText }),
      });
      const data = await res.json();
      setStoreResponse(data);
    } catch (error) {
      console.error('Error storing memory:', error);
      setStoreResponse({ message: 'Error storing memory' });
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResponse(null);
    try {
      const res = await fetch('/api/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection: 'memory', text: searchText }),
      });
      const data = await res.json();
      setSearchResponse(data);
    } catch (error) {
      console.error('Error searching memory:', error);
      setSearchResponse({ message: 'Error searching memory' });
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>MCP Server - Memory Interface</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>Store New Memory</h2>
        <form onSubmit={handleStoreSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <textarea
            placeholder="Enter text to store as a memory"
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            rows={5}
            style={{ marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Store Memory
          </button>
        </form>
        {storeResponse && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <h3>Store Response:</h3>
            <pre>{JSON.stringify(storeResponse, null, 2)}</pre>
          </div>
        )}
      </section>

      <section>
        <h2>Search Memories</h2>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Enter search query"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Search Memories
          </button>
        </form>
        {searchResponse && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <h3>Search Results:</h3>
            <pre>{JSON.stringify(searchResponse, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
