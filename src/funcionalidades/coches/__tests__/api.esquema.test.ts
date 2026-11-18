import { afterEach, describe, expect, it, vi } from "vitest";
import { esquemaCocheApi } from "../esquemas/api.esquema";
import { obtenerCoches } from "../api/coches.api";

// Un coche correcto tal y como lo devolvería json-server
const cocheValido = {
  id: "a110",
  urlLogo: "https://logotyp.us/file/renault.svg",
  marca: "Alpine",
  urlFoto: "https://example.com/a110.jpg",
  modelo: "A110",
  year: 2022,
  potenciaCv: 252,
  parMotorNm: 320,
  cilindradaL: 1.8,
  pesoKg: 1103,
  combustible: "gasolina",
  traccion: "trasera",
};

describe("esquemaCocheApi", () => {
  it("acepta un coche correcto", () => {
    expect(esquemaCocheApi.safeParse(cocheValido).success).toBe(true);
  });

  it("rechaza un número que llega como texto", () => {
    const resultado = esquemaCocheApi.safeParse({ ...cocheValido, potenciaCv: "cafetera" });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(["potenciaCv"]);
    }
  });

  it("rechaza una URL con un protocolo que no es http/https", () => {
    const resultado = esquemaCocheApi.safeParse({ ...cocheValido, urlFoto: "hps://example.com/a110.jpg" });
    expect(resultado.success).toBe(false);
  });

  it("rechaza un combustible que no está en la lista", () => {
    const resultado = esquemaCocheApi.safeParse({ ...cocheValido, combustible: "electrico" });
    expect(resultado.success).toBe(false);
  });

  it("rechaza un coche sin id", () => {
    const { id: _id, ...sinId } = cocheValido; // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(esquemaCocheApi.safeParse(sinId).success).toBe(false);
  });
});

describe("obtenerCoches (respuesta del servidor simulada)", () => {
  // Sustituye fetch por uno falso que devuelve los datos indicados
  function simularRespuesta(datos: unknown, estado = 200) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(datos), { status: estado })),
    );
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("descarta el coche corrupto y conserva los válidos", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // silencia el log del descarte
    simularRespuesta([cocheValido, { ...cocheValido, id: "roto", potenciaCv: "cafetera" }]);

    const resultado = await obtenerCoches();

    expect(resultado.coches).toHaveLength(1);
    expect(resultado.coches[0].id).toBe("a110");
    expect(resultado.descartados).toBe(1);
    expect(resultado.idsDescartados).toEqual(["roto"]);
  });

  it("lanza un error si la respuesta no es una lista", async () => {
    simularRespuesta({ mensaje: "esto no es una lista" });
    await expect(obtenerCoches()).rejects.toThrow("El servidor no ha devuelto una lista de coches");
  });

  it("lanza un error si el servidor responde con un error HTTP", async () => {
    simularRespuesta([], 500);
    await expect(obtenerCoches()).rejects.toThrow("Error 500");
  });
});
