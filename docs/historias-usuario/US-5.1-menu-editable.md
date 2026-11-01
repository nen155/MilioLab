# US-5.1 — Menú editable

| | |
|---|---|
| **Épica** | EP-5 — Navegación y ajustes |
| **Rol** | Autora/or del contenido |
| **Requisitos** | [RF-5.1](../06-requisitos.md) |

## Descripción

Como **autora/or del contenido** quiero **editar el menú de la web desde el panel**
para **cambiar la navegación sin tocar código**.

## Criterios de aceptación

**Dado** el panel en «Menú»,
**cuando** añado un enlace a una página o una URL,
**entonces** aparece en la cabecera y en el pie de la web en ese orden.

**Dado** varios enlaces,
**cuando** los reordeno con las flechas,
**entonces** el nuevo orden se guarda y se ve al recargar la web.

**Dado** un enlace con destino externo y «pestaña nueva»,
**cuando** se pulsa,
**entonces** se abre en otra pestaña con `rel="noopener"`.

**Dado** un enlace borrado,
**cuando** recargo la web,
**entonces** desaparece del menú.

## Definición de Hecho

- Tabla `menu_items` con `page_id`, `url`, `position`, `target` e `is_active`.
- `PUT /api/v1/admin/menu-items/order` para reordenar en bloque.
- `GET /api/v1/site` devuelve el menú resuelto (URL de página o manual).
- Cabecera y pie consumen el mismo menú, sin duplicados.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `AdminContentTest::menu_items_can_be_created_and_reordered` | ✅ |
| Menú real en la web | Inicio, Blog, Sobre mí y Contacto ✅ |
