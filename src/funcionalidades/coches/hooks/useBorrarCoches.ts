import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarCoches } from "../api/coches.api";
import { clavesCoches } from "../api/claves";

export function useBorrarCoches() {
  const clienteQuery = useQueryClient();

  return useMutation({
    mutationFn: borrarCoches,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: clavesCoches.todos }),
  });
}
