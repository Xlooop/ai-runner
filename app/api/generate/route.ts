import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompts } = await req.json();
  if (!prompts?.length) return NextResponse.json({ error: 'No prompts' }, { status: 400 });

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || key.includes('your-key')) {
    return NextResponse.json({ error: 'Set DEEPSEEK_API_KEY in Vercel' }, { status: 500 });
  }

  const results = await Promise.all(
    prompts.slice(0, 50).map(async (p: string) => {
      try {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: p }],
            max_tokens: 500
          })
        });
        const data = await res.json();
        return data.choices?.[0]?.message?.content || 'No output';
      } catch {
        return 'API Error';
      }
    })
  );

  return NextResponse.json(results);
}