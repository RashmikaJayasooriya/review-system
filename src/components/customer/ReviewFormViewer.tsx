'use client';
import {useActionState, useState} from 'react';
import { ReviewForm as ReviewFormType } from '@/types';
import {Input, Button, Radio, RadioChangeEvent, Space} from 'antd';
import {saveReview} from "@/app/review/actions";


interface Props {
    form: ReviewFormType;
}

export default function ReviewFormViewer({ form }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<string[]>([]);
    const [selectedReview, setSelectedReview] = useState('');

    const initialState = { success: false, error: '' };
    const [state, formAction, isPending] = useActionState(saveReview, initialState);

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
            setSelectedReview('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full grid md:grid-cols-2 gap-8">
            <div className="space-y-5 p-6 rounded-lg shadow-md bg-gray-200">
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
            </div>

            <div>
                {reviews.length > 0 && (
                    <form action={formAction} className="mt-4 space-y-4 p-4 rounded-lg bg-gray-200">
                        <h3 className="font-medium">Generated Review Variations</h3>
                        <input type="hidden" name="formId" value={form.id} />
                        <input type="hidden" name="review" value={selectedReview} />
                        <input type="hidden" name="name" value={answers['default_name'] || ''} />
                        <input type="hidden" name="email" value={answers['default_email'] || ''} />

                        <Radio.Group
                            onChange={(e: RadioChangeEvent) => setSelectedReview(e.target.value)}
                            value={selectedReview}
                        >
                            <Space direction="vertical" size={0}>
                                {reviews.map((r, i) => (
                                    <div key={i}>
                                        <Radio value={r}  >
                                            {r}
                                        </Radio>
                                        <hr className="my-4 border-gray-300" />
                                    </div>
                                ))}
                            </Space>
                        </Radio.Group>

                        {state.success && (
                            <div className="text-green-600 space-y-2">
                                <div>Saved!</div>
                                {form.googleReviewLink && (
                                    <a
                                        href={form.googleReviewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline text-blue-600"
                                    >
                                        Leave a Google Review
                                    </a>
                                )}
                            </div>
                        )}
                        {state.error && <div className="text-red-500">{state.error}</div>}

                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!selectedReview || isPending}
                            loading={isPending}
                        >
                            Save
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}