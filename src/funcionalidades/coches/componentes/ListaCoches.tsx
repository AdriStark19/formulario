import { useCoches } from "../hooks/useCoches";
import { TarjetaCoche } from "./TarjetaCoche";
import { Cargando } from "./Cargando";
import { BannerError } from "./BannerError";

export function ListaCoches() {
    const { data: coches, isPending, isError, error, refetch } = useCoches();

    function pintarContenido() {
        if (isPending) {
            return <Cargando texto="Cargando coches…" />;
        }

        if (isError) {
            return <BannerError mensaje={error.message} alReintentar={() => refetch()} />;
        }

        if (coches.length === 0) {
            return <p>Todavía no hay coches. ¡Registra el primero!</p>;
        }

        return (
            <ul className="lista-coches">
                {coches.map((coche) => (
                    <TarjetaCoche key={coche.id} coche={coche} />
                ))}
            </ul>
        );
    }

    return (
        <section aria-labelledby="titulo-lista">
            <h2 id="titulo-lista">Coches registrados</h2>
            {pintarContenido()}
        </section>
    );
}