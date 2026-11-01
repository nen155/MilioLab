"""Genera CV Emilio Chica Jimenez 2026.docx (OOXML mínimo, sin dependencias)."""

import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(r'F:\Mis documentos\My eBooks\CV Emilio Chica 2026\CV Emilio Chica Jimenez 2026.docx')

ACCENT = '4F46E5'
INK = '1B1B1B'
MUTED = '666666'


def run(text, bold=False, italic=False, size=None, color=None, mono=False):
    props = []
    if bold:
        props.append('<w:b/>')
    if italic:
        props.append('<w:i/>')
    if size:
        props.append(f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>')
    if color:
        props.append(f'<w:color w:val="{color}"/>')
    if mono:
        props.append('<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>')
    rpr = f'<w:rPr>{"".join(props)}</w:rPr>' if props else ''
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def para(inner, space_after=60, space_before=0, align=None, border=False, indent=None):
    props = [f'<w:spacing w:before="{space_before}" w:after="{space_after}"/>']
    if align:
        props.append(f'<w:jc w:val="{align}"/>')
    if indent:
        props.append(f'<w:ind w:left="{indent}"/>')
    if border:
        props.append('<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="C9C4B6"/></w:pBdr>')
    return f'<w:p><w:pPr>{"".join(props)}</w:pPr>{inner}</w:p>'


def h1(text):
    return para(run(text, bold=True, size=44), space_after=20)


def role(text):
    return para(run(text.upper(), bold=True, size=17, color=ACCENT, mono=True), space_after=40)


def contact(text):
    return para(run(text, size=17, color=MUTED, mono=True), space_after=160)


def h2(text):
    return para(run(text.upper(), bold=True, size=18, mono=True, color='111111'),
                space_before=200, space_after=80, border=True)


def h3(text):
    return para(run(text, bold=True, size=22), space_before=120, space_after=20)


def meta(text):
    return para(run(text, size=17, color=MUTED, mono=True), space_after=40)


def p(text, size=21, color=INK, space_after=80):
    return para(run(text, size=size, color=color), space_after=space_after)


def bullet(text, size=21):
    return para(run('•  ', size=size) + run(text, size=size), space_after=40, indent=280)


def table(rows):
    cells = []

    for index, (left, right) in enumerate(rows):
        head = index == 0
        cells.append(
            '<w:tr>'
            f'<w:tc><w:tcPr><w:tcW w:w="1900" w:type="dxa"/></w:tcPr>'
            f'{para(run(left, bold=head, size=18, mono=head, color=MUTED if head else INK), space_after=20)}</w:tc>'
            f'<w:tc><w:tcPr><w:tcW w:w="7000" w:type="dxa"/></w:tcPr>'
            f'{para(run(right, size=18, color=MUTED if head else INK), space_after=20)}</w:tc>'
            '</w:tr>'
        )

    return ('<w:tbl><w:tblPr><w:tblW w:w="8900" w:type="dxa"/>'
            '<w:tblBorders><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E3DFD3"/></w:tblBorders>'
            f'</w:tblPr>{"".join(cells)}</w:tbl>')


BODY = [
    h1('Emilio Chica Jiménez'),
    role('Ingeniero de software · Tech Lead transversal'),
    contact('Granada, España · nen156@gmail.com · github.com/nen155 · linkedin.com/in/emilio-chica-jimenez · miliolab.com'),

    h2('Perfil'),
    p('Ingeniero de software con más de diez años construyendo producto de punta a punta: requisitos, '
      'arquitectura, desarrollo, despliegue y mantenimiento. Actualmente Tech Lead transversal en Sixtema, con '
      'proyectos para la Xunta de Galicia, la Real Academia Galega, INTECMAR y RubioCar. Trabajo con '
      'Spec-Driven Development (SDD) y asistencia de IA: el análisis, la arquitectura y el stack los decido a '
      'mano y quedan especificados antes de implementar; la IA acelera la generación de código y yo reviso, '
      'pruebo y mantengo.'),

    h2('Experiencia'),
    h3('Sixtema S.L. — Tech Lead transversal, analista y programador'),
    meta('Mayo 2022 – actualidad · Galicia'),
    bullet('MeteoGalicia (Xunta de Galicia): renovación del portal meteorológico con Angular 14 y Spring Java 11. '
           'Análisis, desarrollo y mentoring; SCRUM con entregas mensuales.'),
    bullet('GaliciaNomeada (Real Academia Galega): mantenimiento, mejora de rendimiento y nuevas funcionalidades '
           'sobre el sistema de toponimia existente (SVN).'),
    bullet('Gestor del Nomenclátor de Galicia: análisis funcional, modelo de datos y desarrollo del gestor interno.'),
    bullet('INTECMAR: coordinación y mantenimiento de los sistemas del instituto.'),
    bullet('RubioCar: software nuevo para la gestión de flotas de autobuses; arquitectura, stack y especificación.'),
    bullet('Tech Lead transversal: soporte técnico y coordinación de varios proyectos del equipo (2 años).'),

    h3('Infowork S.L. — Analista y fullstack .NET, NodeJS y Angular'),
    meta('Agosto 2017 – mayo 2022 · Granada'),
    bullet('SGA (gestión de almacén): requisitos con los operarios, arquitectura y desarrollo fullstack con '
           'Ionic 4, NodeJS + GraphQL, ASP.NET y SQL Server.'),
    bullet('Integración con la máquina del TPV y el ERP interno; microservicios de venta y compra.'),
    bullet('Importador de productos de proveedores hacia la base de datos del ERP.'),
    bullet('Mantenimiento del CRM de escritorio (.NET Framework) en paralelo.'),

    h3('Freelance — Desarrollador Android/Java y PHP'),
    meta('Octubre 2014 – mayo 2017 · Granada'),
    bullet('AlergiaStop: app Android para aliviar síntomas de alergia con ejercicios de yoga. Requisitos, '
           'arquitectura con patrones, i18n y publicación en Google Play.'),
    bullet('Guia Pueblo: app Android para localizar comercios en pueblos pequeños, con gestión en Laravel y API '
           'REST en PHP; refactorización de código legacy.'),

    h2('Proyectos propios'),
    bullet('MilioLab (2026) — CMS propio con web pública en Angular, panel de edición y API en Laravel.'),
    bullet('Cinema Decisive (2023 – actualidad) — experiencias cinematográficas que cambian según la emoción del '
           'público. Runtime en Python (OpenCV, ONNX, VLC), editor Angular y API Laravel.'),
    bullet('Game-to-Web (2025 – actualidad) — pipeline de trece fases para llevar cualquier juego al navegador.'),
    bullet('Plugins de Jellyfin (2026) — cinco plugins en C# para ordenar una biblioteca multimedia.'),
    bullet('IntView (2021) — gestión de entrevistas no atendidas desde el navegador.'),
    bullet('SmartU (2017) — red social para Android con API REST en PHP (TFG).'),

    h2('Habilidades'),
    table([
        ('Área', 'Tecnologías y años'),
        ('Backend', 'Java + Spring (2022–act.), .NET / C# (2017–2022), NodeJS + GraphQL (2018–2022), '
                    'PHP + Laravel (2014–act.), SQL Server (2017–act.), MySQL/MariaDB (2014–act.)'),
        ('Frontend', 'Angular (2018–act.), Ionic (2018–2022)'),
        ('Móvil', 'Android / Java (2014–2017)'),
        ('Datos e IA', 'Python (2020–act.), OpenCV (2023–act.), ONNX (2025–act.), DeepFace en las primeras '
                       'iteraciones de Cinema Decisive'),
        ('Herramientas', 'Git (2014–act., salvo GaliciaNomeada con SVN), Docker (uso puntual, compose generado '
                         'con IA), VLC/libVLC'),
        ('Prácticas', 'SDD, Clean Code, TDD, DDD, arquitecturas hexagonales, SCRUM'),
        ('Soft skills', 'Análisis de requisitos y comunicación con cliente (todos los proyectos), arquitectura, '
                        'mentoring, coordinación de equipo, Tech Lead transversal (2 años), documentación'),
    ]),
    para(run('Nota honesta sobre los tiempos. ', bold=True, size=19, color=ACCENT)
         + run('Desde 2024 las implementaciones y el desarrollo en frameworks y lenguajes se hacen con generación '
               'de código por IA: los años indican cuándo empecé a usar la tecnología, no años de escritura manual.',
               size=19, color='333333'), space_before=120, space_after=120),

    h2('Formación'),
    bullet('Grado en Ingeniería Informática — ETSIIT, Granada (2013 – 2017). TFG: red social SmartU.'),
    bullet('Técnico Superior en Desarrollo de Aplicaciones Informáticas — IES Zaidín Vergeles (2010 – 2012).'),
    bullet('Curso de Inteligencia Artificial y Machine Learning — Udemy (2020): NN, CNN y RNN con Python, PyTorch y OpenAI.'),
    bullet('Curso de Clean Code — 30 h (2023): arquitecturas hexagonales, patrones, TDD y DDD.'),

    para(run('Última actualización: noviembre de 2026 · versión web en miliolab.com', size=16, color=MUTED, mono=True),
         space_before=200),
]

DOCUMENT = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:body>' + ''.join(BODY) +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
    '<w:pgMar w:top="1020" w:right="1020" w:bottom="1020" w:left="1020"/></w:sectPr>'
    '</w:body></w:document>'
)

CONTENT_TYPES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" '
    'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    '</Types>'
)

RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    'Target="word/document.xml"/></Relationships>'
)

OUT.parent.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.writestr('[Content_Types].xml', CONTENT_TYPES)
    archive.writestr('_rels/.rels', RELS)
    archive.writestr('word/document.xml', DOCUMENT)

print('ok', OUT, OUT.stat().st_size)
