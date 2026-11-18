import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarCoche } from "../api/coches.api";
import { clavesCoches } from "../api/claves";

export function useBorrarCoche() {
  const clienteQuery = useQueryClient();

  return useMutation({
    mutationFn: borrarCoche,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: clavesCoches.todos }),
  });
}
