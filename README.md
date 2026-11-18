# 🏁 REGISTRA COCHES DEPORTIVOS

  M4 Full Contact Forms
  **Tecnologías:** React 19 · TypeScript · Vite · Vitest

## Cómo probarlo



## Uso de IA

-

## Autopsia

- La IA me dio en opciones de combustible "eléctrico" y lo he quitado porque es una página para amantes de los deportivos tradicionales que de verdad transmiten algo.

- He pedido a la IA que cambie los números literales que me soltó en un primer momento por constantes.

- La IA propuso un refinamiento que limitaba la relación par/potencia entre 0,5 y 3,5 Nm/CV. Lo he quitado porque el par y la potencia no tienen una relación fija (depende de las revoluciones) y rechazaba coches reales, como el Ford T (~5,6 Nm/CV).

- La IA propuso impedir que el modelo empezara por el nombre de la marca para evitar cosas como "Alpine Alpine A110". Lo he rechazado porque falla con marcas reales como MINI ("Mini Cooper").

- La IA propuso la cilindrada en centímetros cúbicos y opcional. La he cambiado a litros con un decimal (1.8, 6.2), que es como se expresa normalmente, y obligatoria al no haber eléctricos.

- La IA propuso unos rangos de potencia, par y peso más estrechos (hasta 2000 CV, 3000 Nm y 400–5000 kg). Los he ajustado a lo común entre vehículos deportivos.

- La IA propuso como refinamientos la relación peso/potencia (kg/CV), la potencia por litro (CV/L) y que modelo fuese distinto de marca. No los he usado; he elegido en su lugar las reglas de diésel desde 1936, tracción total desde 1903 y coches no repetidos porque sí son cosas inamovibles basadas en datos históricos hay coches que sí tienen una relación peso potencia 1:1 o incluso superior como un F1. Además el Mini original tenía el mismo nombre que la marca y hay algún caso más.

- Exportación límites como constantes agrupados por campo en lugar de por ejemplo potencia.cv(min 1, max 3500)