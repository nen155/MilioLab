# US-9.4 — Markdown, versión texto y lectura por máquinas

| | |
|---|---|
| **Épica** | EP-8 — Identidad visual |
| **Rol** | Visitante / robot / IA |
| **Requisitos** | [RF-8.4](../06-requisitos.md), [RF-8.5](../06-requisitos.md) |

## Descripción

Como **lector que no ejecuta JavaScript (o un modelo de lenguaje)** quiero **acceder
al contenido en texto plano** para **leerlo, indexarlo o resumirlo sin fricción**.

## Criterios de aceptación

**Dado** un cuerpo que no empieza por una etiqueta HTML,
**cuando** se pinta una entrada o página,
**entonces** se interpreta como **Markdown** (`marked`) y se muestra formateado.

**Dado** `https://miliolab.com/texto`,
**cuando** lo abro,
**entonces** veo un índice completo en Markdown con páginas, entradas y enlaces de máquina.

**Dado** `https://miliolab.com/llms.txt`,
**cuando** lo pido,
**entonces** devuelve una descripción del sitio y sus URLs canónicas.

**Dado** un navegador sin JavaScript,
**cuando** abro la portada,
**entonces** `<noscript>` ofrece el índice de texto, `llms.txt`, sitemap y RSS.

## Definición de Hecho

- `ContentPipe` (HTML o Markdown) y dependencia `marked`.
- Ruta `/texto` y componente `TextIndexComponent`.
- `public/llms.txt`, `public/robots.txt` y `<noscript>` en `index.html`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `/texto` en producción | 200 con índice en Markdown ✅ |
| `/llms.txt` y `/robots.txt` | 200 `text/plain` ✅ |
| JSON-LD y sitemap | siguen publicándose ✅ |
