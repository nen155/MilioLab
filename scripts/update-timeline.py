"""Actualiza «Sobre mí», «Habilidades» y «Proyectos» con la trayectoria y fechas."""

import json
import os
import urllib.error
import urllib.request

BASE = os.environ.get('MILIOLAB_API', 'https://miliolab.com/api/v1')


def call(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(BASE + path, data=data, method=method)
    request.add_header('Content-Type', 'application/json')
    request.add_header('Accept', 'application/json')
    request.add_header('User-Agent', 'Mozilla/5.0 MilioLab/1.0')
    if token:
        request.add_header('Authorization', 'Bearer ' + token)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode() or '{}')


def item(date, title, role, body, tags=(), current=False, href=None):
    tag_html = ''.join(f'<span class="chip">{tag}</span>' for tag in tags)
    link = (f'<p style="margin:.4rem 0 0"><a href="{href}" target="_blank" rel="noopener">'
            f'{href.replace("https://", "")}</a></p>') if href else ''
    classes = 'tl-item current' if current else 'tl-item'
    return (f'<article class="{classes}"><span class="tl-date">{date}</span>'
            f'<h3 class="tl-title">{title}</h3><p class="tl-role">{role}</p>'
            f'<p class="tl-body">{body}</p>{link}<div class="tl-tags">{tag_html}</div></article>')


CAREER = (
    '<h2>Trayectoria</h2><div class="timeline">'
    + item('mayo 2022 — actualidad', 'Sixtema S.L.',
           'Analista, programador y mentoring · Spring Java 11 + Angular 14',
           'Renovación del portal meteorológico de la Xunta de Galicia (<em>meteogalicia.gal</em>). '
           'SCRUM modificado con entregas mensuales y contacto directo con el cliente.',
           ('Java 11', 'Spring', 'Angular 14', 'SCRUM', 'Mentoring'), current=True)
    + item('agosto 2017 — mayo 2022', 'Infowork S.L.',
           'Analista y fullstack · .NET, NodeJS y Angular',
           'Software de almacén, comunicaciones internas y tickets, integración con la máquina del TPV '
           'y el ERP, microservicios de venta/compra e importador de productos de proveedores.',
           ('.NET', 'NodeJS', 'GraphQL', 'Angular', 'SQL Server'))
    + item('octubre 2014 — mayo 2017', 'Freelance',
           'Desarrollador Android/Java y PHP',
           'Dos proyectos completos para clientes: <em>AlergiaStop</em> y <em>Guia Pueblo</em>. '
           'Requisitos, arquitectura, desarrollo y publicación en Google Play.',
           ('Android', 'Java', 'PHP', 'Laravel'))
    + '</div>'
)

PROJECTS = (
    '<h2>Proyectos</h2>'
    '<p class="muted">Ordenados por fecha, del más reciente al más antiguo.</p><div class="timeline">'
    + item('2026 — actualidad', 'MilioLab', 'Proyecto propio · Angular + Laravel',
           'Este sitio: CMS propio con web pública, panel y API. Tema «Nodos», mapa de nodos y Markdown.',
           ('Angular', 'Laravel', 'MariaDB', 'Docker'), current=True, href='https://miliolab.com')
    + item('noviembre 2026', 'Plugins de Jellyfin', 'Proyecto propio · C#',
           'Cinco plugins para ordenar una biblioteca multimedia: portadas, contenido adulto, nombres, '
           'filtrado y optimización de imágenes.',
           ('C#', 'Jellyfin'), href='https://github.com/nen155?tab=repositories')
    + item('abril 2023 — actualidad', 'Cinema Decisive', 'Proyecto propio · Python + Angular + Laravel',
           'CMS de experiencias cinematográficas que elige la siguiente escena según la emoción del '
           'público. Runtime con OpenCV, ONNX y VLC; editor Angular y API Laravel.',
           ('Python', 'OpenCV', 'ONNX', 'VLC', 'Angular'),
           href='https://github.com/nen155/cinema_decisive')
    + item('mayo 2022 — actualidad', 'Meteogalicia', 'Cliente: Xunta de Galicia · Sixtema',
           'Renovación del portal web <em>meteogalicia.gal</em>: analista, programador y mentoring con '
           'Spring Java 11 y Angular 14.',
           ('Java 11', 'Spring', 'Angular 14'))
    + item('octubre 2021', 'IntView', 'Proyecto propio · TypeScript',
           'Gestión de entrevistas no atendidas: grabación, revisión y evaluación desde el navegador.',
           ('TypeScript', 'Angular'), href='https://github.com/nen155/IntView')
    + item('agosto 2017 — mayo 2022', 'Infowork SGA', 'Cliente: Infowork S.L.',
           'Sistema de gestión de almacén: app Ionic 4, backend NodeJS con GraphQL, servicios ASP.NET '
           'y SQL Server. Código en repositorio privado, sin datos de empresa.',
           ('Ionic', 'GraphQL', 'ASP.NET', 'SQL Server'))
    + item('2017', 'TFG · SmartU', 'Proyecto fin de grado · Android + PHP',
           'Red social para Android con API REST en PHP (Slim) y back-office.',
           ('Android', 'Java', 'PHP'), href='https://github.com/nen155/TFG-SmartU-La-red-social')
    + item('marzo — julio 2017', 'FarmaSearch y LearningMixingColors', 'Proyectos de la carrera',
           'Búsqueda de farmacias cercanas con panel de administración, y app Ionic para mezclar colores '
           'pensada para niños con dificultades de aprendizaje.',
           ('Java', 'Ionic', 'JavaScript'))
    + item('octubre 2014 — mayo 2017', 'AlergiaStop', 'Cliente · Android',
           'App Android para aliviar síntomas de alergia con ejercicios de yoga: requisitos, arquitectura '
           'con patrones, i18n y publicación en Google Play.',
           ('Android', 'Java'))
    + item('octubre 2014 — junio 2015', 'Guia Pueblo', 'Cliente · Android + Laravel',
           'App para localizar comercios en pueblos pequeños, con gestión en Laravel y API REST en PHP; '
           'refactorización de código legacy.',
           ('Android', 'Laravel', 'PHP'))
    + item('mayo — junio 2008', 'CinemaWEBTPV', 'Proyecto propio · PHP',
           'TPV para administrar el contenido de una sala de cine.', ('PHP', 'MySQL'))
    + '</div>'
)

WEBS = (
    '<h2>Webs</h2><p class="muted">Sin fecha exacta de desarrollo; se indica el estado comprobado hoy.</p>'
    '<div class="timeline">'
    + item('cliente · online', 'Cold River Productions', 'Diseño y desarrollo web',
           'Web de producción audiovisual en Granada. <strong>Proyecto para un cliente</strong>; '
           'Cold River Productions no es una empresa propia.',
           ('WordPress', 'Diseño'), href='https://coldriverpro.com')
    + item('online', 'La Biblioteca Zurana', 'Web del proyecto cultural',
           'Sitio del proyecto cultural La Biblioteca Zurana.', ('Web',),
           href='https://labibliotecazurana.com')
    + item('online', 'Guia Pueblo', 'Web de la guía de negocios',
           'Guía de negocios y servicios locales de Granada.', ('Web',), href='https://guiapueblo.es')
    + item('online', 'Electrónica Raya', 'Tienda online',
           'Tienda de electrónica con catálogo y gestión de pedidos.', ('Web', 'eCommerce'),
           href='https://www.electronicaraya.com')
    + item('cerradas', 'ColoredMoon, Cresio, Fiesta en Granada y Jimesa', 'Proyectos finalizados',
           'ColoredMoon fue la versión anterior de este sitio; Cresio, Fiesta en Granada y Jimesa ya no '
           'están en servicio.')
    + '</div>'
)

ABOUT = (
    '<h2>Emilio Chica Jiménez</h2>'
    '<p>Ingeniero de software en Granada. Ahora trabajo en <strong>Sixtema S.L.</strong> renovando el '
    'portal meteorológico de la Xunta de Galicia, y antes pasé cinco años en <strong>Infowork S.L.</strong> '
    'construyendo software de almacén y ERP.</p>'
    '<p>Me gusta entender el problema antes de escribir código, decidir la arquitectura con criterio y '
    'dejar las cosas funcionando en producción.</p>'
    '<h3>Experiencia</h3><ul>'
    '<li><strong>Sixtema S.L.</strong> (mayo 2022 – actualidad). Analista, programador y mentoring; '
    'Spring Java 11 y Angular 14; cliente Xunta de Galicia (<em>meteogalicia.gal</em>), SCRUM con '
    'entregas mensuales.</li>'
    '<li><strong>Infowork S.L.</strong> (agosto 2017 – mayo 2022). Analista y fullstack .NET, NodeJS y '
    'Angular: almacén, comunicaciones y tickets, integración con TPV y ERP, microservicios e importador '
    'de proveedores.</li>'
    '<li><strong>Freelance</strong> (octubre 2014 – mayo 2017). Android/Java y PHP: <em>AlergiaStop</em> '
    'y <em>Guia Pueblo</em>, de los requisitos a Google Play.</li></ul>'
    '<h3>Formación</h3><ul>'
    '<li>Grado en Ingeniería Informática — ETSIIT, Granada (2013 – 2017). TFG: red social <em>SmartU</em>.</li>'
    '<li>Técnico Superior en Desarrollo de Aplicaciones Informáticas — IES Zaidín Vergeles (2010 – 2012).</li>'
    '<li>Curso de Inteligencia Artificial y Machine Learning (Udemy, 2020): NN, CNN y RNN con Python, '
    'PyTorch y OpenAI.</li>'
    '<li>Curso de Clean Code (2023, 30 h): arquitecturas hexagonales, patrones, TDD y DDD.</li></ul>'
)

SKILLS = (
    '<h2>Stack</h2><h3>Backend</h3><ul>'
    '<li>Java 11 con Spring y Angular 14 en el portal de Meteogalicia.</li>'
    '<li>.NET Framework y ASP.NET (servicios y APIs), C#.</li>'
    '<li>NodeJS con GraphQL y REST.</li>'
    '<li>PHP: Laravel y PHP nativo (API REST).</li>'
    '<li>SQL Server y MySQL/MariaDB: modelado, consultas y migraciones.</li></ul>'
    '<h3>Frontend</h3><ul>'
    '<li>Angular (standalone, signals, TypeScript estricto) y Angular 14 en producción.</li>'
    '<li>Ionic y Capacitor para apps híbridas.</li>'
    '<li>HTML semántico, CSS propio y accesibilidad.</li></ul>'
    '<h3>Móvil</h3><ul><li>Android nativo con Java.</li>'
    '<li>Ionic/Capacitor y publicación en Google Play.</li></ul>'
    '<h3>Datos, IA y multimedia</h3><ul>'
    '<li>Python para visión artificial: OpenCV, MediaPipe y modelos ONNX.</li>'
    '<li>Formación en machine learning: NN, CNN y RNN con PyTorch.</li>'
    '<li>Reproducción con libVLC y procesado de vídeo.</li></ul>'
    '<h3>Prácticas</h3><ul>'
    '<li>Clean Code, TDD, DDD y arquitecturas hexagonales (curso 2023).</li>'
    '<li>SCRUM con entregas mensuales y mentoring de compañeros.</li>'
    '<li>Docker, Git, CI y despliegue en hosting compartido.</li></ul>'
)


def main():
    token = os.environ.get('MILIOLAB_TOKEN')
    if not token:
        token = call('POST', '/auth/login', {'email': os.environ.get('MILIOLAB_EMAIL', ''), 'password': os.environ.get('MILIOLAB_PASSWORD', '')})['token']

    pages = {page['slug']: page['id'] for page in call('GET', '/admin/pages?per_page=100', token=token)['data']}

    updates = [
        ('proyectos', 'Proyectos', 'wide', 'Trayectoria y proyectos ordenados por fecha.', CAREER + PROJECTS + WEBS),
        ('sobre-mi', 'Sobre mí', 'default', 'Ingeniero de software en Granada.', ABOUT),
        ('habilidades', 'Habilidades', 'wide', 'El stack con el que trabajo.', SKILLS),
    ]

    for slug, title, template, excerpt, body in updates:
        call('PUT', f"/admin/pages/{pages[slug]}", {
            'title': title, 'slug': slug, 'template': template, 'status': 'published',
            'excerpt': excerpt, 'body': body,
        }, token)
        print('ok', slug)


if __name__ == '__main__':
    main()
