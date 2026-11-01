"""Iteración 03-4: C del mismo alto que la E, huecos iguales y J más redondeada."""

from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand\iteracion-03-4')
OUT.mkdir(parents=True, exist_ok=True)

PALETTES = {
    'dark': {'ink': '#f1ecff', 'accent': '#a855f7'},
    'light': {'ink': '#17161a', 'accent': '#6d28d9'},
}

# Geometría común (viewBox 120)
# E: x 6..30 (24 de ancho), alto 40 (3 barras de 8 + 2 huecos de 8), y 30..70
# C: r 20 → alto 40, ocupa x 38..58
# J: palo en x 66 → hueco C→J = 8, igual que E→C = 8
S = 7          # grosor de trazo
GAP = 11       # hueco VISUAL entre letras
E_X, E_TOP, E_W, E_MID, E_H, E_GAP = 6, 30, 24, 16, 7, 10
C_R = 20                       # alto de la C = 2r = 40 = alto de la E
C_CX = E_X + E_W + GAP + S / 2 + C_R   # 6+24+8+4+20 = 62
C_TOP = E_TOP
J_X = C_CX + S / 2 + GAP + S / 2   # 62+4+8+4 = 78
J_TOP = E_TOP


def svg(body, title, mode):
    palette = PALETTES[mode]
    style = (f'<style>.ink {{ fill: {palette["ink"]}; }} .s-ink {{ stroke: {palette["ink"]}; }} '
             f'.accent {{ fill: {palette["accent"]}; }} .s-accent {{ stroke: {palette["accent"]}; }}</style>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
            f'role="img" aria-label="ECJ {title}"><title>ECJ · {title}</title>{style}{body}</svg>\n')


E = (f'<g class="ink">'
     f'<rect x="{E_X}" y="{E_TOP}" width="{E_W}" height="{E_H}" rx="4"/>'
     f'<rect x="{E_X}" y="{E_TOP + E_H + E_GAP}" width="{E_MID}" height="{E_H}" rx="4"/>'
     f'<rect x="{E_X}" y="{E_TOP + 2 * (E_H + E_GAP)}" width="{E_W}" height="{E_H}" rx="4"/></g>')

C = (f'<path d="M{C_CX} {C_TOP} a{C_R} {C_R} 0 1 0 0 {2 * C_R}" fill="none" class="s-accent" '
     f'stroke-width="{S}" stroke-linecap="round"/>')

# J · codo grande (radio 16) + cola con extremo redondeado que sube
J_ROUND = (f'<path d="M{J_X} {J_TOP} V65 a19 19 0 0 1 -19 19 H24 a14 14 0 0 1 -14 -14" '
           f'fill="none" class="s-ink" stroke-width="{S}" stroke-linecap="round" stroke-linejoin="round"/>')

# J · codo grande + cola recta hasta el borde con extremo redondeado
J_FLAT = (f'<path d="M{J_X} {J_TOP} V65 a19 19 0 0 1 -19 19 H10" '
          f'fill="none" class="s-ink" stroke-width="{S}" stroke-linecap="round" stroke-linejoin="round"/>')

A = E + C + J_ROUND
B = E + C + J_FLAT

# Favicon: mismo dibujo con fondo
FAV = ('<rect width="120" height="120" rx="26" fill="#120e1d"/>'
       '<g fill="#f1ecff">'
       '<rect x="6" y="30" width="24" height="8" rx="4"/>'
       '<rect x="6" y="46" width="16" height="8" rx="4"/>'
       '<rect x="6" y="62" width="24" height="8" rx="4"/></g>'
       '<path d="M62 30 a20 20 0 1 0 0 40" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>'
       '<path d="M78 30 V65 a19 19 0 0 1 -19 19 H24 a14 14 0 0 1 -14 -14" fill="none" stroke="#f1ecff" '
       'stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>')

files = {}
for name, body in {'03-4a-cola-levantada': A, '03-4b-cola-recta': B}.items():
    files[f'{name}-dark.svg'] = svg(body, name, 'dark')
    files[f'{name}-light.svg'] = svg(body, name, 'light')

files['03-4a-favicon.svg'] = svg(FAV, 'favicon', 'dark')

for name, content in files.items():
    (OUT / name).write_text(content, encoding='utf-8')

dark_cards = ''.join(
    f'<figure class="card"><img src="{n}-dark.svg" alt="{n}"><figcaption>{n}</figcaption></figure>'
    for n in ('03-4a-cola-levantada', '03-4b-cola-recta')
)
light_cards = ''.join(
    f'<figure class="card"><img src="{n}-light.svg" alt="{n}"><figcaption>{n}</figcaption></figure>'
    for n in ('03-4a-cola-levantada', '03-4b-cola-recta')
)

preview = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>ECJ · iteración 03-4</title>
<style>
  body {{ font-family: Georgia, serif; background:#0e0b16; color:#f1ecff; padding:32px; }}
  h1 {{ font-size: 20px; margin: 0 0 4px; }}
  p {{ font-family: ui-monospace, monospace; font-size: 11px; color:#9a8fc0; margin: 0 0 22px; }}
  .grid {{ display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; max-width: 640px; }}
  .card {{ margin:0; padding:18px; border:1px solid #2e2450; border-radius:12px; text-align:center;
           background:linear-gradient(180deg,#17112a,#0e0b16); }}
  .card img {{ width:190px; height:190px; }}
  figcaption {{ font-family: ui-monospace, monospace; font-size:10px; color:#c4b5fd; margin-top:10px; }}
  .light {{ background:#f6f3ea; color:#17161a; margin-top:28px; padding:22px; border-radius:12px; }}
  .light .card {{ background:#fff; border-color:#d9d3c4; }}
  .sizes {{ display:flex; gap:18px; align-items:flex-end; margin-top:26px; }}
  .sizes img {{ width:72px; height:72px; }}
  .sizes img.m {{ width:40px; height:40px; }} .sizes img.s {{ width:24px; height:24px; }}
  .sizes img.xs {{ width:16px; height:16px; }}
  .ref {{ display:flex; gap:14px; align-items:center; margin-top:14px; font-family: ui-monospace, monospace; font-size:10px; color:#9a8fc0; }}
  .ref img {{ width:60px; height:60px; }}
</style></head>
<body>
  <h1>ECJ · cuarta iteración geométrica</h1>
  <p>la C mide lo mismo que la E · hueco E–C = hueco C–J = 8 · J con codo redondeado</p>
  <div class="grid">{dark_cards}</div>

  <div class="sizes">
    <img src="03-4a-favicon.svg" alt="72"><img src="03-4a-favicon.svg" class="m" alt="40">
    <img src="03-4a-favicon.svg" class="s" alt="24"><img src="03-4a-favicon.svg" class="xs" alt="16">
  </div>

  <div class="light">
    <h1>Sobre fondo claro</h1>
    <div class="grid">{light_cards}</div>
  </div>
</body></html>
"""

(OUT / 'preview.html').write_text(preview, encoding='utf-8')
print('ok', len(files) + 1, 'en', OUT)
