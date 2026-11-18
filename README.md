# 🏁 REGISTRA COCHES DEPORTIVOS

  M4 Full Contact Forms
  **Tecnologías:** React 19 · TypeScript · Vite · Vitest

## Cómo probarlo
Necesitas dos terminales, una para la API falsa y otra para la web:

```bash
npm install
npm run api   # json-server en http://localhost:3001/coches (lee db.json)
npm run dev   # la app en http://localhost:5173
```

La URL de la API se lee del archivo `.env` (`VITE_URL_API`), que está incluido en el repo.
Si cambias el `.env`, reinicia `npm run dev` para que Vite lo vuelva a leer.

**Qué probar**
- **Validación:** enviar el formulario vacío o con datos fuera de rango; cada campo muestra su error.
- **Refinamientos:** un diésel anterior a 1936, tracción total anterior a 1903, la misma URL en
  logo y foto, o un coche repetido (marca + modelo + año).
- **Crear, editar y borrar:** la lista se actualiza sola tras cada cambio, sin recargar la página.
- **Error de red:** parar `npm run api` y recargar; sale el aviso con botón de reintentar.
- **Dato corrupto (bonus):** editar a mano un coche en `db.json` (por ejemplo
  `"potenciaCv": "cafetera"`); ese coche se oculta, el resto se sigue mostrando, aparece un aviso
  con opción de borrarlo y en la consola (F12) se ve qué campo falla.

## Uso de IA

- He utilizado Claude para ir construyendo el código por bloques. En algunos casos he copiado el
  código completo tras revisarlo y pedir los cambios; en otros he ido más línea a línea,
  escribiendo yo el código y usando Claude para revisarlo y corregir errores.
- CSS y HTML (el JSX de los componentes) completamente delegados en Claude, dándole las pautas de
  diseño que quería: colores de Alpine y Renault para la página y los colores de cada marca en
  las tarjetas.
- Claude ha propuesto la estructura de carpetas, los esquemas de Zod, los hooks de TanStack Query
  y la gestión de errores. Las decisiones de qué entraba y qué no son mías y están explicadas en
  la autopsia.
- Los datos de algunos coches de ejemplo en `db.json` los ha buscado Claude en fuentes técnicas mientras que otros los he buscado yo o rellenado porque los conozco.
  (fabricantes y prensa especializada), y las imágenes son de Wikimedia Commons.

## Autopsia

- La IA me dio en opciones de combustible "eléctrico" y lo he quitado porque es una página para amantes de los deportivos tradicionales que de verdad transmiten algo.

- He pedido a la IA que cambie los números literales que me soltó en un primer momento por constantes.

- La IA propuso un refinamiento que limitaba la relación par/potencia entre 0,5 y 3,5 Nm/CV. Lo he quitado porque el par y la potencia no tienen una relación fija (depende de las revoluciones) y rechazaba coches reales, como el Ford T (~5,6 Nm/CV).

- La IA propuso impedir que el modelo empezara por el nombre de la marca para evitar cosas como "Alpine Alpine A110". Lo he rechazado porque falla con marcas reales como MINI ("Mini Cooper").

- La IA propuso la cilindrada en centímetros cúbicos y opcional. La he cambiado a litros con un decimal (1.8, 6.2), que es como se expresa normalmente, y obligatoria al no haber eléctricos.

- La IA propuso unos rangos de potencia, par y peso más estrechos (hasta 2000 CV, 3000 Nm y 400–5000 kg). Los he ajustado a lo común entre vehículos deportivos.

- La IA propuso como refinamientos la relación peso/potencia (kg/CV), la potencia por litro (CV/L) y que modelo fuese distinto de marca. No los he usado; he elegido en su lugar las reglas de diésel desde 1936, tracción total desde 1903 y coches no repetidos porque sí son cosas inamovibles basadas en datos históricos hay coches que sí tienen una relación peso potencia 1:1 o incluso superior como un F1. Además el Mini original tenía el mismo nombre que la marca y hay algún caso más.

- Exportación límites como constantes agrupados por campo en lugar de por ejemplo potencia.cv(min 1, max 3500)