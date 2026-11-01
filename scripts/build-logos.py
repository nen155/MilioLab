"""Genera las propuestas de logo ECJ en SVG (adaptan tinta según el tema)."""

from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand')
OUT.mkdir(parents=True, exist_ok=True)

STYLE = """<style>
  .ink { fill: currentColor; } .accent { fill: #a855f7; } .soft { fill: #c4b5fd; }
  .line { stroke: #a855f7; } .line-soft { stroke: #c4b5fd; }
  @media (prefers-color-scheme: light) {
    .accent { fill: #6d28d9; } .soft { fill: #7c6cf0; }
    .line { stroke: #6d28d9; } .line-soft { stroke: #7c6cf0; }
  }
</style>"""

SERIF = 'Georgia, "Iowan Old Style", "Palatino Linotype", serif'
MONO = 'ui-monospace, Consolas, "Courier New", monospace'


def svg(body, width=120, height=120, title=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            f'width="{width}" height="{height}" role="img" aria-label="Logo ECJ · {title}">'
            f'<title>ECJ · {title}</title>{STYLE}{body}</svg>\n')


# 01 · escala — tres tamaños, tres tonos
l01 = svg(
    f'<text x="12" y="64" font-family=\'{SERIF}\' font-size="54" font-weight="700" class="ink">E</text>'
    f'<text x="46" y="88" font-family=\'{SERIF}\' font-size="40" font-weight="700" class="accent">C</text>'
    f'<text x="78" y="108" font-family=\'{SERIF}\' font-size="26" font-weight="700" class="soft">J</text>',
    title='escala')

# 02 · sello — círculo + punto de muestra
l02 = svg(
    '<circle cx="60" cy="60" r="50" fill="none" class="line" stroke-width="2.5"/>'
    f'<text x="60" y="70" text-anchor="middle" font-family=\'{SERIF}\' font-size="30" '
    'font-weight="700" class="ink">ECJ</text>'
    '<circle cx="60" cy="23" r="3.2" class="accent"/>',
    title='sello')

# 03 · geometría — E de barras, C y J de trazo (con aire)
l03 = svg(
    '<g class="ink"><rect x="10" y="34" width="28" height="6" rx="3"/>'
    '<rect x="10" y="50" width="20" height="6" rx="3"/>'
    '<rect x="10" y="66" width="28" height="6" rx="3"/></g>'
    '<path d="M52 34 a18 18 0 1 0 0 36" fill="none" class="line" stroke-width="6" stroke-linecap="round"/>'
    '<path d="M88 34 v28 a11 11 0 0 1 -22 0" fill="none" class="line-soft" stroke-width="6" stroke-linecap="round"/>',
    title='geometría')

# 04 · monograma — contorno único, relleno tenue
l04 = svg(
    f'<text x="60" y="80" text-anchor="middle" font-family=\'{SERIF}\' font-size="52" font-weight="700" '
    'fill="none" class="line" stroke-width="1.8" letter-spacing="-2">ECJ</text>'
    f'<text x="60" y="80" text-anchor="middle" font-family=\'{SERIF}\' font-size="52" font-weight="700" '
    'class="accent" opacity=".22" letter-spacing="-2">ECJ</text>',
    title='monograma')

# 05 · terminal — prompt + identificador
l05 = svg(
    '<rect x="8" y="8" width="104" height="104" rx="12" fill="none" class="line" stroke-width="2"/>'
    f'<text x="18" y="44" font-family=\'{MONO}\' font-size="16" class="soft">$</text>'
    f'<text x="32" y="44" font-family=\'{MONO}\' font-size="16" class="ink">ecj</text>'
    '<rect x="18" y="56" width="56" height="2" class="accent"/>'
    f'<text x="18" y="80" font-family=\'{MONO}\' font-size="11" class="soft">lab_01</text>'
    f'<rect x="18" y="90" width="12" height="10" class="accent" opacity=".7"/>',
    title='terminal')

# 06 · retícula — letras sobre papel milimetrado
grid = ''.join(
    f'<line x1="{x}" y1="18" x2="{x}" y2="102" class="line-soft" stroke-width=".6" opacity=".35"/>'
    for x in (36, 60, 84)
) + ''.join(
    f'<line x1="12" y1="{y}" x2="108" y2="{y}" class="line-soft" stroke-width=".6" opacity=".35"/>'
    for y in (36, 60, 84)
)
l06 = svg(
    grid +
    f'<text x="16" y="54" font-family=\'{SERIF}\' font-size="32" font-weight="700" class="ink">E</text>'
    f'<text x="44" y="76" font-family=\'{SERIF}\' font-size="32" font-weight="700" class="accent">C</text>'
    f'<text x="72" y="98" font-family=\'{SERIF}\' font-size="32" font-weight="700" class="soft">J</text>',
    title='retícula')

# Favicons (con fondo, para que se lean en la pestaña)
FAV_BG = '<rect width="120" height="120" rx="26" fill="#120e1d"/>'
fav1 = svg(FAV_BG +
           f'<text x="14" y="62" font-family=\'{SERIF}\' font-size="50" font-weight="700" fill="#f1ecff">E</text>'
           f'<text x="46" y="86" font-family=\'{SERIF}\' font-size="38" font-weight="700" fill="#a855f7">C</text>'
           f'<text x="78" y="106" font-family=\'{SERIF}\' font-size="25" font-weight="700" fill="#c4b5fd">J</text>',
           title='favicon escala')
fav2 = svg(FAV_BG +
           '<circle cx="60" cy="60" r="42" fill="none" stroke="#a855f7" stroke-width="6"/>'
           f'<text x="60" y="72" text-anchor="middle" font-family=\'{SERIF}\' font-size="30" '
           'font-weight="700" fill="#f1ecff">ECJ</text>',
           title='favicon sello')
fav3 = svg(FAV_BG +
           '<g fill="#f1ecff"><rect x="22" y="40" width="26" height="8" rx="4"/>'
           '<rect x="22" y="56" width="18" height="8" rx="4"/>'
           '<rect x="22" y="72" width="26" height="8" rx="4"/></g>'
           '<path d="M58 40 a16 16 0 1 0 0 32" fill="none" stroke="#a855f7" stroke-width="8" stroke-linecap="round"/>'
           '<path d="M92 40 v22 a9 9 0 0 1 -18 0" fill="none" stroke="#c4b5fd" stroke-width="8" stroke-linecap="round"/>',
           title='favicon geometría')

files = {
    'logo-01-escala.svg': l01,
    'logo-02-sello.svg': l02,
    'logo-03-geometria.svg': l03,
    'logo-04-monograma.svg': l04,
    'logo-05-terminal.svg': l05,
    'logo-06-reticula.svg': l06,
    'favicon-01-escala.svg': fav1,
    'favicon-02-sello.svg': fav2,
    'favicon-03-geometria.svg': fav3,
}

for name, content in files.items():
    (OUT / name).write_text(content, encoding='utf-8')

cards = ''.join(
    f'<figure class="card{" fav" if name.startswith("favicon") else ""}">'
    f'<img src="{name}" alt="{name}"><figcaption>{name.replace(".svg", "")}</figcaption></figure>'
    for name in files
)

preview = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>ECJ · logos</title>
<style>
  body {{ font-family: Georgia, serif; background:#0e0b16; color:#f1ecff; padding:32px; }}
  h1 {{ font-size:20px; margin:0 0 6px; }}
  p {{ font-family: ui-monospace, monospace; font-size:11px; color:#9a8fc0; margin:0 0 24px; }}
  .grid {{ display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; max-width:1100px; }}
  .card {{ margin:0; padding:16px; border:1px solid #2e2450; border-radius:12px;
           background:linear-gradient(180deg,#17112a,#0e0b16); text-align:center; color:#f1ecff; }}
  .card img {{ width:120px; height:120px; }}
  .card.fav img {{ width:56px; height:56px; }}
  figcaption {{ font-family: ui-monospace, monospace; font-size:10px; color:#c4b5fd; margin-top:10px; }}
  .light {{ background:#f6f3ea; color:#17161a; margin-top:32px; padding:24px; border-radius:12px; }}
  .light p {{ color:#6d6a63; }}
  .light .card {{ background:#fff; border-color:#d9d3c4; color:#17161a; }}
</style></head>
<body>
  <h1>ECJ · propuestas en SVG</h1>
  <p>se adaptan al tema del navegador · abre cada .svg para verlo suelto</p>
  <div class="grid">{cards}</div>

  <div class="light">
    <h1>Sobre fondo claro</h1>
    <div class="grid">{cards}</div>
  </div>
</body></html>
"""

(OUT / 'preview.html').write_text(preview, encoding='utf-8')
print('ok', len(files) + 1, 'archivos en', OUT)
