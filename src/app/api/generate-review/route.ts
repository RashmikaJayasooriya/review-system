import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

interface QuestionInput { id: string; title: string }

export async function POST(req: Request) {
    try {
        const { answers, questions } = await req.json();
        if (!answers || !questions) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const qa = (questions as QuestionInput[])
            .map((q) => `Q: ${q.title}\nA: ${answers[q.id] ?? ''}`)
            .join('\n');
        // const userPrompt = `Using the following questions and answers, write three distinct short review messages. Reply in JSON as {"reviews": ["review1","review2","review3"]}.\n${qa}`;
        const userPrompt = `Using the following questions and answers, write three distinct short review messages in **first person**. 
Each review should vary in **length** (short, medium, long) and **tone** (e.g., casual, professional, enthusiastic). 
Reply in JSON format as: {"reviews": ["review1", "review2", "review3"]}.
\n${qa}`;

        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [
                {
                    "role": "user",
                    "content": userPrompt
                }
            ]
        });

        console.log(completion.choices[0].message);
        const content = completion.choices[0].message?.content || '';
        let data;
        try {
            data = JSON.parse(content);
        } catch {
            data = { reviews: content.split('\n').filter(Boolean).slice(0,3) };
        }
        return NextResponse.json({ reviews: data.reviews });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to generate reviews' }, { status: 500 });
    }
}