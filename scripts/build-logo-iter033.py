"""Iteración 03-3: distancias iguales y la cola de la J subrayando E y C."""

from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand\iteracion-03-3')
OUT.mkdir(parents=True, exist_ok=True)

PALETTES = {
    'dark': {'ink': '#f1ecff', 'accent': '#a855f7'},
    'light': {'ink': '#17161a', 'accent': '#6d28d9'},
}


def style_for(mode):
    p = PALETTES[mode]
    return (f'<style>.ink {{ fill: {p["ink"]}; }} .s-ink {{ stroke: {p["ink"]}; }} '
            f'.accent {{ fill: {p["accent"]}; }} .s-accent {{ stroke: {p["accent"]}; }}</style>')


def svg(body, title, mode='dark'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
            f'role="img" aria-label="ECJ {title}"><title>ECJ · {title}</title>{style_for(mode)}{body}</svg>\n')


def e(x, top, w, mid, h, gap):
    return (f'<g class="ink">'
            f'<rect x="{x}" y="{top}" width="{w}" height="{h}" rx="3.5"/>'
            f'<rect x="{x}" y="{top + gap}" width="{mid}" height="{h}" rx="3.5"/>'
            f'<rect x="{x}" y="{top + 2 * gap}" width="{w}" height="{h}" rx="3.5"/></g>')


def c(cx, top, r, width):
    return (f'<path d="M{cx} {top} a{r} {r} 0 1 0 0 {2 * r}" fill="none" class="s-accent" '
            f'stroke-width="{width}" stroke-linecap="round"/>')


def j(stem_x, top, bottom, tail_x, width, upturn=0):
    """Stem vertical + cola horizontal que subraya; upturn>0 levanta el extremo."""
    if upturn:
        end = f'L{tail_x + upturn} {bottom} a{upturn} {upturn} 0 0 0 -{upturn} -{upturn}'
    else:
        end = f'L{tail_x} {bottom}'

    return (f'<path d="M{stem_x} {top} V{bottom} {end}" fill="none" class="s-ink" '
            f'stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')


# A · cola recta que subraya todo, con pequeño levantamiento al final
a = svg(
    e(6, 26, 26, 18, 7, 17) +
    c(55, 28, 16, 7) +
    j(62, 28, 82, 8, 7, upturn=6),
    'A · cola con swash')

# B · cola recta sin levantamiento (más limpia, más «subrayado»)
b = svg(
    e(6, 24, 26, 18, 7, 17) +
    c(55, 26, 16, 7) +
    j(62, 26, 84, 6, 7),
    'B · subrayado recto')

# C · trazo grueso y cola con swash más marcado
c_ = svg(
    e(5, 22, 27, 18, 8, 18) +
    c(56, 24, 17, 8) +
    j(64, 24, 86, 6, 8, upturn=8),
    'C · grueso')

# D · la J sube por encima de la C (stem alto) y la cola pasa por debajo
d = svg(
    e(6, 28, 26, 18, 7, 16) +
    c(54, 30, 15, 7) +
    j(61, 22, 84, 6, 7, upturn=5),
    'D · stem alto')

fav = svg(
    '<rect width="120" height="120" rx="26" fill="#120e1d"/>'
    '<g fill="#f1ecff">'
    '<rect x="6" y="26" width="26" height="7" rx="3.5"/>'
    '<rect x="6" y="43" width="18" height="7" rx="3.5"/>'
    '<rect x="6" y="60" width="26" height="7" rx="3.5"/></g>'
    '<path d="M55 28 a16 16 0 1 0 0 32" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>'
    '<path d="M62 28 V82 L14 82 a6 6 0 0 0 -6 -6" fill="none" stroke="#f1ecff" stroke-width="7" '
    'stroke-linecap="round" stroke-linejoin="round"/>',
    'favicon')

designs = {'03-3a-swash': a, '03-3b-subrayado': b, '03-3c-grueso': c_, '03-3d-stem-alto': d}
files = {}

for name, dark_svg in designs.items():
    files[f'{name}-dark.svg'] = dark_svg
    files[f'{name}-light.svg'] = dark_svg.replace('#f1ecff', '#17161a').replace('#a855f7', '#6d28d9')

files['03-3a-favicon.svg'] = fav

for name, content in files.items():
    (OUT / name).write_text(content, encoding='utf-8')

dark_cards = ''.join(
    f'<figure class="card"><img src="{name}-dark.svg" alt="{name}"><figcaption>{name}</figcaption></figure>'
    for name in designs
)
light_cards = ''.join(
    f'<figure class="card"><img src="{name}-light.svg" alt="{name}"><figcaption>{name}</figcaption></figure>'
    for name in designs
)

preview = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>ECJ · iteración 03-3</title>
<style>
  body {{ font-family: Georgia, serif; background:#0e0b16; color:#f1ecff; padding:32px; }}
  h1 {{ font-size: 20px; margin: 0 0 4px; }}
  p {{ font-family: ui-monospace, monospace; font-size: 11px; color:#9a8fc0; margin: 0 0 22px; }}
  .grid {{ display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; max-width: 880px; }}
  .card {{ margin:0; padding:18px; border:1px solid #2e2450; border-radius:12px; text-align:center;
           background:linear-gradient(180deg,#17112a,#0e0b16); color:#f1ecff; }}
  .card img {{ width:160px; height:160px; }}
  figcaption {{ font-family: ui-monospace, monospace; font-size:10px; color:#c4b5fd; margin-top:10px; }}
  .light {{ background:#f6f3ea; color:#17161a; margin-top:28px; padding:22px; border-radius:12px; }}
  .light .card {{ background:#fff; border-color:#d9d3c4; color:#17161a; }}
  .light p {{ color:#6d6a63; }}
  .sizes {{ display:flex; gap:18px; align-items:flex-end; margin-top:26px; }}
  .sizes img {{ width:72px; height:72px; }}
  .sizes img.m {{ width:40px; height:40px; }}
  .sizes img.s {{ width:24px; height:24px; }}
  .sizes img.xs {{ width:16px; height:16px; }}
</style></head>
<body>
  <h1>ECJ · tercera iteración geométrica</h1>
  <p>distancias iguales · la cola de la J subraya E y C · funciona en claro y oscuro</p>
  <div class="grid">{dark_cards}</div>

  <div class="sizes">
    <img src="03-3a-favicon.svg" alt="72"><img src="03-3a-favicon.svg" class="m" alt="40">
    <img src="03-3a-favicon.svg" class="s" alt="24"><img src="03-3a-favicon.svg" class="xs" alt="16">
  </div>

  <div class="light">
    <h1>Sobre fondo claro</h1>
    <div class="grid">{dark_cards}</div>
  </div>
</body></html>
"""

(OUT / 'preview.html').write_text(preview, encoding='utf-8')
print('ok', len(files) + 1, 'en', OUT)
