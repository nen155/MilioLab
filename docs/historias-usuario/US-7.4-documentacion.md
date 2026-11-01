# US-7.4 — Documentación técnica y SDD

| | |
|---|---|
| **Épica** | EP-7 — API y calidad |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RNF-8](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **documentación de especificación, arquitectura y
operación** para **retomar el proyecto meses después sin reconstruir el contexto**.

## Criterios de aceptación

**Dado** el repositorio,
**cuando** alguien lo abre por primera vez,
**entonces** el `README` le dice cómo arrancarlo y dónde está cada documento.

**Dado** una duda sobre el modelo de datos o la API,
**cuando** consulto `docs/`,
**entonces** encuentro el esquema y el contrato con ejemplos.

**Dado** una historia de usuario,
**cuando** la leo,
**entonces** incluye criterios de aceptación, definición de hecho y verificación real.

**Dado** el despliegue,
**cuando** sigo la guía,
**entonces** puedo publicar de cero con los comandos indicados.

## Definición de Hecho

- `docs/01-arquitectura.md`, `02-modelo-datos.md`, `03-api.md`, `04-despliegue.md`.
- `docs/05-sdd.md`, `06-requisitos.md`, `07-historias-usuario.md` y las fichas.
- `README.md` con puesta en marcha, comandos y enlaces.
- Convenciones de código en `apps/api/AGENTS.md`.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| Índice de historias | 25 historias enlazadas y trazadas a requisitos ✅ |
| Guía de despliegue seguida | primera publicación en miliolab.com ✅ |
