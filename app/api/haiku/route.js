import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { keywords } = await req.json();

  const prompt = `Write a haiku using the following keywords: ${keywords}. Make it traditional, evocative, and beautiful.`;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a haiku master.' },
        { role: 'user', content: prompt },
      ],
    });

    const haiku = chat.choices[0]?.message?.content || 'No haiku generated.';

    return NextResponse.json({ haiku });
  } catch (error) {
    console.error('Error generating haiku:', error);
    return NextResponse.json({ haiku: 'Error generating haiku.' }, { status: 500 });
  }
}
