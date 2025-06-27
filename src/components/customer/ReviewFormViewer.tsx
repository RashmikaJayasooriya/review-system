'use client';
import { useState } from 'react';
import { ReviewForm as ReviewFormType } from '@/types';
import { Input, Button } from 'antd';

interface Props {
    form: ReviewFormType;
}

export default function ReviewFormViewer({ form }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<string[]>([]);

    const updateAnswer = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const generateReviews = async () => {
        setLoading(true);
        setReviews([]);
        try {
            const res = await fetch('/api/generate-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, questions: form.questions }),
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            console.log('Generated reviews:', data);
            setReviews(data.reviews || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {form.questions.map((q) => (
                <div key={q.id} className="space-y-1">
                    <label className="block font-medium text-gray-700">
                        {q.title} {q.required && <span className="text-red-500">*</span>}
                    </label>
                    {q.type === 'text' && (
                        <Input id="name" name="name" value={answers[q.id] || ''} onChange={e => updateAnswer(q.id, e.target.value)} />
                    )}
                    {q.type === 'email' && (
                        <Input id="email" name="email" type="email" value={answers[q.id] || ''} onChange={e => updateAnswer(q.id, e.target.value)} />
                    )}
                    {q.type === 'textarea' && (
                        <Input.TextArea rows={3} value={answers[q.id] || ''} onChange={e => updateAnswer(q.id, e.target.value)} />
                    )}
                    {q.type === 'mcq' && (
                        <select
                            className="border rounded px-2 py-1"
                            value={answers[q.id] || ''}
                            onChange={e => updateAnswer(q.id, e.target.value)}
                        >
                            <option value="">Select...</option>
                            {q.options?.map((o) => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}

            <Button type="primary" loading={loading} onClick={generateReviews}>
                Create Review
            </Button>

            {reviews.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h3 className="font-medium">Review Variations</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        {reviews.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}