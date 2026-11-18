import type { Coche } from "../esquemas/api.esquema";

// Convierte la marca en una clase CSS segura: "Alfa Romeo" → "alfa-romeo", "Citroën" → "citroen"
const claseMarca = (marca: string) =>
    marca
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita tildes y diéresis
        .trim()
        .replace(/\s+/g, "-");                             // espacios → guiones

export function TarjetaCoche({ coche }: { coche: Coche }) {
    return (
        <li className={`tarjeta-coche ${claseMarca(coche.marca)}`}>
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
                <dd>{coche.combustible}</dd>

                <dt>Tracción</dt>
                <dd>{coche.traccion}</dd>
            </dl>
        </li>
    );
}