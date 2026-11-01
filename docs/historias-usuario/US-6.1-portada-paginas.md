# US-6.1 — Portada y páginas públicas

| | |
|---|---|
| **Épica** | EP-6 — Web pública |
| **Rol** | Visitante |
| **Requisitos** | [RF-6.1](../06-requisitos.md), [RF-6.2](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **ver una portada con lo último y navegar a las páginas del
sitio** para **entender de qué va el proyecto y leer más**.

## Criterios de aceptación

**Dado** la portada,
**cuando** la abro,
**entonces** veo el nombre, el lema, el contenido de la página de inicio y las últimas
tres entradas.

**Dado** una página publicada,
**cuando** visito `/<slug>`,
**entonces** veo su título, entradilla y contenido con la tipografía de lectura.

**Dado** una URL que no existe,
**cuando** la abro,
**entonces** veo la página 404 con enlaces para volver.

**Dado** el menú,
**cuando** pulso un enlace,
**entonces** navego sin recargar la página (SPA).

## Definición de Hecho

- Rutas `''`, `:slug` y `**` con componentes standalone.
- `SiteService` cachea la configuración y el menú una vez por visita.
- Contenido HTML limpio en el servidor y pintado con `SafeHtmlPipe`.
- Página 404 con título y metadatos propios.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Portada en producción y en local | hero, contenido y últimas entradas ✅ |
| `/sobre-mi` y `/contacto` | renderizan su contenido ✅ |
| Ruta inexistente | 404 con enlaces ✅ |
