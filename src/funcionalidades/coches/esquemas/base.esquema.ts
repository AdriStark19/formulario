import { z } from "zod";

export const COMBUSTIBLES = ["gasolina", "diesel", "hibrido"] as const;
export const TRACCIONES = ["delantera", "trasera", "total"] as const;

const YEAR_ACTUAL = new Date().getFullYear();

// Todos los límites en un solo sitio.
// Exportado para reutilizarlo en los atributos min/max/step de los inputs.
export const LIMITES = {
    texto: { min: 1 },
    marca: { max: 40 },
    modelo: { max: 60 },
    year: { min: 1886, max: YEAR_ACTUAL + 1 },
    potenciaCv: { max: 10000 },
    parMotorNm: { max: 8000 },
    cilindradaL: { min: 0.6, max: 10, paso: 0.1 },
    pesoKg: { min: 400, max: 2300 },
} as const;

// El logo y la foto usan la misma regla; solo cambia el mensaje
const urlImagen = (campo: string) =>
    z.url({
        protocol: /^https?$/,
        error: `La URL de ${campo} no es válida (debe empezar por http o https)`,
    });

export const esquemaBaseCoche = z.object({
    urlLogo: urlImagen("el logo"),

    marca: z
        .string()
        .trim()
        .min(LIMITES.texto.min, { error: "La marca es obligatoria" })
        .max(LIMITES.marca.max, { error: `Máximo ${LIMITES.marca.max} caracteres` }),
    urlFoto: urlImagen("la foto"),
    modelo: z
        .string()
        .trim()
        .min(LIMITES.texto.min, { error: "El modelo es obligatorio" })
        .max(LIMITES.modelo.max, { error: `Máximo ${LIMITES.modelo.max} caracteres` }),

    year: z
        .int({ error: "Introduce un año válido" })
        .min(LIMITES.year.min, { error: `No existen coches anteriores a ${LIMITES.year.min}` })
        .max(LIMITES.year.max, { error: `El año no puede ser posterior a ${LIMITES.year.max}` }),
    potenciaCv: z
        .int({ error: "La potencia debe ser un número entero" })
        .positive({ error: "La potencia debe ser mayor que 0" })
        .max(LIMITES.potenciaCv.max, { error: `Máximo ${LIMITES.potenciaCv.max} CV` }),
    parMotorNm: z
        .int({ error: "El par debe ser un número entero" })
        .positive({ error: "El par debe ser mayor que 0" })
        .max(LIMITES.parMotorNm.max, { error: `Máximo ${LIMITES.parMotorNm.max} Nm` }),
    cilindradaL: z
        .number({ error: "Introduce la cilindrada en litros" })
        .multipleOf(LIMITES.cilindradaL.paso, { error: "Usa un solo decimal (p. ej. 1.8)" })
        .min(LIMITES.cilindradaL.min, { error: `Mínimo ${LIMITES.cilindradaL.min} L` })
        .max(LIMITES.cilindradaL.max, { error: `Máximo ${LIMITES.cilindradaL.max} L` }),
    pesoKg: z
        .int({ error: "El peso debe ser un número entero" })
        .min(LIMITES.pesoKg.min, { error: `Mínimo ${LIMITES.pesoKg.min} kg` })
        .max(LIMITES.pesoKg.max, { error: `Máximo ${LIMITES.pesoKg.max} kg` }),

    combustible: z.enum(COMBUSTIBLES, { error: "Elige un combustible" }),
    traccion: z.enum(TRACCIONES, { error: "Elige un tipo de tracción" }),
});

export type CocheBase = z.infer<typeof esquemaBaseCoche>;