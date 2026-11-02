# US-i18n-UI — Interfaz bilingüe (es/en)

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual y experiencia |
| **Rol** | Visitante |
| **Requisitos** | [RF-13.1](../06-requisitos.md) |

## Descripción

Como **visitante** quiero **poder leer toda la interfaz del sitio en español o en
inglés** para **entender la navegación y los textos de apoyo en mi idioma**, sin
que el contenido editorial cambie de URL.

## Criterios de aceptación

**Dado** que abro la web por primera vez,
**cuando** el navegador está en español o en inglés,
**entonces** la interfaz arranca en ese idioma y el selector muestra el activo.

**Dado** que pulso «EN» o «ES» en la cabecera,
**cuando** cambia el idioma,
**entonces** se traducen al instante todos los textos de interfaz (raíl, cabecera,
pie, portada, blog, detalle, páginas, versión texto, proyectos, habilidades y
sala de experimentos), sin recargar ni cambiar de ruta.

**Dado** que recargo la página o vuelvo más tarde,
**cuando** se carga la web,
**entonces** se mantiene el idioma elegido (`localStorage`) y `<html lang>`
coincide con él.

**Dado** un texto sin traducción,
**cuando** se pinta en inglés,
**entonces** se muestra el español como respaldo (nunca una clave vacía).

## Definición de Hecho

- [x] `I18nService` con diccionario es/en, `signal` de idioma, persistencia en
  `localStorage`, `document.documentElement.lang` y helpers `t()`, `pick()` y
  `content()`.
- [x] Selector ES/EN en la cabecera, accesible por teclado y con `aria-pressed`.
- [x] Todos los textos fijos de la web pública salen del diccionario.
- [x] El panel de administración sigue en español (herramienta interna), pero los
  formularios de contenido permiten editar los campos en inglés.
- [x] Pruebas de build de `apps/web` en verde.

## Notas de implementación

- `apps/web/src/app/core/i18n.ts`: diccionario único, idioma inicial desde
  `navigator.language`, persistencia y `lang` del documento.
- Los textos de contenido (entradas, páginas, menú y ajustes) se resuelven con
  `content(es, en)` y caen al español si el inglés está vacío.
- Los datos estáticos del portfolio usan `Localized` (`{ es, en }`) y se
  resuelven con `pick()`.
- El selector vive en `site-header.component.ts`; el estilo en `styles.css`.
- Las fechas se formatean con `Intl.DateTimeFormat` en `es-ES` o `en-GB` según el
  idioma activo.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Selector ES/EN y persistencia en `localStorage` | cambia al instante y sobrevive a la recarga ✅ |
| `<html lang>` | `es` / `en` según el selector ✅ |
| Portada, blog, detalle, página, `/texto`, proyectos, habilidades y sala de experimentos | textos traducidos ✅ |
| Título del documento | se actualiza al cambiar de idioma ✅ |
| `npm run build` de `apps/web` | build correcto ✅ |

## Trazabilidad

- Requisito nuevo [RF-13.1](../06-requisitos.md).
- Continúa el trabajo iniciado en el commit `feat(i18n): textos de home, blog y
  404 en es/en + selector de idioma`.
