# US-9.5 — Accesibilidad del nuevo diseño

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual |
| **Rol** | Visitante con diversidad funcional |
| **Requisitos** | [RNF-10](../06-requisitos.md) |

## Descripción

Como **visitante que navega con teclado, lector de pantalla o poca visión** quiero
**usar todo el sitio sin depender del ratón ni de animaciones** para **leer y jugar
en igualdad de condiciones**.

## Criterios de aceptación

**Dado** la página cargada,
**cuando** pulso Tab,
**entonces** el primer foco es «Saltar al contenido» y todos los interactivos tienen
foco visible.

**Dado** una nota oculta,
**cuando** llego con el teclado,
**entonces** se muestra igual que con el ratón.

**Dado** `prefers-reduced-motion`,
**cuando** navego,
**entonces** no hay animaciones ni transiciones.

**Dado** los minijuegos,
**cuando** los uso solo con teclado,
**entonces** funcionan y anuncian resultados con `aria-live`.

## Definición de Hecho

- `skip-link`, `main#contenido`, `aria-expanded`/`aria-controls` en el menú.
- Notas accesibles por `:focus-visible`.
- Contraste AA en papel claro y oscuro; foco de 3 px.
- `prefers-reduced-motion` global.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Navegación con Tab | skip-link, menú, tarjetas y juegos alcanzables ✅ |
| Contraste | texto tinta sobre papel y acento sobre papel ✅ |
| Movimiento reducido | animaciones desactivadas ✅ |
