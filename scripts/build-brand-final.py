"""Genera el paquete definitivo del logo ECJ (variante 03-9b · cerca 4)."""

import math
from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand')
WEB = Path(r'F:\Mis documentos\GitHub\MilioLab\apps\web\public')

S = 7
E_X, E_TOP, E_W, E_MID, E_H, E_GAP = 6, 30, 24, 16, 7, 10
E_BOTTOM = E_TOP + 2 * (E_H + E_GAP)      # 64
BAR_BOTTOM = E_BOTTOM + E_H                # 71
TAIL_Y = E_BOTTOM + E_H / 2                # 67.5
GAP_E, GAP_J, R, OPENING = 8, 14, 17, 68

C_CX = E_X + E_W + GAP_E + S / 2 + R
C_CY = BAR_BOTTOM - S / 2 - R
C_EX = C_CX + R * math.cos(math.radians(OPENING))
C_TOP = C_CY - R * math.sin(math.radians(OPENING))
C_BOT = C_CY + R * math.sin(math.radians(OPENING))
J_X = C_EX + S / 2 + GAP_J + S / 2


def shapes(ink, accent):
    e = (f'<g fill="{ink}">'
         f'<rect x="{E_X}" y="{E_TOP}" width="{E_W}" height="{E_H}" rx="3.5"/>'
         f'<rect x="{E_X}" y="{E_TOP + E_H + E_GAP}" width="{E_MID}" height="{E_H}" rx="3.5"/>'
         f'<rect x="{E_X}" y="{E_BOTTOM}" width="{E_W}" height="{E_H}" rx="3.5"/></g>')
    c = (f'<path d="M{C_EX:.1f} {C_TOP:.1f} A{R} {R} 0 1 0 {C_EX:.1f} {C_BOT:.1f}" fill="none" '
         f'stroke="{accent}" stroke-width="{S}" stroke-linecap="butt"/>')
    j = (f'<path d="M{J_X:.1f} {E_TOP} V{TAIL_Y - 18:.1f} a18 18 0 0 1 -18 18 H10" fill="none" '
         f'stroke="{ink}" stroke-width="{S}" stroke-linecap="round" stroke-linejoin="round"/>')

    return e + c + j


def document(body, size=120, title='ECJ'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="{size}" height="{size}" '
            f'role="img" aria-label="{title}">{body}</svg>\n')


# Logo que hereda el color del contenedor (para incrustar en la web)
logo_current = document(
    '<g fill="currentColor">'
    f'<rect x="{E_X}" y="{E_TOP}" width="{E_W}" height="{E_H}" rx="3.5"/>'
    f'<rect x="{E_X}" y="{E_TOP + E_H + E_GAP}" width="{E_MID}" height="{E_H}" rx="3.5"/>'
    f'<rect x="{E_X}" y="{E_BOTTOM}" width="{E_W}" height="{E_H}" rx="3.5"/></g>'
    f'<path d="M{C_EX:.1f} {C_TOP:.1f} A{R} {R} 0 1 0 {C_EX:.1f} {C_BOT:.1f}" fill="none" '
    'stroke="#a855f7" stroke-width="7" stroke-linecap="butt"/>'
    f'<path d="M{J_X:.1f} {E_TOP} V{TAIL_Y - 18:.1f} a18 18 0 0 1 -18 18 H10" fill="none" '
    'stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
)

logo_dark = document(shapes('#f1ecff', '#a855f7'))
logo_light = document(shapes('#17161a', '#6d28d9'))

favicon_bg = '<rect width="120" height="120" rx="26" fill="#120e1d"/>'
favicon = document(favicon_bg + shapes('#f1ecff', '#a855f7'))

for name, content in {
    'logo.svg': logo_current,
    'logo-dark.svg': logo_dark,
    'logo-light.svg': logo_light,
    'favicon.svg': favicon,
}.items():
    (OUT / name).write_text(content, encoding='utf-8')

(WEB / 'favicon.svg').write_text(favicon, encoding='utf-8')

# Páginas de render para rasterizar con Edge
(OUT / '_favicon.html').write_text(
    '<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:512px;height:512px}'
    'svg{width:512px;height:512px;display:block}</style></head><body>' + favicon + '</body></html>',
    encoding='utf-8')

(OUT / '_og.html').write_text(f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#120e1d;color:#f1ecff;font-family:Georgia,serif;
  background-image:radial-gradient(rgba(168,85,247,.16) 1px,transparent 1px);background-size:32px 32px;
  padding:76px 92px;display:flex;flex-direction:column;justify-content:center}}
.row{{display:flex;align-items:center;gap:34px;margin-bottom:26px}}
.row svg{{width:120px;height:120px}}
.kicker{{font-family:ui-monospace,Consolas,monospace;font-size:17px;letter-spacing:.22em;
  text-transform:uppercase;color:#c4b5fd}}
h1{{font-size:68px;line-height:1.02;margin:10px 0 16px;letter-spacing:-.02em}}
h1 em{{color:#a855f7;font-style:italic}}
p{{font-family:ui-monospace,Consolas,monospace;font-size:19px;color:#d8ccf5}}
.foot{{position:absolute;left:92px;bottom:52px;font-family:ui-monospace,monospace;font-size:15px;
  letter-spacing:.18em;color:#c4b5fd}}
</style></head><body>
<div class="row">{logo_dark}<span class="kicker">cuaderno de laboratorio</span></div>
<h1>Emilio Chica Jiménez<br><em>Ingeniería de software</em></h1>
<p>.NET · Node · Angular · datos · SDD + IA</p>
<div class="foot">MILIOLAB.COM · GRANADA</div>
</body></html>""", encoding='utf-8')

print('ok', OUT)
