import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearEsquemaFormularioCoche, type CocheFormulario } from "../esquemas/formulario.esquema";
import { COMBUSTIBLES, LIMITES } from "../esquemas/base.esquema";
import { CampoFormulario } from "./CampoFormulario";
import { useCrearCoche } from "../hooks/useCrearCoche";
const esquema = crearEsquemaFormularioCoche();

export function FormularioCoche() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CocheFormulario>({ resolver: zodResolver(esquema) });
    const crearCoche = useCrearCoche();

    function alEnviar(datos: CocheFormulario) {
        crearCoche.mutate(datos, {
            onSuccess: () => reset(), // vacía el formulario tras guardar
        });
    }

    // Atributos de accesibilidad comunes a todos los inputs
    const accesibilidad = (campo: keyof CocheFormulario) => ({
        id: campo,
        "aria-invalid": errors[campo] ? true : undefined,
        "aria-describedby": errors[campo] ? `${campo}-error` : undefined,
    });

    return (
        <form onSubmit={handleSubmit(alEnviar)} noValidate>
            <CampoFormulario id="marca" etiqueta="Marca" error={errors.marca?.message}>
                <input type="text" {...accesibilidad("marca")} {...register("marca")} />
            </CampoFormulario>

            <CampoFormulario id="year" etiqueta="Año" error={errors.year?.message}>
                <input
                    type="number"
                    min={LIMITES.year.min}
                    max={LIMITES.year.max}
                    {...accesibilidad("year")}
                    {...register("year", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <CampoFormulario id="combustible" etiqueta="Combustible" error={errors.combustible?.message}>
                <select defaultValue="" {...accesibilidad("combustible")} {...register("combustible")}>
                    <option value="" disabled>Elige uno</option>
                    {COMBUSTIBLES.map((combustible) => (
                        <option key={combustible} value={combustible}>{combustible}</option>
                    ))}
                </select>
            </CampoFormulario>

            <button type="submit" disabled={crearCoche.isPending}>
                {crearCoche.isPending ? "Guardando…" : "Registrar coche"}
            </button>
        </form>
    );
}