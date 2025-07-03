'use client';
import {useActionState, useState} from 'react';
import { ReviewForm as ReviewFormType } from '@/types';
import {Input, Button, Radio, RadioChangeEvent, Space, Select, Card, Divider} from 'antd';
import {saveReview} from "@/app/review/actions";
import { ExternalLink, Star, Send } from 'lucide-react';

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
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Questions Section */}
                <Card 
                    title={
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-500" size={20} />
                            <span className="text-lg font-semibold">Share Your Experience</span>
                        </div>
                    }
                    className="h-fit shadow-lg border-0"
                    styles={{ body: { padding: '24px' } }}
                >
                    <div className="space-y-6">
                        {form.questions.map((q) => (
                            <div key={q.id} className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-800">
                                    {q.title} {q.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {q.type === 'text' && (
                                    <Input 
                                        size="large"
                                        placeholder="Enter your response..."
                                        value={answers[q.id] || ''} 
                                        onChange={e => updateAnswer(q.id, e.target.value)}
                                        className="rounded-lg"
                                    />
                                )}
                                
                                {q.type === 'email' && (
                                    <Input 
                                        size="large"
                                        type="email" 
                                        placeholder="your.email@example.com"
                                        value={answers[q.id] || ''} 
                                        onChange={e => updateAnswer(q.id, e.target.value)}
                                        className="rounded-lg"
                                    />
                                )}
                                
                                {q.type === 'textarea' && (
                                    <Input.TextArea 
                                        rows={4} 
                                        placeholder="Share your detailed thoughts..."
                                        value={answers[q.id] || ''} 
                                        onChange={e => updateAnswer(q.id, e.target.value)}
                                        className="rounded-lg"
                                        showCount
                                        maxLength={500}
                                    />
                                )}
                                
                                {q.type === 'mcq' && (
                                    <Select
                                        size="large"
                                        placeholder="Select an option..."
                                        value={answers[q.id] || undefined}
                                        onChange={value => updateAnswer(q.id, value)}
                                        className="w-full rounded-lg"
                                    >
                                        {q.options?.map((option) => (
                                            <Select.Option key={option} value={option}>
                                                {option}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </div>
                        ))}

                        <div className="pt-4">
                            <Button 
                                type="primary" 
                                size="large"
                                loading={loading} 
                                onClick={generateReviews}
                                className="w-full h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700"
                                icon={<Star size={18} />}
                            >
                                Generate Review Options
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Generated Reviews Section */}
                <Card 
                    title={
                        <div className="flex items-center gap-2">
                            <Send className="text-green-500" size={20} />
                            <span className="text-lg font-semibold">Choose Your Review</span>
                        </div>
                    }
                    className="h-fit shadow-lg border-0"
                    styles={{ body: { padding: '24px' } }}
                >
                    {reviews.length > 0 ? (
                        <form action={formAction} className="space-y-6">
                            <input type="hidden" name="formId" value={form.id} />
                            <input type="hidden" name="review" value={selectedReview} />
                            <input type="hidden" name="name" value={answers['default_name'] || ''} />
                            <input type="hidden" name="email" value={answers['default_email'] || ''} />

                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Select the review that best represents your experience:
                                </p>
                                
                                <Radio.Group
                                    onChange={(e: RadioChangeEvent) => setSelectedReview(e.target.value)}
                                    value={selectedReview}
                                    className="w-full"
                                >
                                    <Space direction="vertical" size="large" className="w-full">
                                        {reviews.map((review, index) => (
                                            <div key={index} className="w-full">
                                                <Radio 
                                                    value={review}
                                                    className="w-full"
                                                >
                                                    <div className="bg-gray-50 p-4 rounded-lg ml-2 border border-gray-200 hover:border-blue-300 transition-colors">
                                                        <p className="text-sm text-gray-800 leading-relaxed">
                                                            {review}
                                                        </p>
                                                    </div>
                                                </Radio>
                                                {index < reviews.length - 1 && (
                                                    <Divider className="my-4" />
                                                )}
                                            </div>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </div>

                            {state.success && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                                    <div className="text-green-800 font-semibold flex items-center gap-2">
                                        <Star className="text-green-600" size={18} />
                                        Thank you for your review!
                                    </div>
                                    {form.googleReviewLink && (
                                        <Button
                                            type="primary"
                                            href={form.googleReviewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            icon={<ExternalLink size={16} />}
                                            className="bg-blue-600 hover:bg-blue-700 border-0"
                                        >
                                            Leave a Google Review
                                        </Button>
                                    )}
                                </div>
                            )}
                            
                            {state.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-red-800 font-semibold">
                                        {state.error}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={!selectedReview || isPending}
                                loading={isPending}
                                className="w-full h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700"
                                icon={<Send size={18} />}
                            >
                                Submit Review
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Star size={48} className="mx-auto" />
                            </div>
                            <p className="text-gray-600 text-base">
                                Complete the form on the left and click "Generate Review Options" to see personalized review suggestions.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}