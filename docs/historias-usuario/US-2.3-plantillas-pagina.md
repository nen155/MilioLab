# US-2.3 — Plantillas de página

| | |
|---|---|
| **Épica** | EP-2 — Páginas |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-2.4](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **elegir el ancho de cada página** para
**que la portada respire más que una página de texto**.

## Criterios de aceptación

**Dado** una página con plantilla `default`,
**cuando** se abre en la web,
**entonces** el contenido se limita a una columna de lectura.

**Dado** una página con plantilla `wide` o `landing`,
**cuando** se abre,
**entonces** ocupa el ancho completo del contenedor.

**Dado** el editor de páginas,
**cuando** elijo una plantilla,
**entonces** se guarda y se respeta en la web.

## Definición de Hecho

- Columna `template` validada con `Rule::in(['default','wide','landing'])`.
- Clase `page-wide` en la vista pública según la plantilla.
- Selector en el panel.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Página «Inicio» con `landing` | se muestra a ancho completo ✅ |
| Validación de plantilla desconocida | 422 ✅ |
