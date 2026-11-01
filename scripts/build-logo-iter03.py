"""Iteración del logo geométrico ECJ (variante 03): más aire entre letras."""

from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand\iteracion-03')
OUT.mkdir(parents=True, exist_ok=True)

STYLE = """<style>
  .ink { fill: currentColor; } .accent { fill: #a855f7; } .soft { fill: #c4b5fd; }
  .s-ink { stroke: currentColor; } .s-accent { stroke: #a855f7; } .s-soft { stroke: #c4b5fd; }
</style>"""


def svg(body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
            f'role="img" aria-label="ECJ {title}"><title>ECJ · {title}</title>{STYLE}{body}</svg>\n')


def e_bars(x, y, w, mid, h, gap, cls='ink'):
    return (f'<g class="{cls}">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3"/>'
            f'<rect x="{x}" y="{y + gap}" width="{mid}" height="{h}" rx="3"/>'
            f'<rect x="{x}" y="{y + 2 * gap}" width="{w}" height="{h}" rx="3"/></g>')


def c_arc(cx, top, r, width, cls='s-accent'):
    return (f'<path d="M{cx} {top} a{r} {r} 0 1 0 0 {2 * r}" fill="none" '
            f'class="{cls}" stroke-width="{width}" stroke-linecap="round"/>')


def j_hook(x, top, r, width, cls='s-soft'):
    return (f'<path d="M{x} {top} v{2 * r - 4} a{r} {r} 0 0 1 -{2 * r} 0" fill="none" '
            f'class="{cls}" stroke-width="{width}" stroke-linecap="round"/>')


# A · aire entre letras (E termina en 32, C empieza en 41, J en 64)
a = svg(
    e_bars(6, 36, 26, 18, 7, 18) +
    c_arc(58, 38, 17, 7) +
    j_hook(86, 38, 11, 7),
    'A · aire')

# B · trazo más grueso, misma separación
b = svg(
    e_bars(4, 32, 26, 18, 9, 20) +
    c_arc(60, 34, 17, 9) +
    j_hook(90, 34, 12, 9),
    'B · trazo grueso')

# C · monocromo con la C en acento, más compacto
c = svg(
    e_bars(8, 38, 22, 15, 6, 16, 'ink') +
    c_arc(56, 40, 15, 6) +
    j_hook(82, 40, 10, 6),
    'C · compacto')

# D · tres celdas iguales (E 4–34, C 40–70, J 76–106)
d = svg(
    e_bars(4, 38, 26, 18, 7, 18) +
    c_arc(68, 38, 15, 7) +
    j_hook(104, 38, 11, 7),
    'D · celdas')

# Favicon del A (con fondo redondeado, colores fijos para la pestaña)
fav = svg(
    '<rect width="120" height="120" rx="26" fill="#120e1d"/>'
    '<g fill="#f1ecff">'
    '<rect x="6" y="36" width="26" height="7" rx="3"/>'
    '<rect x="6" y="54" width="18" height="7" rx="3"/>'
    '<rect x="6" y="72" width="26" height="7" rx="3"/></g>'
    '<path d="M58 38 a17 17 0 1 0 0 34" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>'
    '<path d="M86 38 v18 a11 11 0 0 1 -22 0" fill="none" stroke="#c4b5fd" stroke-width="7" stroke-linecap="round"/>',
    'favicon A')

files = {
    '03a-aire.svg': a,
    '03b-trazo-grueso.svg': b,
    '03c-compacto.svg': c,
    '03d-celdas.svg': d,
    '03a-favicon.svg': fav,
}

for name, content in files.items():
    (OUT / name).write_text(content, encoding='utf-8')

cards = ''.join(
    f'<figure class="card"><img src="{name}" alt="{name}"><figcaption>{name.replace(".svg", "")}</figcaption></figure>'
    for name in files
)

preview = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>ECJ · iteración 03</title>
<style>
  body {{ font-family: Georgia, serif; background:#0e0b16; color:#f1ecff; padding:32px; }}
  h1 {{ font-size: 20px; margin: 0 0 4px; }}
  p {{ font-family: ui-monospace, monospace; font-size: 11px; color:#9a8fc0; margin: 0 0 22px; }}
  .grid {{ display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; max-width: 860px; }}
  .card {{ margin:0; padding:18px; border:1px solid #2e2450; border-radius:12px; text-align:center;
           background:linear-gradient(180deg,#17112a,#0e0b16); color:#f1ecff; }}
  .card img {{ width:150px; height:150px; }}
  figcaption {{ font-family: ui-monospace, monospace; font-size:10px; color:#c4b5fd; margin-top:10px; }}
  .light {{ background:#f6f3ea; color:#17161a; margin-top:28px; padding:22px; border-radius:12px; }}
  .light .card {{ background:#fff; border-color:#d9d3c4; color:#17161a; }}
  .light p {{ color:#6d6a63; }}
  .row {{ display:flex; gap:18px; align-items:flex-end; margin-top:26px; }}
  .row img {{ width:64px; height:64px; }}
  .row img.small {{ width:32px; height:32px; }}
  .row img.tiny {{ width:16px; height:16px; }}
</style></head>
<body>
  <h1>ECJ · variante geométrica, con aire</h1>
  <p>la E ya no toca la C · prueba a 16, 32 y 64 px</p>
  <div class="grid">{cards}</div>

  <div class="row">
    <img src="03a-favicon.svg" alt="64"><img src="03a-favicon.svg" class="small" alt="32"><img src="03a-favicon.svg" class="tiny" alt="16">
  </div>

  <div class="light">
    <h1>Sobre fondo claro</h1>
    <div class="grid">{cards}</div>
  </div>
</body></html>
"""

(OUT / 'preview.html').write_text(preview, encoding='utf-8')
print('ok', len(files) + 1, 'en', OUT)
