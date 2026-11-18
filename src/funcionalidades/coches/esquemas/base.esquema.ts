import { z } from "zod";

export const COMBUSTIBLES = ["gasolina", "diesel", "hibrido"] as const;
export const TRACCIONES = ["delantera", "trasera", "total"] as const;

const YEAR_ACTUAL = new Date().getFullYear();

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
        .min(1, { error: "La marca es obligatoria" })
        .max(40, { error: "Máximo 40 caracteres" }),
    urlFoto: urlImagen("la foto"),
    modelo: z
        .string()
        .trim()
        .min(1, { error: "El modelo es obligatorio" })
        .max(60, { error: "Máximo 60 caracteres" }),

    year: z
        .int({ error: "Introduce un año válido" })
        .min(1886, { error: "No existen coches anteriores a 1886" })
        .max(YEAR_ACTUAL + 1, { error: `El año no puede ser posterior a ${YEAR_ACTUAL + 1}` }),
    potenciaCv: z
        .int({ error: "La potencia debe ser un número entero" })
        .positive({ error: "La potencia debe ser mayor que 0" })
        .max(2000, { error: "Máximo 2000 CV" }),
    parMotorNm: z
        .int({ error: "El par debe ser un número entero" })
        .positive({ error: "El par debe ser mayor que 0" })
        .max(3000, { error: "Máximo 3000 Nm" }),

    traccion: z.enum(TRACCIONES, { error: "Elige un tipo de tracción" }),

    combustible: z.enum(COMBUSTIBLES, { error: "Elige un combustible" }),


});

export type CocheBase = z.infer<typeof esquemaBaseCoche>;