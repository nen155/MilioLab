# US-9.2 — Easter eggs al pasar el ratón

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual |
| **Rol** | Visitante |
| **Requisitos** | [RF-8.2](../06-requisitos.md), [RNF-10](../06-requisitos.md) |

## Descripción

Como **visitante curioso** quiero **descubrir notas y guiños al pasar el ratón** para
**que la web tenga una segunda capa que premie la exploración**.

## Criterios de aceptación

**Dado** una etiqueta con nota oculta,
**cuando** paso el ratón o llego con el teclado,
**entonces** aparece la nota sin mover el resto del contenido.

**Dado** una tarjeta de muestra,
**cuando** hago hover,
**entonces** se revela una nota de laboratorio propia de esa muestra.

**Dado** un lector que no usa ratón,
**cuando** navega con Tab,
**entonces** las notas también se muestran (`:focus-visible`).

## Definición de Hecho

- Componente `span.egg` + `.egg-note` reutilizable en portada y pie.
- Notas por tarjeta derivadas del id de la entrada (sin backend).
- En móvil las notas de tarjeta quedan visibles (sin depender del hover).

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Portada | notas «método», «muestras» y «residuo» al hover/focus ✅ |
| Tarjetas | nota por muestra al hover ✅ |
