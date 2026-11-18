import { z } from "zod";
import { peticionJson } from "../../../lib/http";
import { esquemaCocheApi, type Coche } from "../esquemas/api.esquema";
import type { CocheFormulario } from "../esquemas/formulario.esquema";

// Los coches válidos y cuántos se han descartado por traer datos corruptos
export type ResultadoCoches = {
  coches: Coche[];
  descartados: number;
  idsDescartados: string[]; // ids de los descartados que se pueden borrar (los que traen id)
};

// Para recuperar el id de un coche corrupto, aunque el resto de campos esté mal
const esquemaSoloId = z.object({ id: z.string() });

export async function obtenerCoches(): Promise<ResultadoCoches> {
  const datos = await peticionJson("/coches");

  // La respuesta tiene que ser al menos una lista
  const lista = z.array(z.unknown()).safeParse(datos);
  if (!lista.success) {
    throw new Error("El servidor no ha devuelto una lista de coches");
  }

  // Cada coche se valida por separado: uno corrupto no tumba a los demás
  const coches: Coche[] = [];
  let descartados = 0;
  const idsDescartados: string[] = [];

  for (const elemento of lista.data) {
    const resultado = esquemaCocheApi.safeParse(elemento);
    if (resultado.success) {
      coches.push(resultado.data);
    } else {
      descartados++;
      const conId = esquemaSoloId.safeParse(elemento);
      if (conId.success) {
        idsDescartados.push(conId.data.id);
      }
      console.error("Coche descartado por datos no válidos:\n" + z.prettifyError(resultado.error), elemento);
    }
  }

  return { coches, descartados, idsDescartados };
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
export async function actualizarCoche(id: string, coche: CocheFormulario): Promise<Coche> {
  const datos = await peticionJson(`/coches/${id}`, {
    method: "PUT",
    body: JSON.stringify(coche),
  });

  const resultado = esquemaCocheApi.safeParse(datos);
  if (!resultado.success) {
    console.error(z.prettifyError(resultado.error));
    throw new Error("El servidor ha devuelto un coche con datos no válidos");
  }
  return resultado.data;
}

export async function borrarCoche(id: string): Promise<void> {
  await peticionJson(`/coches/${id}`, { method: "DELETE" });
}

// json-server no tiene borrado múltiple: se borra uno a uno, todos a la vez
export async function borrarCoches(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => borrarCoche(id)));
}
