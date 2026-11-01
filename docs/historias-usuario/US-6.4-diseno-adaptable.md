# US-6.4 — Diseño adaptable y modo oscuro

| | |
|---|---|
| **Épica** | EP-6 — Web pública |
| **Rol** | Visitante |
| **Requisitos** | [RF-6.8](../06-requisitos.md), [RNF-2](../06-requisitos.md), [RNF-3](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **leer cómodamente en el móvil y con el tema que use mi
sistema** para **no forzar la vista ni hacer zoom**.

## Criterios de aceptación

**Dado** una pantalla menor de 860 px,
**cuando** abro la web,
**entonces** el menú se pliega tras un botón y las tarjetas pasan a una columna.

**Dado** el sistema en modo oscuro,
**cuando** abro la web,
**entonces** los colores cambian solos (fondo, texto y bordes).

**Dado** la web pública,
**cuando** se carga,
**entonces** no descarga el editor ni el código del panel (transferencia inicial
< 100 KB).

**Dado** `prefers-reduced-motion`,
**cuando** navego,
**entonces** las animaciones se desactivan.

## Definición de Hecho

- Variables CSS con tema claro/oscuro y color de acento configurable.
- Rejilla fluida (`auto-fill`), tipografía escalable y menú móvil.
- Build separado del panel (sin TipTap en la web).
- Respeto de `prefers-reduced-motion`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Build de producción de la web | 78,35 KB de transferencia inicial ✅ |
| Capturas a 1280 px y móvil | menú plegable y tarjetas en columna ✅ |
| Modo oscuro del sistema | colores invertidos correctamente ✅ |
