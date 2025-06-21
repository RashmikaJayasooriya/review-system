import ServicesClient from './ServicesClient';
import {getServices} from './actions';
import {Service} from '@/types';

export default async function ServicesWrapper() {
    const services: Service[] = await getServices();
    return <ServicesClient initialServices={services} />;
}