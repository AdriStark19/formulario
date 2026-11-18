import { useForm } from 'react-hook-form';

export function FormularioCoche(){
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    function onSubmit(data) { console.log(data); }

     return
}
