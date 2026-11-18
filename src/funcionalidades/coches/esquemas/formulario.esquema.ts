import { z } from "zod";
import { esquemaBaseCoche, type CocheBase } from "./base.esquema";

// Años históricos usados en los refinamientos
const YEAR_PRIMER_DIESEL = 1936;          // Mercedes-Benz 260 D
const YEAR_PRIMERA_TRACCION_TOTAL = 1903; // Spyker 60 HP

// Solo necesitamos estos tres campos para detectar repetidos
type CocheExistente = Pick<CocheBase, "marca" | "modelo" | "year">;

const normalizar = (texto: string) => texto.trim().toLowerCase();

export const crearEsquemaFormularioCoche = (cochesExistentes: CocheExistente[] = []) =>
  esquemaBaseCoche.superRefine((coche, ctx) => {
    if (coche.urlLogo === coche.urlFoto) {
      ctx.addIssue({
        code: "custom",
        path: ["urlFoto"],
        message: "La foto no puede ser la misma URL que el logo",
      });
    }

    if (coche.combustible === "diesel" && coche.year < YEAR_PRIMER_DIESEL) {
      ctx.addIssue({
        code: "custom",
        path: ["combustible"],
        message: `No existían turismos diésel antes de ${YEAR_PRIMER_DIESEL}`,
      });
    }

    if (coche.traccion === "total" && coche.year < YEAR_PRIMERA_TRACCION_TOTAL) {
      ctx.addIssue({
        code: "custom",
        path: ["traccion"],
        message: `No existían coches con tracción total antes de ${YEAR_PRIMERA_TRACCION_TOTAL}`,
      });
    }

    const repetido = cochesExistentes.some(
      (existente) =>
        normalizar(existente.marca) === normalizar(coche.marca) &&
        normalizar(existente.modelo) === normalizar(coche.modelo) &&
        existente.year === coche.year,
    );
    if (repetido) {
      ctx.addIssue({
        code: "custom",
        path: ["modelo"],
        message: `Ya existe un ${coche.marca} ${coche.modelo} de ${coche.year}`,
      });
    }
  });

export type CocheFormulario = z.infer<ReturnType<typeof crearEsquemaFormularioCoche>>;