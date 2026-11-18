import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearEsquemaFormularioCoche, type CocheFormulario } from "../esquemas/formulario.esquema";
import {
    COMBUSTIBLES, TRACCIONES,
    LIMITES_FECHA, LIMITES_POTENCIA, LIMITES_PAR, LIMITES_CILINDRADA, LIMITES_PESO,
} from "../esquemas/base.esquema";
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
            <CampoFormulario id="urlLogo" etiqueta="URL del logo" error={errors.urlLogo?.message}>
                <input type="url" placeholder="https://…" {...accesibilidad("urlLogo")} {...register("urlLogo")} />
            </CampoFormulario>

            <CampoFormulario id="marca" etiqueta="Marca" error={errors.marca?.message}>
                <input type="text" {...accesibilidad("marca")} {...register("marca")} />
            </CampoFormulario>

            <CampoFormulario id="urlFoto" etiqueta="URL de la foto" error={errors.urlFoto?.message}>
                <input type="url" placeholder="https://…" {...accesibilidad("urlFoto")} {...register("urlFoto")} />
            </CampoFormulario>

            <CampoFormulario id="modelo" etiqueta="Modelo" error={errors.modelo?.message}>
                <input type="text" {...accesibilidad("modelo")} {...register("modelo")} />
            </CampoFormulario>

            <CampoFormulario id="year" etiqueta="Año" error={errors.year?.message}>
                <input
                    type="number"
                    min={LIMITES_FECHA.MIN}
                    max={LIMITES_FECHA.MAX}
                    {...accesibilidad("year")}
                    {...register("year", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <CampoFormulario id="potenciaCv" etiqueta="Potencia (CV)" error={errors.potenciaCv?.message}>
                <input
                    type="number"
                    min={LIMITES_POTENCIA.MIN}
                    max={LIMITES_POTENCIA.MAX}
                    {...accesibilidad("potenciaCv")}
                    {...register("potenciaCv", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <CampoFormulario id="parMotorNm" etiqueta="Par motor (Nm)" error={errors.parMotorNm?.message}>
                <input
                    type="number"
                    min={LIMITES_PAR.MIN}
                    max={LIMITES_PAR.MAX}
                    {...accesibilidad("parMotorNm")}
                    {...register("parMotorNm", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <CampoFormulario id="cilindradaL" etiqueta="Cilindrada (L)" error={errors.cilindradaL?.message}>
                <input
                    type="number"
                    min={LIMITES_CILINDRADA.MIN}
                    max={LIMITES_CILINDRADA.MAX}
                    step={LIMITES_CILINDRADA.PASO}
                    {...accesibilidad("cilindradaL")}
                    {...register("cilindradaL", { valueAsNumber: true })}
                />
            </CampoFormulario>

            <CampoFormulario id="pesoKg" etiqueta="Peso (kg)" error={errors.pesoKg?.message}>
                <input
                    type="number"
                    min={LIMITES_PESO.MIN}
                    max={LIMITES_PESO.MAX}
                    {...accesibilidad("pesoKg")}
                    {...register("pesoKg", { valueAsNumber: true })}
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

            <CampoFormulario id="traccion" etiqueta="Tracción" error={errors.traccion?.message}>
                <select defaultValue="" {...accesibilidad("traccion")} {...register("traccion")}>
                    <option value="" disabled>Elige una</option>
                    {TRACCIONES.map((traccion) => (
                        <option key={traccion} value={traccion}>{traccion}</option>
                    ))}
                </select>
            </CampoFormulario>

            <button type="submit" disabled={crearCoche.isPending}>
                {crearCoche.isPending ? "Guardando…" : "Registrar coche"}
            </button>
        </form>
    );
}