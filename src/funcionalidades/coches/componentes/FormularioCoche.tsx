import { useEffect, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearEsquemaFormularioCoche, type CocheFormulario } from "../esquemas/formulario.esquema";
import {
    COMBUSTIBLES, TRACCIONES,
    LIMITES_FECHA, LIMITES_POTENCIA, LIMITES_PAR, LIMITES_CILINDRADA, LIMITES_PESO,
} from "../esquemas/base.esquema";
import type { Coche } from "../esquemas/api.esquema";
import { CampoFormulario } from "./CampoFormulario";
import { BannerError } from "./BannerError";
import { useCoches } from "../hooks/useCoches";
import { useCrearCoche } from "../hooks/useCrearCoche";
import { useActualizarCoche } from "../hooks/useActualizarCoche";
import { useBorrarCoches } from "../hooks/useBorrarCoches";

// Formulario en blanco (los undefined dejan los inputs vacíos)
const FORMULARIO_VACIO: DefaultValues<CocheFormulario> = {
    urlLogo: "",
    marca: "",
    urlFoto: "",
    modelo: "",
    year: undefined,
    potenciaCv: undefined,
    parMotorNm: undefined,
    cilindradaL: undefined,
    pesoKg: undefined,
    combustible: undefined,
    traccion: undefined,
};

type Props = {
    cocheEditando: Coche | null;
    alTerminarEdicion: () => void;
};

export function FormularioCoche({ cocheEditando, alTerminarEdicion }: Props) {
    // Para detectar repetidos: todos los coches menos el que se está editando
    const { data } = useCoches();
    const coches = data?.coches ?? [];
    const cochesExistentes = cocheEditando
        ? coches.filter((coche) => coche.id !== cocheEditando.id)
        : coches;
    const esquema = crearEsquemaFormularioCoche(cochesExistentes);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CocheFormulario>({
        resolver: zodResolver(esquema),
        defaultValues: FORMULARIO_VACIO,
    });

    const crearCoche = useCrearCoche();
    const borrarTodos = useBorrarCoches();
    const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

    // Todos los ids: los válidos y los corruptos que tengan id
    const idsTodos = [...coches.map((coche) => coche.id), ...(data?.idsDescartados ?? [])];

    function borrarTodosLosCoches() {
        borrarTodos.mutate(idsTodos, {
            onSuccess: () => {
                setConfirmandoBorrado(false);
                if (cocheEditando) alTerminarEdicion(); // el coche en edición ya no existe
            },
        });
    }
    const actualizarCoche = useActualizarCoche();
    const mutacion = cocheEditando ? actualizarCoche : crearCoche;

    // Al pulsar "Editar" en una tarjeta, se rellenan los campos con ese coche
    useEffect(() => {
        if (cocheEditando) {
            // El id sobra en el formulario, pero no molesta: Zod lo descarta al validar
            reset(cocheEditando);
        } else {
            reset(FORMULARIO_VACIO);
        }
    }, [cocheEditando, reset]);

    function alEnviar(datos: CocheFormulario) {
        if (cocheEditando) {
            actualizarCoche.mutate(
                { id: cocheEditando.id, coche: datos },
                { onSuccess: () => alTerminarEdicion() },
            );
        } else {
            crearCoche.mutate(datos, {
                onSuccess: () => reset(FORMULARIO_VACIO),
            });
        }
    }

    // Atributos de accesibilidad comunes a todos los inputs
    const accesibilidad = (campo: keyof CocheFormulario) => ({
        id: campo,
        "aria-invalid": errors[campo] ? true : undefined,
        "aria-describedby": errors[campo] ? `${campo}-error` : undefined,
    });

    return (
        <form onSubmit={handleSubmit(alEnviar)} noValidate autoComplete="off" aria-labelledby="titulo-formulario">
            <h2 id="titulo-formulario">
                {cocheEditando ? `Editando ${cocheEditando.marca} ${cocheEditando.modelo}` : "Nuevo coche"}
            </h2>

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

            <div className="acciones-formulario">
                <button type="submit" disabled={mutacion.isPending}>
                    {mutacion.isPending
                        ? "Guardando…"
                        : cocheEditando ? "Guardar cambios" : "Registrar coche"}
                </button>
                {cocheEditando && (
                    <button type="button" onClick={alTerminarEdicion} disabled={mutacion.isPending}>
                        Cancelar edición
                    </button>
                )}

                {confirmandoBorrado ? (
                    <span className="confirmar-borrado">
                        ¿Borrar {idsTodos.length === 1 ? "el coche" : `los ${idsTodos.length} coches`}?
                        <button
                            type="button"
                            className="peligro"
                            onClick={borrarTodosLosCoches}
                            disabled={borrarTodos.isPending}
                        >
                            {borrarTodos.isPending ? "Borrando…" : "Sí, borrar todos"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirmandoBorrado(false)}
                            disabled={borrarTodos.isPending}
                        >
                            Cancelar
                        </button>
                    </span>
                ) : (
                    <button
                        type="button"
                        className="peligro"
                        onClick={() => setConfirmandoBorrado(true)}
                        disabled={idsTodos.length === 0 || mutacion.isPending}
                    >
                        Borrar todos
                    </button>
                )}
            </div>

            {borrarTodos.isError && (
                <BannerError mensaje={`No se han podido borrar: ${borrarTodos.error.message}`} />
            )}

            {mutacion.isError && (
                <BannerError mensaje={`No se ha podido guardar: ${mutacion.error.message}`} />
            )}
            {crearCoche.isSuccess && !cocheEditando && (
                <p className="exito" role="status">Coche registrado correctamente.</p>
            )}
        </form>
    );
}