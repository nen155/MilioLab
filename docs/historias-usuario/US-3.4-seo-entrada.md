# US-3.4 — SEO por entrada

| | |
|---|---|
| **Épica** | EP-3 — Entradas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-3.5](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **definir el título y la descripción que ven
los buscadores** para **controlar cómo aparece cada entrada en Google**.

## Criterios de aceptación

**Dado** una entrada con `meta_title` y `meta_description`,
**cuando** se abre en la web,
**entonces** el `<title>`, la meta descripción y las etiquetas Open Graph usan esos
valores.

**Dado** una entrada sin metadatos propios,
**cuando** se abre,
**entonces** se usan el título y la entradilla como respaldo.

**Dado** una entrada con portada,
**cuando** se comparte,
**entonces** `og:image` apunta a la portada en URL absoluta.

## Definición de Hecho

- Campos `meta_title` y `meta_description` en el modelo, la validación y el editor.
- `SeoService` actualiza título, metadatos, canonical y JSON-LD (`BlogPosting`).
- Respaldo automático con `excerpt` o texto plano del contenido.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Ficha de entrada en la web | `<title>` y `og:*` correctos ✅ |
| JSON-LD de la entrada | `BlogPosting` con fecha, autor e imagen ✅ |
