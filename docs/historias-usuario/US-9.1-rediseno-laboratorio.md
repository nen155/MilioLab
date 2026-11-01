# US-9.1 — Rediseño «cuaderno de laboratorio»

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual |
| **Rol** | Visitante |
| **Requisitos** | [RF-8.1](../06-requisitos.md), [RNF-9](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **una web con identidad propia de laboratorio** para
**recordarla y entender de un vistazo qué hace su autor**.

## Criterios de aceptación

**Dado** la portada,
**cuando** la abro,
**entonces** veo un raíl con datos de la libreta, un titular serif con acento y
las últimas muestras numeradas.

**Dado** el modo oscuro del sistema,
**cuando** abro la web,
**entonces** la paleta cambia manteniendo el contraste.

**Dado** una pantalla menor de 760 px,
**cuando** abro la web,
**entonces** el raíl desaparece, el índice se pliega y las notas pasan a estar
visibles sin hover.

## Definición de Hecho

- `styles.css` reescrito con tokens propios (papel, tinta, rejilla, raíl).
- Componentes de cabecera, pie, tarjeta y artículo con la nueva estructura.
- Modo oscuro y acento configurable desde los ajustes.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Captura de la portada | raíl, titular, 3 muestras y pie nuevos ✅ |
| Producción | `https://miliolab.com/` con el diseño nuevo ✅ |
