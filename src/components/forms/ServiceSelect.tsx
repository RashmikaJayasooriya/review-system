import { Select } from 'antd';
import { useSearchFilter } from '@/app/dashboard/forms/SearchFilterContext';

interface ServiceOption {
    id: string;
    name: string;
}

interface Props {
    services: ServiceOption[];
}

export default function ServiceSelect({ services }: Props) {
    const { serviceId, setServiceId } = useSearchFilter();
    return (
        <Select
            value={serviceId}
            onChange={setServiceId}
            className="lg:w-64"
            size="large"
        >
            <Select.Option value="all">All Services</Select.Option>
            {services.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                    {s.name}
                </Select.Option>
            ))}
        </Select>
    );
}