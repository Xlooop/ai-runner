'use client';

import { useState } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const arr = prompts.split('\n').filter(p => p.trim());
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompts: arr }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setResults(Array.isArray(data) ? data : [data.error || 'Error']);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xlooop AI Runner</h1>
      <textarea
        value={prompts}
        onChange={e => setPrompts(e.target.value)}
        placeholder="每行一个Prompt（最多50）"
        className="w-full h-32 p-3 border rounded mb-3"
      />
      <button
        onClick={run}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? '生成中...' : 'Run Batch'}
      </button>
      {results.map((r, i) => (
        <div key={i} className="mt-4 p-3 bg-gray-50 border rounded">
          <strong>Prompt {i+1}:</strong>
          <pre className="mt-1 text-sm whitespace-pre-wrap">{r}</pre>
        </div>
      ))}
    </div>
  );
}