export const URL_API = import.meta.env.VITE_URL_API;

// Hace la petición y lanza un error si el servidor no responde con 2xx.
// Devuelve unknown a propósito: quien llama tiene que validar con Zod.
export async function peticionJson(ruta: string, opciones?: RequestInit): Promise<unknown> {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al llamar a ${ruta}`);
  }

  return respuesta.json();
}