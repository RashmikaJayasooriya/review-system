"use client";
import { Input, Select } from 'antd';
import { Search } from 'lucide-react';
import { useSearchFilter } from './SearchContext';

interface FormOption {
    id: string;
    title: string;
}
interface Props {
    forms: FormOption[];
}

export default function ResponsesHeader({ forms }: Props) {
    const { searchTerm, setSearchTerm, formId, setFormId } = useSearchFilter();

    return (
        <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-gray-600 mt-1">Customer feedback collected from your forms</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search reviews…"
                    prefix={<Search size={16} className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:w-80"
                    size="large"
                    allowClear
                />
                <Select
                    value={formId}
                    onChange={(v) => setFormId(v)}
                    className="sm:w-64"
                    size="large"
                >
                    <Select.Option value="all">All Forms</Select.Option>
                    {forms.map((f) => (
                        <Select.Option key={f.id} value={f.id}>
                            {f.title}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </div>
    );
}