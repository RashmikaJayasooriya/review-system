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
        const userPrompt = `Using the following questions and answers, write three distinct short review messages in **first person**. 
Each review should vary in **length** (short, medium, long) and **tone** (e.g., casual, professional, enthusiastic). 
Return ONLY valid JSON in the exact shape:: {[{length:"",tone:"",review:""}, {length:"",tone:"",review:""}, {length:"",tone:"",review:""}]}.
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

        const raw = completion.choices[0].message?.content ?? '';
        let reviews: string[] = [];

        try {
            const jsonText = raw.replace(/^\s*```(?:json)?\s*|\s*```$/g, '');
            const parsed = JSON.parse(jsonText);

            if (Array.isArray(parsed)) {
                reviews = parsed
                    .map((v) =>
                        typeof v === 'string'
                            ? v
                            : v && typeof v === 'object' && 'review' in v
                                ? (v.review as string)
                                : null
                    )
                    .filter(Boolean) as string[];
            } else if (Array.isArray(parsed.reviews)) {
                reviews = parsed.reviews.filter((v: unknown) => typeof v === 'string');
            }
        } catch {
            reviews = raw.split('\n').filter(Boolean).slice(0, 3);
        }

        // return NextResponse.json({ reviews: data.reviews });
        console.log("Generated reviews:", reviews);
        return NextResponse.json({ reviews });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to generate reviews' }, { status: 500 });
    }
}