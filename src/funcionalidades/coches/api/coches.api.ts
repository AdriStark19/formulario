import { z } from "zod";
import { peticionJson } from "../../../lib/http";
import { esquemaCocheApi, esquemaListaCochesApi, type Coche } from "../esquemas/api.esquema";
import type { CocheFormulario } from "../esquemas/formulario.esquema";

export async function obtenerCoches(): Promise<Coche[]> {
  const datos = await peticionJson("/coches");

  const resultado = esquemaListaCochesApi.safeParse(datos);
  if (!resultado.success) {
    console.error(z.prettifyError(resultado.error));
    throw new Error("El servidor ha devuelto coches con datos no válidos");
  }
  return resultado.data;
}

export async function crearCoche(coche: CocheFormulario): Promise<Coche> {
  const datos = await peticionJson("/coches", {
    method: "POST",
    body: JSON.stringify(coche),
  });

  const resultado = esquemaCocheApi.safeParse(datos);
  if (!resultado.success) {
    console.error(z.prettifyError(resultado.error));
    throw new Error("El servidor ha devuelto un coche con datos no válidos");
  }
  return resultado.data;
}