import { z } from "zod";
import { esquemaBaseCoche } from "./base.esquema";

export const esquemaCocheApi = esquemaBaseCoche.extend({
  id: z.string(),
});

export const esquemaListaCochesApi = z.array(esquemaCocheApi);

export type Coche = z.infer<typeof esquemaCocheApi>;