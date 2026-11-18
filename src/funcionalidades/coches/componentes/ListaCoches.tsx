import { useCoches } from "../hooks/useCoches";
import { useBorrarCoches } from "../hooks/useBorrarCoches";
import { TarjetaCoche } from "./TarjetaCoche";
import { Cargando } from "./Cargando";
import { BannerError } from "./BannerError";
import type { Coche } from "../esquemas/api.esquema";

type Props = {
    idEditando: string | null;
    alEditar: (coche: Coche) => void;
};

export function ListaCoches({ idEditando, alEditar }: Props) {
    const { data, isPending, isError, error, refetch } = useCoches();
    const borrarCorruptos = useBorrarCoches();

    function pintarContenido() {
        if (isPending) {
            return <Cargando texto="Cargando coches…" />;
        }

        if (isError) {
            return <BannerError mensaje={error.message} alReintentar={() => refetch()} />;
        }

        const { coches, descartados, idsDescartados } = data;

        const aviso = descartados > 0 && (
            <div className="aviso" role="status">
                <p>
                    {descartados === 1
                        ? "⚠ 1 coche tenía datos no válidos y se ha ocultado."
                        : `⚠ ${descartados} coches tenían datos no válidos y se han ocultado.`}
                </p>
                {idsDescartados.length > 0 && (
                    <button
                        type="button"
                        onClick={() => borrarCorruptos.mutate(idsDescartados)}
                        disabled={borrarCorruptos.isPending}
                    >
                        {borrarCorruptos.isPending ? "Borrando…" : "Borrar los no válidos"}
                    </button>
                )}
                {borrarCorruptos.isError && (
                    <p className="error-accion" role="alert">
                        No se han podido borrar: {borrarCorruptos.error.message}
                    </p>
                )}
            </div>
        );

        if (coches.length === 0) {
            return (
                <>
                    {aviso}
                    <p>Todavía no hay coches. ¡Registra el primero!</p>
                </>
            );
        }

        return (
            <>
            {aviso}
            <ul className="lista-coches">
                {coches.map((coche) => (
                    <TarjetaCoche
                        key={coche.id}
                        coche={coche}
                        editando={coche.id === idEditando}
                        alEditar={alEditar}
                    />
                ))}
            </ul>
            </>
        );
    }

    return (
        <section aria-labelledby="titulo-lista">
            <h2 id="titulo-lista">Coches registrados</h2>
            {pintarContenido()}
        </section>
    );
}