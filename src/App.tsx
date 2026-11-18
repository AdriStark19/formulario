import { useState } from "react";
import { FormularioCoche } from "./funcionalidades/coches/componentes/FormularioCoche";
import { ListaCoches } from "./funcionalidades/coches/componentes/ListaCoches";
import type { Coche } from "./funcionalidades/coches/esquemas/api.esquema";

export default function App() {
  const [cocheEditando, setCocheEditando] = useState<Coche | null>(null);

  function editar(coche: Coche) {
    setCocheEditando(coche);
    window.scrollTo({ top: 0, behavior: "smooth" }); // sube al formulario
  }

  return (
    <main>
      <h1>Registra coches deportivos</h1>
      <FormularioCoche cocheEditando={cocheEditando} alTerminarEdicion={() => setCocheEditando(null)} />
      <ListaCoches idEditando={cocheEditando?.id ?? null} alEditar={editar} />
    </main>
  );
}
