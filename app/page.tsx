'use client';
import React from 'react';
import { useState } from 'react';

export default function Home() {
  const [prompts, setPrompts] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResults([]); // 清空旧结果
    const arr = prompts.split('\n').filter(p => p.trim());
    if (arr.length === 0) {
      setResults(['Error: No prompts provided']);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompts: arr }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data.error || 'Error']);
    } catch (error) {
      setResults(['Network Error: Check console']);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Xlooop HK AI Batch Runner</h1>
        <textarea
          value={prompts}
          onChange={e => setPrompts(e.target.value)}
          placeholder="每行一个 Prompt（最多 50 个）&#10;示例：&#10;Write 3 SEO product titles for phone cases&#10;Generate 2 TikTok captions for pet toys"
          className="w-full h-40 p-3 border-2 border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={run}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          {loading ? '生成中...' : `Run Batch (${prompts.split('\n').filter(p => p.trim()).length} prompts)`}
        </button>
        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">结果：</h2>
            {results.map((r, i) => (
              <div key={i} className="p-4 bg-white border rounded-lg shadow-sm">
                <strong className="text-gray-700">Prompt {i+1}:</strong>
                <pre className="mt-2 text-sm whitespace-pre-wrap text-gray-800 bg-gray-100 p-2 rounded">{r}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}