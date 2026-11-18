import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCoche } from "../api/coches.api";
import { clavesCoches } from "../api/claves";

export function useCrearCoche() {
  const clienteQuery = useQueryClient();

  return useMutation({
    mutationFn: crearCoche,
    // Al guardar, la lista queda desactualizada: se invalida para que se vuelva a pedir
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: clavesCoches.todos }),
  });
}