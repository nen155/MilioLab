# Requisitos — MilioLab

Identificadores estables: `RF-x.y` (funcional) y `RNF-n` (no funcional).
Cada requisito enlaza las historias que lo cubren (ver
[`07-historias-usuario.md`](07-historias-usuario.md)).

## RF-1 · Acceso y cuentas

| ID | Requisito | Historias |
|---|---|---|
| RF-1.1 | El panel exige autenticación con correo y contraseña; la API entrega un token de acceso | US-1.1 |
| RF-1.2 | El token se envía en cada petición del panel y se revoca al cerrar sesión | US-1.1 |
| RF-1.3 | El usuario puede cambiar su contraseña indicando la actual; se revocan las demás sesiones | US-1.2 |
| RF-1.4 | Los ajustes globales solo los puede modificar el rol `admin` | US-5.2 |

## RF-2 · Páginas

| ID | Requisito | Historias |
|---|---|---|
| RF-2.1 | Crear, editar, listar y borrar páginas con título, URL, entradilla y contenido | US-2.1 |
| RF-2.2 | Generar la URL (slug) a partir del título y garantizar que sea única | US-2.1 |
| RF-2.3 | Estado borrador/publicada con fecha de publicación opcional | US-2.2 |
| RF-2.4 | Plantilla por página: estándar, ancha o portada | US-2.3 |
| RF-2.5 | Metadatos SEO por página (título y descripción) | US-2.2 |

## RF-3 · Entradas del blog

| ID | Requisito | Historias |
|---|---|---|
| RF-3.1 | Crear, editar, listar y borrar entradas con título, entradilla y contenido | US-3.1 |
| RF-3.2 | Asignar categoría (una) y etiquetas (varias) | US-3.2 |
| RF-3.3 | Imagen de portada y texto de entradilla para las tarjetas | US-3.3 |
| RF-3.4 | Estado borrador/publicada y fecha de publicación | US-3.1 |
| RF-3.5 | Metadatos SEO por entrada | US-3.4 |
| RF-3.6 | Cálculo del tiempo de lectura | US-3.1 |

## RF-4 · Multimedia

| ID | Requisito | Historias |
|---|---|---|
| RF-4.1 | Subir imágenes y PDF (máx. 10 MB) con texto alternativo | US-4.1 |
| RF-4.2 | Listar, copiar la URL y borrar archivos | US-4.1 |
| RF-4.3 | Insertar imágenes de la biblioteca en el editor | US-4.2 |
| RF-4.4 | Elegir la imagen de portada de una entrada | US-3.3 |

## RF-5 · Navegación y configuración

| ID | Requisito | Historias |
|---|---|---|
| RF-5.1 | Menú editable: texto, destino (página o URL), orden y apertura en pestaña nueva | US-5.1 |
| RF-5.2 | Ajustes de identidad: nombre, lema, descripción, URL, página de inicio y pie | US-5.2 |
| RF-5.3 | Ajustes del blog: título, introducción, entradas por página y autor visible | US-5.2 |
| RF-5.4 | Ajustes de apariencia (color de acento), contacto y redes sociales | US-5.2 |

## RF-6 · Web pública

| ID | Requisito | Historias |
|---|---|---|
| RF-6.1 | Portada con el contenido de la página de inicio y las últimas entradas | US-6.1 |
| RF-6.2 | Páginas accesibles en `/<slug>` | US-6.1 |
| RF-6.3 | Listado del blog paginado, filtrable por categoría y etiqueta | US-6.2 |
| RF-6.4 | Buscador por texto sobre título, entradilla y contenido | US-6.2 |
| RF-6.5 | Detalle de entrada con fecha, categoría, etiquetas, autor y tiempo de lectura | US-6.3 |
| RF-6.6 | Título y metadatos por página (Open Graph y JSON-LD en las entradas) | US-6.5 |
| RF-6.7 | `sitemap.xml` y RSS con el contenido publicado | US-6.5 |
| RF-6.8 | Diseño adaptable y modo oscuro según el sistema | US-6.4 |

## RF-7 · API

| ID | Requisito | Historias |
|---|---|---|
| RF-7.1 | API pública versionada en `/api/v1` que solo expone contenido publicado | US-7.1 |
| RF-7.2 | API de administración en `/api/v1/admin` protegida por token | US-7.2 |
| RF-7.3 | Validación de entrada y respuestas de error consistentes (422/401/403/404) | US-7.2 |
| RF-7.4 | El HTML del editor se limpia en el servidor antes de guardarse | US-7.2 |

## RF-8 · Identidad visual y experiencia

| ID | Requisito | Historias |
|---|---|---|
| RF-8.1 | La web pública tiene un diseño propio de «cuaderno de laboratorio» (raíl, rejilla, muestras numeradas) | US-9.1 |
| RF-8.2 | Hay notas y guiños ocultos que aparecen al pasar el ratón o al enfocar con teclado | US-9.2 |
| RF-8.3 | Existe una «sala de experimentos» con minijuegos jugables con ratón y teclado | US-9.3 |
| RF-8.4 | El contenido se puede escribir en Markdown además de HTML | US-9.4 |
| RF-8.5 | Hay una versión texto (`/texto`) y `llms.txt` para robots y modelos de lenguaje | US-9.4 |

## RNF · Requisitos no funcionales

| ID | Requisito | Historias |
|---|---|---|
| RNF-1 | Funcionar en hosting compartido con PHP 8.4, sin procesos permanentes | US-0.2 |
| RNF-2 | La web pública no debe cargar el código del editor | US-6.4 |
| RNF-3 | Tiempo de primera carga de la web por debajo de 100 KB de transferencia | US-6.4 |
| RNF-4 | Contraseñas con bcrypt; tokens revocables; `.env` fuera del repositorio | US-1.1, US-0.3 |
| RNF-5 | La aplicación Laravel no es accesible por HTTP (solo su carpeta pública) | US-0.2 |
| RNF-6 | Copias de seguridad posibles sin SSH (phpMyAdmin + SFTP) | US-0.2 |
| RNF-7 | Pruebas automatizadas del backend aisladas de la base de datos de desarrollo | US-7.3 |
| RNF-8 | Documentación técnica suficiente para retomar el proyecto sin contexto previo | US-7.4 |
| RNF-9 | La web pública mantiene una transferencia inicial cercana a 100 KB | US-9.1 |
| RNF-10 | Accesibilidad: teclado, foco visible, contraste AA y movimiento reducido | US-9.2, US-9.3, US-9.5 |
