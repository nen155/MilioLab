# US-0.3 — Repositorio privado y flujo de trabajo

| | |
|---|---|
| **Épica** | EP-0 — Plataforma |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RNF-4](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **tener el código en un repositorio privado con las
credenciales fuera de él** para **trabajar con seguridad desde cualquier equipo**.

## Criterios de aceptación

**Dado** el repositorio `nen155/MilioLab` (privado),
**cuando** se clona en un equipo nuevo,
**entonces** no contiene `.env`, `deploy/deploy.env`, `vendor/` ni `node_modules/`.

**Dado** un cambio terminado,
**cuando** se hace commit,
**entonces** el mensaje sigue el formato `tipo(ámbito): descripción` y el cambio es
coherente (una historia o un arreglo por commit).

## Definición de Hecho

- `.gitignore` raíz con dependencias, builds, entornos, secretos y artefactos.
- Excepción versionada de `apps/api/.env.testing` (sin secretos).
- `README.md` con puesta en marcha y enlaces a la documentación.

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `git ls-files` | 218 archivos, ninguno de `vendor/`, `node_modules/` ni `dist/` ✅ |
| Búsqueda de credenciales en el índice | sin contraseñas ni tokens ✅ |
| `git push` a `origin/main` | correcto ✅ |
