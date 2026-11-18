import { z } from "zod";

export const COMBUSTIBLES = ["gasolina", "diesel", "hibrido"] as const;
export const TRACCIONES = ["delantera", "trasera", "total"] as const;

const YEAR_ACTUAL = new Date().getFullYear();

// Límites agrupados por dato.
// Exportados para reutilizarlos en los atributos min/max/step de los inputs.
export const LIMITES_TEXTO = { MIN: 1, MAX_MARCA: 40, MAX_MODELO: 60 } as const;
export const LIMITES_FECHA = { MIN: 1886, MAX: YEAR_ACTUAL + 1 } as const;
export const LIMITES_POTENCIA = { MIN: 1, MAX: 10000 } as const;
export const LIMITES_PAR = { MIN: 1, MAX: 8000 } as const;
export const LIMITES_CILINDRADA = { MIN: 0.6, MAX: 10, PASO: 0.1 } as const;
export const LIMITES_PESO = { MIN: 400, MAX: 2300 } as const;

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
        .min(LIMITES_TEXTO.MIN, { error: "La marca es obligatoria" })
        .max(LIMITES_TEXTO.MAX_MARCA, { error: `Máximo ${LIMITES_TEXTO.MAX_MARCA} caracteres` }),
    urlFoto: urlImagen("la foto"),
    modelo: z
        .string()
        .trim()
        .min(LIMITES_TEXTO.MIN, { error: "El modelo es obligatorio" })
        .max(LIMITES_TEXTO.MAX_MODELO, { error: `Máximo ${LIMITES_TEXTO.MAX_MODELO} caracteres` }),

    year: z
        .int({ error: "Introduce un año válido" })
        .min(LIMITES_FECHA.MIN, { error: `No existen coches anteriores a ${LIMITES_FECHA.MIN}` })
        .max(LIMITES_FECHA.MAX, { error: `El año no puede ser posterior a ${LIMITES_FECHA.MAX}` }),
    potenciaCv: z
        .int({ error: "La potencia debe ser un número entero" })
        .min(LIMITES_POTENCIA.MIN, { error: `Mínimo ${LIMITES_POTENCIA.MIN} CV` })
        .max(LIMITES_POTENCIA.MAX, { error: `Máximo ${LIMITES_POTENCIA.MAX} CV` }),
    parMotorNm: z
        .int({ error: "El par debe ser un número entero" })
        .min(LIMITES_PAR.MIN, { error: `Mínimo ${LIMITES_PAR.MIN} Nm` })
        .max(LIMITES_PAR.MAX, { error: `Máximo ${LIMITES_PAR.MAX} Nm` }),
    cilindradaL: z
        .number({ error: "Introduce la cilindrada en litros" })
        .multipleOf(LIMITES_CILINDRADA.PASO, { error: "Usa un solo decimal (p. ej. 1.8)" })
        .min(LIMITES_CILINDRADA.MIN, { error: `Mínimo ${LIMITES_CILINDRADA.MIN} L` })
        .max(LIMITES_CILINDRADA.MAX, { error: `Máximo ${LIMITES_CILINDRADA.MAX} L` }),
    pesoKg: z
        .int({ error: "El peso debe ser un número entero" })
        .min(LIMITES_PESO.MIN, { error: `Mínimo ${LIMITES_PESO.MIN} kg` })
        .max(LIMITES_PESO.MAX, { error: `Máximo ${LIMITES_PESO.MAX} kg` }),

    combustible: z.enum(COMBUSTIBLES, { error: "Elige un combustible" }),
    traccion: z.enum(TRACCIONES, { error: "Elige un tipo de tracción" }),
});

export type CocheBase = z.infer<typeof esquemaBaseCoche>;