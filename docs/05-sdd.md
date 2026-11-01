# SDD — Metodología de MilioLab

Documentación guiada por especificación (*Spec-Driven Development*): primero se
describe **qué** debe hacer el sistema y **por qué**, después se implementa, y cada
pieza queda trazada de la especificación a la historia de usuario y al código.

## Artefactos

| Documento | Contenido |
|---|---|
| [`06-requisitos.md`](06-requisitos.md) | Requisitos funcionales (RF) y no funcionales (RNF) con identificador |
| [`07-historias-usuario.md`](07-historias-usuario.md) | Índice de épicas e historias, con estado y trazabilidad |
| [`historias-usuario/`](historias-usuario/) | Una ficha por historia: contexto, criterios, DoD y verificación |
| [`01-arquitectura.md`](01-arquitectura.md) | Decisiones técnicas y estructura |
| [`02-modelo-datos.md`](02-modelo-datos.md) | Esquema de la base de datos |
| [`03-api.md`](03-api.md) | Contrato de la API |
| [`04-despliegue.md`](04-despliegue.md) | Puesta en producción |

## Roles

- **Autora/or del contenido** (rol `admin`): escribe, publica y ajusta el sitio.
- **Colaborador** (rol `editor`, previsto): puede crear y editar contenido, no
  cambiar los ajustes globales.
- **Visitante**: consume la web pública, sin cuenta.

## Flujo de trabajo

1. **Especificar**: se añade o cambia un requisito en `06-requisitos.md`.
2. **Desglosar**: se crea la historia en `historias-usuario/` con criterios de
   aceptación en formato *Dado / Cuando / Entonces*.
3. **Implementar**: código + pruebas.
4. **Verificar**: se anota el resultado real en la ficha de la historia.
5. **Desplegar**: `deploy/deploy-hosting.ps1` y comprobación en producción.

## Convenciones

- **Épicas**: `EP-n`. **Historias**: `US-n.m`. **Requisitos**: `RF-n.m` y `RNF-n`.
- Cada historia enlaza los requisitos que cubre y los documentos técnicos.
- Una historia está **Hecha** cuando pasa sus criterios, tiene pruebas y está
  desplegada o documentada su puesta en producción.

## Definición de Hecho (DoD) común

1. Criterios de aceptación cumplidos y verificados.
2. Pruebas automatizadas cuando la lógica lo permite (`php artisan test`).
3. Sin secretos en el repositorio (`.env`, credenciales y `deploy.env` ignorados).
4. Documentación actualizada (requisitos, historia y, si cambia, API o modelo).
5. Desplegado en `miliolab.com` o anotado por qué no procede.

## Estado actual

La primera versión está implementada y desplegada en producción. Las historias
`US-0.x` a `US-7.x` figuran como **Hechas** con su verificación; las mejoras
futuras se registran como **Pendientes** en el índice.
