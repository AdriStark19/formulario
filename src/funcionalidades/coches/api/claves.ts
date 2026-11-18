export const clavesCoches = {
  todos: ["coches"] as const,
  lista: () => [...clavesCoches.todos, "lista"] as const,
};