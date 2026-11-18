export function Cargando({ texto }: { texto: string }) {
    return (
        <p className="cargando" role="status">
            {texto}
        </p>
    );
}