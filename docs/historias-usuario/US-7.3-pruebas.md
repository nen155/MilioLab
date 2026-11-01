# US-7.3 — Pruebas y aislamiento de la base de datos

| | |
|---|---|
| **Épica** | EP-7 — API y calidad |
| **Rol** | Desarrolladora/or |
| **Requisitos** | [RNF-7](../06-requisitos.md) |

## Descripción

Como **desarrolladora/or** quiero **pruebas automáticas que nunca toquen los datos de
desarrollo** para **cambiar el CMS sin miedo y sin perder contenido**.

## Criterios de aceptación

**Dado** `php artisan test`,
**cuando** se ejecuta,
**entonces** usa la base `miliolab_test` y todas las pruebas pasan.

**Dado** la base de desarrollo con contenido,
**cuando** termino las pruebas,
**entonces** los datos siguen intactos.

**Dado** una configuración errónea,
**cuando** los tests apuntan a la base de desarrollo,
**entonces** una prueba de aislamiento falla y avisa.

## Definición de Hecho

- `.env.testing` con la base de test y `phpunit.xml` con `force="true"`.
- `RefreshDatabase` en las pruebas de feature.
- `DatabaseIsolationTest` como red de seguridad.
- El contenedor no define `DB_*` en el entorno (Laravel leería antes esas variables).

## Verificación realizada

| Prueba | Resultado |
|---|---|
| `php artisan test` | 37 pruebas, 119 aserciones ✅ |
| `miliolab.settings` tras los tests | 16 filas intactas ✅ |
| `DatabaseIsolationTest` | confirma `miliolab_test` ✅ |
