# US-9.3 — Sala de experimentos (minijuegos ocultos)

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual |
| **Rol** | Visitante |
| **Requisitos** | [RF-8.3](../06-requisitos.md), [RNF-10](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **encontrar pequeños experimentos jugables** para
**llevarme una sorpresa y una anécdota del sitio**.

## Criterios de aceptación

**Dado** el pie de página,
**cuando** pulso «experimentos» (o `Shift + L`),
**entonces** se abre un diálogo con dos pestañas: **Reflejos** y **Secuencia**.

**Dado** el juego de reflejos,
**cuando** pulso «Empezar» y espero al círculo,
**entonces** se mide el tiempo de reacción y se muestra un veredicto.

**Dado** el juego de secuencia,
**cuando** repito la serie con los botones o las teclas 1–4,
**entonces** la secuencia crece y se anuncia el resultado con `aria-live`.

**Dado** el diálogo abierto,
**cuando** pulso `Esc`,
**entonces** se cierra y el foco vuelve a la página.

## Definición de Hecho

- `LabService` (estado compartido) y `LabPanelComponent` (`role="dialog"`).
- Juegos sin dependencias externas; teclado y ratón.
- Resultados anunciados a lectores de pantalla.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Apertura desde el pie y con Shift + L | diálogo visible ✅ |
| Reflejos y secuencia | funcionan con ratón y teclado ✅ |
