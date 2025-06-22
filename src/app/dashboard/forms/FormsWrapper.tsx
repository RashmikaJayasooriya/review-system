import FormsList from './FormsList';
import { getForms } from './actions';

export default async function FormsWrapper() {
    const forms = await getForms();
    const data = forms.map(f => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
    }));
    return <FormsList initialForms={data} />;
}