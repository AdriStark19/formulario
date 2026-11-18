import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarCoche } from "../api/coches.api";
import { clavesCoches } from "../api/claves";
import type { CocheFormulario } from "../esquemas/formulario.esquema";

export function useActualizarCoche() {
  const clienteQuery = useQueryClient();

  return useMutation({
    mutationFn: ({ id, coche }: { id: string; coche: CocheFormulario }) => actualizarCoche(id, coche),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: clavesCoches.todos }),
  });
}
