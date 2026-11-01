# Historias de usuario — MilioLab

Índice de épicas e historias. Cada ficha sigue el formato **Como** `<rol>`
**quiero** `<acción>` **para** `<beneficio>`, con criterios de aceptación
*Dado / Cuando / Entonces*, definición de hecho y verificación.

Estado: ✅ Hecha · ⏳ Pendiente · 🧩 Parcial.

## Épicas

| Épica | Ámbito |
|---|---|
| EP-0 | Plataforma: entorno, despliegue y repositorio |
| EP-1 | Acceso y cuentas |
| EP-2 | Páginas |
| EP-3 | Entradas del blog |
| EP-4 | Multimedia |
| EP-5 | Navegación y ajustes |
| EP-6 | Web pública |
| EP-7 | API y calidad |
| EP-8 | Identidad visual y experiencia |
| EP-9 | Temas |

## Índice

| ID | Título | Épica | Requisitos | Estado | Ficha |
|---|---|---|---|---|---|
| US-0.1 | Entorno de desarrollo reproducible (Docker + MariaDB) | EP-0 | RNF-1 | ✅ | [`US-0.1`](historias-usuario/US-0.1-entorno-desarrollo.md) |
| US-0.2 | Despliegue en hosting compartido (IONOS) | EP-0 | RNF-1, RNF-5, RNF-6 | ✅ | [`US-0.2`](historias-usuario/US-0.2-despliegue-hosting.md) |
| US-0.3 | Repositorio privado y flujo de trabajo | EP-0 | RNF-4 | ✅ | [`US-0.3`](historias-usuario/US-0.3-repositorio-flujo.md) |
| US-1.1 | Acceso al panel con token | EP-1 | RF-1.1, RF-1.2 | ✅ | [`US-1.1`](historias-usuario/US-1.1-acceso-panel.md) |
| US-1.2 | Cambio de contraseña y revocación de sesiones | EP-1 | RF-1.3 | ✅ | [`US-1.2`](historias-usuario/US-1.2-cambio-contrasena.md) |
| US-2.1 | Gestión de páginas | EP-2 | RF-2.1, RF-2.2 | ✅ | [`US-2.1`](historias-usuario/US-2.1-gestion-paginas.md) |
| US-2.2 | Publicación y programación de páginas | EP-2 | RF-2.3, RF-2.5 | ✅ | [`US-2.2`](historias-usuario/US-2.2-publicacion-paginas.md) |
| US-2.3 | Plantillas de página | EP-2 | RF-2.4 | ✅ | [`US-2.3`](historias-usuario/US-2.3-plantillas-pagina.md) |
| US-3.1 | Gestión de entradas | EP-3 | RF-3.1, RF-3.4, RF-3.6 | ✅ | [`US-3.1`](historias-usuario/US-3.1-gestion-entradas.md) |
| US-3.2 | Categorías y etiquetas | EP-3 | RF-3.2 | ✅ | [`US-3.2`](historias-usuario/US-3.2-categorias-etiquetas.md) |
| US-3.3 | Portada y entradilla | EP-3 | RF-3.3, RF-4.4 | ✅ | [`US-3.3`](historias-usuario/US-3.3-portada-entradilla.md) |
| US-3.4 | SEO por entrada | EP-3 | RF-3.5 | ✅ | [`US-3.4`](historias-usuario/US-3.4-seo-entrada.md) |
| US-4.1 | Biblioteca de medios | EP-4 | RF-4.1, RF-4.2 | ✅ | [`US-4.1`](historias-usuario/US-4.1-biblioteca-medios.md) |
| US-4.2 | Imágenes en el editor | EP-4 | RF-4.3 | ✅ | [`US-4.2`](historias-usuario/US-4.2-imagenes-editor.md) |
| US-5.1 | Menú editable | EP-5 | RF-5.1 | ✅ | [`US-5.1`](historias-usuario/US-5.1-menu-editable.md) |
| US-5.2 | Ajustes del sitio | EP-5 | RF-5.2–5.4, RF-1.4 | ✅ | [`US-5.2`](historias-usuario/US-5.2-ajustes-sitio.md) |
| US-6.1 | Portada y páginas públicas | EP-6 | RF-6.1, RF-6.2 | ✅ | [`US-6.1`](historias-usuario/US-6.1-portada-paginas.md) |
| US-6.2 | Blog con filtros, paginación y buscador | EP-6 | RF-6.3, RF-6.4 | ✅ | [`US-6.2`](historias-usuario/US-6.2-blog-filtros-buscador.md) |
| US-6.3 | Detalle de entrada | EP-6 | RF-6.5 | ✅ | [`US-6.3`](historias-usuario/US-6.3-detalle-entrada.md) |
| US-6.4 | Diseño adaptable y modo oscuro | EP-6 | RF-6.8, RNF-2, RNF-3 | ✅ | [`US-6.4`](historias-usuario/US-6.4-diseno-adaptable.md) |
| US-6.5 | SEO técnico: metadatos, sitemap y RSS | EP-6 | RF-6.6, RF-6.7 | ✅ | [`US-6.5`](historias-usuario/US-6.5-seo-tecnico.md) |
| US-7.1 | API pública versionada | EP-7 | RF-7.1 | ✅ | [`US-7.1`](historias-usuario/US-7.1-api-publica.md) |
| US-7.2 | API de administración | EP-7 | RF-7.2–7.4 | ✅ | [`US-7.2`](historias-usuario/US-7.2-api-admin.md) |
| US-7.3 | Pruebas y aislamiento de la base de datos | EP-7 | RNF-7 | ✅ | [`US-7.3`](historias-usuario/US-7.3-pruebas.md) |
| US-7.4 | Documentación técnica y SDD | EP-7 | RNF-8 | ✅ | [`US-7.4`](historias-usuario/US-7.4-documentacion.md) |
| US-9.1 | Rediseño «cuaderno de laboratorio» | EP-8 | RF-8.1, RNF-9 | ✅ | [`US-9.1`](historias-usuario/US-9.1-rediseno-laboratorio.md) |
| US-9.2 | Easter eggs al pasar el ratón | EP-8 | RF-8.2, RNF-10 | ✅ | [`US-9.2`](historias-usuario/US-9.2-easter-eggs.md) |
| US-9.3 | Sala de experimentos (minijuegos) | EP-8 | RF-8.3, RNF-10 | ✅ | [`US-9.3`](historias-usuario/US-9.3-minijuegos.md) |
| US-9.4 | Markdown, versión texto y lectura por máquinas | EP-8 | RF-8.4, RF-8.5 | ✅ | [`US-9.4`](historias-usuario/US-9.4-markdown-texto-maquinas.md) |
| US-9.5 | Accesibilidad del nuevo diseño | EP-8 | RNF-10 | ✅ | [`US-9.5`](historias-usuario/US-9.5-accesibilidad.md) |
| US-10.1 | Temas desde el panel | EP-9 | RF-9.1, RF-9.2 | ✅ | [`US-10.1`](historias-usuario/US-10.1-temas-panel.md) |
| US-10.2 | Crear, exportar e importar temas | EP-9 | RF-9.3, RF-9.4 | ✅ | [`US-10.2`](historias-usuario/US-10.2-importar-temas.md) |

## Pendientes (backlog)

| ID | Título | Motivo |
|---|---|---|
| US-8.1 | Comentarios en las entradas | Requiere moderación y antispam |
| US-8.2 | Varios usuarios y permisos finos | Hoy hay un `admin` y el rol `editor` está previsto |
| US-8.3 | Programación de publicaciones con cola | El hosting no tiene cron garantizado; se puede con un cron externo |
| US-8.4 | Copias de seguridad automáticas | IONOS no ofrece cron en el plan actual |
| US-8.5 | Analítica de visitas | Privacidad: valorar solución sin cookies |
