'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [haiku, setHaiku] = useState('');
  const [loading, setLoading] = useState(false);
  const [pastHaikus, setPastHaikus] = useState([]);

  const fetchHaikus = async () => {
    const res = await fetch('/api/get-haiku');
    const data = await res.json();
    setPastHaikus(data.haikus || []);
  };

  const generateHaiku = async () => {
    setLoading(true);
    setHaiku('');

    const res = await fetch('/api/haiku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords }),
    });

    const data = await res.json();
    setHaiku(data.haiku);

    await fetch('/api/save-haiku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ haiku: data.haiku, keywords }),
    });

    await fetchHaikus();
    setLoading(false);
  };

  useEffect(() => {
    fetchHaikus();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Haiku Generator 🌸</h1>

      <input
        type="text"
        placeholder="Enter keywords (e.g., rain, silence)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '100%',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
      />
      <button
        onClick={generateHaiku}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Generating...' : 'Generate Haiku'}
      </button>

      {haiku && (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            marginTop: '2rem',
            backgroundColor: '#f0f0f0',
            padding: '1rem',
            borderRadius: '5px',
          }}
        >
          {haiku}
        </pre>
      )}

      {pastHaikus.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h2>Past Haikus</h2>
          {pastHaikus
            .filter((item) => item.haiku !== haiku) // 👈 Filter out current haiku
            .map((item) => (
              <div
                key={item.id}
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                  borderLeft: '4px solid #ccc',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{item.haiku}</pre>
                <small style={{ color: '#777' }}>User Keywords: {item.keywords}</small>
              </div>
            ))}
        </section>
      )}
    </main>
  );
}
