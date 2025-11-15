import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompts } = await req.json();
    if (!prompts || prompts.length === 0) {
      return NextResponse.json({ error: 'No prompts provided' }, { status: 400 });
    }
    if (prompts.length > 50) {
      return NextResponse.json({ error: 'Max 50 prompts per run' }, { status: 400 });
    }

    // 通义千问免费 API Key（注册即送 100 万 token）
    const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-2252069e504f4e8e88a3a4e9a3991f75';
    if (!QWEN_API_KEY) {
      return NextResponse.json({ error: '请在 Vercel 设置 QWEN_API_KEY（通义千问免费）' }, { status: 500 });
    }

    const results = await Promise.all(
      prompts.slice(0, 50).map(async (p: string) => {
        const res = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${QWEN_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen-turbo',
            input: { prompt: p },
            parameters: { result_format: 'text' }
          }),
        });
        const data = await res.json();
        console.log(data);
        return data.output?.text || 'Error: No output from API';
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'API 调用失败，请检查 Key' }, { status: 500 });
  }
}