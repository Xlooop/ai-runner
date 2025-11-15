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

  const promptCount = prompts.split('\n').filter(p => p.trim()).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-8 mt-6 sm:mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Xlooop HK AI Batch Runner
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              批量生成 AI 内容，提升工作效率
            </p>
          </div>

          {/* 输入卡片 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  输入 Prompts
                </span>
              </label>
              <textarea
                value={prompts}
                onChange={e => setPrompts(e.target.value)}
                placeholder="每行一个 Prompt（最多 50 个）&#10;&#10;示例：&#10;Write 3 SEO product titles for phone cases&#10;Generate 2 TikTok captions for pet toys"
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl mb-3 resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50/50"
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  每行一个提示词
                </span>
                <span className={`font-semibold ${promptCount > 50 ? 'text-red-500' : promptCount > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                  {promptCount} / 50 prompts
                </span>
              </div>
            </div>

            <button
              onClick={run}
              disabled={loading || promptCount === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>运行批处理 ({promptCount} {promptCount === 1 ? 'prompt' : 'prompts'})</span>
                </>
              )}
            </button>
          </div>

          {/* 结果区域 */}
          {results.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  生成结果
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              </div>
              {results.map((r, i) => (
                <div 
                  key={i} 
                  className="result-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <strong className="text-gray-800 font-semibold text-lg">Prompt {i + 1}</strong>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                          {r.length} 字符
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                        <pre className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {r}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}