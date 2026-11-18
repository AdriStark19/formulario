import { FormularioCoche } from "./funcionalidades/coches/componentes/FormularioCoche";
import { ListaCoches } from "./funcionalidades/coches/componentes/ListaCoches";
export default function App() {
  return (
    <main>
      <h1>Registra coches deportivos</h1>
      <FormularioCoche />
      <ListaCoches/>
    </main>
  );
}