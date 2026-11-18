import { useState } from "react";
import type { Coche } from "../esquemas/api.esquema";
import { useBorrarCoche } from "../hooks/useBorrarCoche";

// Convierte la marca en una clase CSS segura: "Alfa Romeo" → "alfa-romeo", "Citroën" → "citroen"
const claseMarca = (marca: string) =>
    marca
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita tildes y diéresis
        .trim()
        .replace(/\s+/g, "-");                             // espacios → guiones

type Props = {
    coche: Coche;
    editando: boolean;
    alEditar: (coche: Coche) => void;
};

export function TarjetaCoche({ coche, editando, alEditar }: Props) {
    const borrarCoche = useBorrarCoche();
    const [confirmando, setConfirmando] = useState(false);
    const nombre = `${coche.marca} ${coche.modelo}`;

    return (
        <li className={`tarjeta-coche ${claseMarca(coche.marca)}${editando ? " editando" : ""}`}>
            <header>
                <img src={coche.urlLogo} alt={`Logo de ${coche.marca}`} />
                <h3>{coche.marca} {coche.modelo}</h3>
            </header>

            <img src={coche.urlFoto} alt={`${coche.marca} ${coche.modelo}`} />

            <dl>
                <dt>Año</dt>
                <dd>{coche.year}</dd>

                <dt>Potencia</dt>
                <dd>{coche.potenciaCv} CV</dd>

                <dt>Par motor</dt>
                <dd>{coche.parMotorNm} Nm</dd>

                <dt>Cilindrada</dt>
                <dd>{coche.cilindradaL} L</dd>

                <dt>Peso</dt>
                <dd>{coche.pesoKg} kg</dd>

                <dt>Combustible</dt>
                <dd className="capitalizar">{coche.combustible}</dd>

                <dt>Tracción</dt>
                <dd className="capitalizar">{coche.traccion}</dd>
            </dl>

            <div className="acciones">
                {confirmando ? (
                    <>
                        <span>¿Borrar {nombre}?</span>
                        <button
                            type="button"
                            className="peligro"
                            onClick={() => borrarCoche.mutate(coche.id)}
                            disabled={borrarCoche.isPending}
                        >
                            {borrarCoche.isPending ? "Borrando…" : "Sí, borrar"}
                        </button>
                        <button type="button" onClick={() => setConfirmando(false)} disabled={borrarCoche.isPending}>
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" onClick={() => alEditar(coche)} disabled={editando}>
                            {editando ? "Editando…" : "Editar"}
                        </button>
                        <button
                            type="button"
                            className="peligro"
                            onClick={() => setConfirmando(true)}
                            disabled={editando}
                        >
                            Borrar
                        </button>
                    </>
                )}
            </div>

            {borrarCoche.isError && (
                <p className="error-accion" role="alert">
                    No se ha podido borrar: {borrarCoche.error.message}
                </p>
            )}
        </li>
    );
}