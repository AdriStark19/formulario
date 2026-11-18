import { useQuery } from "@tanstack/react-query";
import { obtenerCoches } from "../api/coches.api";
import { clavesCoches } from "../api/claves";

export function useCoches() {
  return useQuery({
    queryKey: clavesCoches.lista(),
    queryFn: obtenerCoches,
  });
}