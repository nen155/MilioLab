"""Publica el portfolio (páginas, entradas, ajustes y menú) en MilioLab.

Uso: python scripts/publish-portfolio.py
Requiere acceso a la API de producción y las credenciales del panel.
"""

import json
import os
import urllib.error
import urllib.request

BASE = os.environ.get('MILIOLAB_API', 'https://miliolab.com/api/v1')
EMAIL = os.environ.get('MILIOLAB_EMAIL', '')
PASSWORD = os.environ.get('MILIOLAB_PASSWORD', '')


def call(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(BASE + path, data=data, method=method)
    request.add_header('Content-Type', 'application/json')
    request.add_header('Accept', 'application/json')
    request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MilioLab/1.0')
    if token:
        request.add_header('Authorization', 'Bearer ' + token)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode() or '{}')
    except urllib.error.HTTPError as error:
        print('ERR', method, path, error.code, error.read().decode()[:200])
        return None


def main():
    token = call('POST', '/auth/login', {'email': EMAIL, 'password': PASSWORD})['token']

    call('PUT', '/admin/settings', {'settings': [
        {'key': 'site_tagline', 'value': 'Ingeniería de software, producto y experimentos', 'type': 'string', 'group': 'general'},
        {'key': 'site_description', 'value': 'Portfolio y cuaderno de Emilio Chica Jiménez, ingeniero de software en Granada: .NET, Node, Angular, Ionic, datos y visión artificial.', 'type': 'text', 'group': 'general'},
        {'key': 'contact_email', 'value': 'nen156@gmail.com', 'type': 'string', 'group': 'contacto'},
        {'key': 'social_github', 'value': 'https://github.com/nen155', 'type': 'string', 'group': 'social'},
        {'key': 'blog_title', 'value': 'Cuaderno', 'type': 'string', 'group': 'blog'},
        {'key': 'blog_intro', 'value': 'Notas de ingeniería: lo que construyo, lo que rompo y lo que aprendo por el camino.', 'type': 'text', 'group': 'blog'},
        {'key': 'footer_text', 'value': 'Desarrollado con IA · Angular y Laravel.', 'type': 'string', 'group': 'general'},
        {'key': 'footer_text_en', 'value': 'Developed with AI · Angular and Laravel.', 'type': 'string', 'group': 'general'},
    ]}, token)

    pages = [
        ('sobre-mi', 'Sobre mí', 'default',
         'Ingeniero de software en Granada. Construyo producto de punta a punta: del requisito al despliegue.',
         '<h2>Emilio Chica Jiménez</h2>'
         '<p>Ingeniero de software en Granada. Llevo desde 2018 en <strong>Infowork S.L.</strong> como analista y desarrollador fullstack, y antes trabajé como freelance desarrollando apps Android y backends PHP.</p>'
         '<p>Me gusta entender el problema antes de escribir código, decidir la arquitectura con criterio y dejar las cosas funcionando en producción. Disfruto igual montando una API que peleándome con una salida de vídeo en Windows.</p>'
         '<h3>Experiencia</h3><ul>'
         '<li><strong>Infowork S.L.</strong> (2018 – actualidad). Analista/fullstack .NET, NodeJS y Angular. Proyecto de optimización de almacén (Ionic 4, NodeJS con GraphQL, ASP.NET y SQL Server): requisitos, arquitectura, historias de usuario y desarrollo.</li>'
         '<li><strong>Solinsur</strong> (2017 – 2018). Fullstack .NET: CRM de escritorio, servicios ASP.NET y una API que unifica las APIs de varias aseguradoras; procesos de carga de datos de proveedores.</li>'
         '<li><strong>Freelance</strong> (2014 – 2017). Android/Java y PHP: <em>AlergiaStop</em> y <em>Guia Pueblo</em>, de la toma de requisitos a la publicación en Google Play.</li>'
         '</ul><h3>Formación</h3><ul>'
         '<li>Grado en Ingeniería Informática — ETSIIT, Granada (2013 – 2017). TFG: red social <em>SmartU</em> (Android + API REST en PHP).</li>'
         '<li>CFGS Desarrollo de Aplicaciones Informáticas — IES Zaidín Vergeles (2010 – 2012).</li>'
         '<li>CFGS Sistemas de Telecomunicación e Informáticos — IES Virgen de las Nieves (2008 – 2010).</li>'
         '</ul>'),
        ('habilidades', 'Habilidades', 'wide',
         'El stack con el que trabajo, ordenado por lo que resuelve.',
         '<h2>Stack</h2>'
         '<h3>Backend</h3><ul>'
         '<li>.NET Framework y ASP.NET (servicios y APIs), C#.</li>'
         '<li>NodeJS con GraphQL y REST.</li>'
         '<li>PHP: Laravel y PHP nativo (API REST).</li>'
         '<li>SQL Server y MySQL/MariaDB: modelado, consultas y migraciones.</li>'
         '</ul><h3>Frontend</h3><ul>'
         '<li>Angular (standalone, signals, TypeScript estricto).</li>'
         '<li>Ionic y Capacitor para apps híbridas.</li>'
         '<li>HTML semántico, CSS propio y accesibilidad.</li>'
         '</ul><h3>Móvil</h3><ul>'
         '<li>Android nativo con Java.</li>'
         '<li>Ionic/Capacitor y publicación en Google Play.</li>'
         '</ul><h3>Datos, IA y multimedia</h3><ul>'
         '<li>Python para visión artificial: OpenCV, MediaPipe y modelos ONNX (reconocimiento de emociones).</li>'
         '<li>Reproducción con libVLC y procesado de vídeo.</li>'
         '</ul><h3>Herramientas</h3><ul>'
         '<li>Docker y Docker Compose, Git, CI y despliegue en hosting compartido (IONOS).</li>'
         '<li>Metodologías ágiles, historias de usuario y documentación técnica.</li>'
         '</ul>'),
        ('proyectos', 'Proyectos', 'wide',
         'Lo que he construido, con enlace al código cuando es público.',
         '<h2>Proyectos</h2>'
         '<h3>Cinema Decisive</h3>'
         '<p>CMS de experiencias cinematográficas que decide la siguiente escena según la emoción del público. Runtime en Python (OpenCV + ONNX + VLC), editor en Angular y API en Laravel. Incluye ventana única de sala, controles de reproducción y despliegue en hosting compartido.</p>'
         '<p><a href="https://github.com/nen155/cinema_decisive" target="_blank" rel="noopener">github.com/nen155/cinema_decisive</a></p>'
         '<h3>Infowork SGA</h3>'
         '<p>Sistema de gestión de almacén: app Ionic 4, backend NodeJS con GraphQL, servicios ASP.NET y SQL Server. Requisitos, arquitectura y desarrollo fullstack.</p>'
         '<h3>Plugins de Jellyfin</h3>'
         '<p>Cinco plugins en C# para ordenar una biblioteca multimedia: portadas y miniaturas (<em>PhotoThumbs</em>), detección de contenido adulto (<em>PhotoGuard</em>), normalización de nombres (<em>MediaOrganizer</em>), filtrado de archivos (<em>MediaOnly</em>) y optimización de imágenes (<em>GalleryOptimizer</em>).</p>'
         '<h3>IntView</h3>'
         '<p>Gestión de entrevistas no atendidas: grabación, revisión y evaluación desde el navegador.</p>'
         '<h3>TFG · SmartU</h3>'
         '<p>Red social para Android con API REST en PHP (Slim) y back-office. Proyecto fin de grado de Ingeniería Informática.</p>'
         '<h3>Webs</h3>'
         '<p>ColoredMoon, La Biblioteca Zurana, Cresio, Fiesta en Granada, Guia Pueblo, Jimesa, LATINAE, Ocho Rocodromo, ReadyOrder y Timemapp.</p>'),
        ('contacto', 'Contacto', 'default',
         '¿Tienes un proyecto o una pregunta? Escríbeme.',
         '<h2>Hablemos</h2>'
         '<p>La forma más rápida es el correo: <strong><a href="mailto:nen156@gmail.com">nen156@gmail.com</a></strong></p>'
         '<p>También estoy en <a href="https://github.com/nen155" target="_blank" rel="noopener">GitHub</a> y en <a href="https://www.coloredmoon.com" target="_blank" rel="noopener">coloredmoon.com</a>.</p>'
         '<p>Disponible para proyectos de desarrollo web, aplicaciones móviles, APIs y visión artificial aplicada.</p>'),
    ]

    existing = {p['slug']: p for p in call('GET', '/admin/pages?per_page=100', token=token)['data']}

    for slug, title, template, excerpt, body in pages:
        payload = {'title': title, 'slug': slug, 'excerpt': excerpt, 'body': body,
                   'template': template, 'status': 'published'}
        if slug in existing:
            call('PUT', f"/admin/pages/{existing[slug]['id']}", payload, token)
        else:
            call('POST', '/admin/pages', payload, token)

    posts = [
        ('cinema-decisive-una-pelicula-que-se-decide-con-la-cara',
         'Cinema Decisive: una película que se decide con la cara',
         'Un CMS donde la siguiente escena la elige la emoción del público. Runtime en Python, editor en Angular y API en Laravel.',
         '<p><em>Cinema Decisive</em> nació de una pregunta incómoda: ¿y si la película cambiara según cómo la está mirando la gente?</p>'
         '<h2>Cómo funciona</h2><ol>'
         '<li>Una cámara captura al público; OpenCV detecta caras y un modelo ONNX (HSEmotion) estima la emoción.</li>'
         '<li>Un agregador ponderado decide la emoción dominante de la escena.</li>'
         '<li>El motor narrativo recorre un árbol de escenas: cada transición tiene una emoción y un umbral.</li>'
         '<li>VLC reproduce los clips de la escena elegida, con la ventana de sala mostrando vídeo, grafo y reacciones.</li>'
         '</ol><h2>Decisiones que costaron</h2>'
         '<p><strong>Latencia.</strong> Procesar a 15 fps con detección + clasificación obliga a medir cada etapa; el panel de latencias por etapa salió de ahí.</p>'
         '<p><strong>VLC en Windows.</strong> Acoplar el vídeo a una ventana de Tk exige reiniciar la salida de vídeo; si no, la imagen se queda en negro.</p>'
         '<p><strong>YouTube.</strong> VLC no abre una página de YouTube: hay que resolver el flujo directo con yt-dlp y cachearlo.</p>'
         '<p><strong>Hosting compartido.</strong> Sin SSH, el despliegue se hace con un zip, un extractor PHP y las migraciones por HTTP.</p>'),
        ('infowork-sga-optimizar-un-almacen',
         'Infowork SGA: optimizar un almacén con Ionic, GraphQL y .NET',
         'Analista y fullstack en un proyecto para optimizar el almacén: requisitos, arquitectura y desarrollo.',
         '<p>En <strong>Infowork</strong> tuve la suerte de participar en un proyecto de optimización de almacén desde el principio: requisitos, decisiones de arquitectura, historias de usuario y desarrollo.</p>'
         '<h2>El stack</h2><ul>'
         '<li><strong>Frontend:</strong> Ionic 4 (Angular) para operarios y responsables.</li>'
         '<li><strong>Backend:</strong> NodeJS con GraphQL para las consultas del día a día y servicios ASP.NET para la integración con el resto del sistema.</li>'
         '<li><strong>Datos:</strong> SQL Server.</li>'
         '</ul><h2>Lo que aprendí</h2>'
         '<p><strong>Los requisitos se descubren en el almacén.</strong> Una hora con un operario explicaba más que tres reuniones.</p>'
         '<p><strong>GraphQL no es gratis.</strong> Da mucha flexibilidad al frontend, pero hay que cuidar las consultas y el cacheo o el servidor sufre.</p>'
         '<p><strong>Mantener también es construir.</strong> El CRM de escritorio, los servicios y las APIs siguieron evolucionando en paralelo.</p>'),
        ('jellyfin-cinco-plugins-para-ordenar-tu-biblioteca',
         'Jellyfin: cinco plugins para ordenar tu biblioteca',
         'Portadas, contenido adulto, nombres de series, filtrado de archivos y optimización de imágenes. Cinco plugins en C#.',
         '<p>Jellyfin es un servidor multimedia libre. Estos cinco plugins resuelven problemas concretos de una biblioteca grande y desordenada:</p><ul>'
         '<li><strong>PhotoThumbs</strong>: portadas para carpetas de fotos y miniaturas pre-generadas.</li>'
         '<li><strong>PhotoGuard</strong>: detecta fotos con contenido adulto y las mueve a una carpeta oculta.</li>'
         '<li><strong>MediaOrganizer</strong>: normaliza nombres de series y películas para el scraper.</li>'
         '<li><strong>MediaOnly</strong>: ignora archivos que no sean vídeo o imagen al escanear.</li>'
         '<li><strong>GalleryOptimizer</strong>: limita el tamaño de las imágenes servidas para ahorrar RAM en los clientes.</li>'
         '</ul><p>Están publicados como repositorios independientes y unidos en un repositorio de plugins con su manifiesto.</p>'
         '<p><a href="https://github.com/nen155?tab=repositories" target="_blank" rel="noopener">Ver los repositorios</a></p>'),
        ('de-la-universidad-a-la-empresa',
         'De la universidad a la empresa: SmartU, Guia Pueblo y AlergiaStop',
         'Cuatro proyectos que me enseñaron lo que no cabe en un temario.',
         '<p>Antes de Infowork hubo una etapa de freelance y una carrera. Estos proyectos son los que más me enseñaron:</p>'
         '<h2>SmartU (TFG, 2017)</h2><p>Red social para Android con API REST en PHP (Slim) y back-office. Aprendí a diseñar una API pensando en el cliente y a documentar lo que otros van a mantener.</p>'
         '<h2>Guia Pueblo (2014 – 2015)</h2><p>App Android para negocios locales: anuncios, noticias, ofertas y búsqueda por cercanía. Backend en PHP y back-office en Laravel. Fue mi primer proyecto con cliente real y fechas reales.</p>'
         '<h2>AlergiaStop (2014 – 2017)</h2><p>App para personas con alergias: extracción de requisitos con el cliente, i18n en dos idiomas, publicación en Google Play y evolución durante tres años.</p>'
         '<h2>FarmaSearch</h2><p>Búsqueda de farmacias cercanas con panel de administración. Un ejercicio de geolocalización y datos abiertos.</p>'
         '<p>La conclusión: el código es la parte fácil; lo difícil es entender qué necesita quien lo va a usar.</p>'),
    ]

    existing_posts = {p['slug']: p for p in call('GET', '/admin/posts?per_page=100', token=token)['data']}

    for slug, title, excerpt, body in posts:
        payload = {'title': title, 'slug': slug, 'excerpt': excerpt, 'body': body, 'status': 'published'}
        if slug in existing_posts:
            call('PUT', f"/admin/posts/{existing_posts[slug]['id']}", payload, token)
        else:
            call('POST', '/admin/posts', payload, token)

    pages_now = {p['slug']: p['id'] for p in call('GET', '/admin/pages?per_page=100', token=token)['data']}
    menu = {m['label']: m for m in call('GET', '/admin/menu-items', token=token)['data']}

    wanted = [
        ('Inicio', {'page_id': pages_now.get('inicio'), 'position': 0}),
        ('Blog', {'url': '/blog', 'position': 1}),
        ('Sobre mí', {'page_id': pages_now.get('sobre-mi'), 'position': 2}),
        ('Proyectos', {'page_id': pages_now.get('proyectos'), 'position': 3}),
        ('Habilidades', {'page_id': pages_now.get('habilidades'), 'position': 4}),
        ('Contacto', {'page_id': pages_now.get('contacto'), 'position': 5}),
    ]

    for label, extra in wanted:
        payload = {'label': label, 'target': '_self', 'is_active': True, **extra}
        if label in menu:
            call('PUT', f"/admin/menu-items/{menu[label]['id']}", payload, token)
        else:
            call('POST', '/admin/menu-items', payload, token)

    print('páginas:', len(call('GET', '/admin/pages?per_page=100', token=token)['data']))
    print('entradas:', len(call('GET', '/admin/posts?per_page=100', token=token)['data']))
    print('menú:', [m['label'] for m in call('GET', '/admin/menu-items', token=token)['data']])


if __name__ == '__main__':
    main()
