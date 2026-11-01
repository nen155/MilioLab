"""Iteración 03-5: la cola de la J se solapa con la última barra de la E."""

import math
from pathlib import Path

OUT = Path(r'F:\Mis documentos\GitHub\MilioLab\brand\iteracion-03-5')
OUT.mkdir(parents=True, exist_ok=True)

PALETTES = {'dark': ('#f1ecff', '#a855f7'), 'light': ('#17161a', '#6d28d9')}

S = 7
E_X, E_TOP, E_W, E_MID, E_H, E_GAP = 6, 30, 24, 16, 7, 10
E_BOTTOM = E_TOP + 2 * (E_H + E_GAP)          # 64
TAIL_Y = E_BOTTOM + E_H / 2                    # 67.5 → misma barra que la E
C_R, C_TOP = 17, 30
GAP_E_C = 11
C_CX = E_X + E_W + GAP_E_C + S / 2 + C_R       # 6+24+11+3.5+17 = 61.5
C_RIGHT = C_CX + S / 2                         # 67.5


def svg(body, title, mode):
    ink, accent = PALETTES[mode]
    style = (f'<style>.ink{{fill:{ink}}}.s-ink{{stroke:{ink}}}.s-accent{{stroke:{accent}}}</style>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
            f'role="img" aria-label="ECJ {title}"><title>ECJ · {title}</title>{style}{body}</svg>\n')


E = (f'<g class="ink">'
     f'<rect x="{E_X}" y="{E_TOP}" width="{E_W}" height="{E_H}" rx="3.5"/>'
     f'<rect x="{E_X}" y="{E_TOP + E_H + E_GAP}" width="{E_MID}" height="{E_H}" rx="3.5"/>'
     f'<rect x="{E_X}" y="{E_BOTTOM}" width="{E_W}" height="{E_H}" rx="3.5"/></g>')

C_CY = (TAIL_Y + C_TOP) / 2                     # centro vertical de la C
C_OPEN = 55                                     # grados de apertura a cada lado
C_END_X = C_CX + C_R * math.cos(math.radians(C_OPEN))
C_END_TOP = C_CY - C_R * math.sin(math.radians(C_OPEN))
C_END_BOTTOM = C_CY + C_R * math.sin(math.radians(C_OPEN))

C = (f'<path d="M{C_END_X:.1f} {C_END_TOP:.1f} A{C_R} {C_R} 0 1 0 {C_END_X:.1f} {C_END_BOTTOM:.1f}" '
     f'fill="none" class="s-accent" stroke-width="{S}" stroke-linecap="round"/>')


def j(gap_c, corner=18, tail_end=10):
    x = C_RIGHT + gap_c + S / 2
    return (f'<path d="M{x} {E_TOP} V{TAIL_Y - corner} a{corner} {corner} 0 0 1 -{corner} {corner} H{tail_end}" '
            f'fill="none" class="s-ink" stroke-width="{S}" stroke-linecap="round" stroke-linejoin="round"/>')


A = E + C + j(12)      # palo 12 px a la derecha de la C
B = E + C + j(18)      # palo más separado: 18 px

FAV = ('<rect width="120" height="120" rx="26" fill="#120e1d"/>'
       '<g fill="#f1ecff">'
       '<rect x="6" y="30" width="24" height="7" rx="3.5"/>'
       '<rect x="6" y="47" width="16" height="7" rx="3.5"/>'
       '<rect x="6" y="64" width="24" height="7" rx="3.5"/></g>'
       '<path d="M64 30 a20 20 0 1 0 0 40" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>'
       '<path d="M79.5 30 V49.5 a18 18 0 0 1 -18 18 H10" fill="none" stroke="#f1ecff" stroke-width="7" '
       'stroke-linecap="round" stroke-linejoin="round"/>')

files = {}
for name, body in {'03-5a-palo-12': A, '03-5b-palo-18': B}.items():
    for mode in ('dark', 'light'):
        files[f'{name}-{mode}.svg'] = svg(body, name, mode)
files['03-5a-favicon.svg'] = svg(FAV, 'favicon', 'dark')

for name, content in files.items():
    (OUT / name).write_text(content, encoding='utf-8')

dark = ''.join(f'<figure class="card"><img src="{n}-dark.svg" alt="{n}"><figcaption>{n}</figcaption></figure>'
               for n in ('03-5a-palo-12', '03-5b-palo-18'))
light = ''.join(f'<figure class="card"><img src="{n}-light.svg" alt="{n}"><figcaption>{n}</figcaption></figure>'
                for n in ('03-5a-palo-12', '03-5b-palo-18'))

preview = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>ECJ · iteración 03-5</title>
<style>
  body{{font-family:Georgia,serif;background:#0e0b16;color:#f1ecff;padding:32px}}
  h1{{font-size:20px;margin:0 0 4px}}
  p{{font-family:ui-monospace,monospace;font-size:11px;color:#9a8fc0;margin:0 0 22px}}
  .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:640px}}
  .card{{margin:0;padding:18px;border:1px solid #2e2450;border-radius:12px;text-align:center;
        background:linear-gradient(180deg,#17112a,#0e0b16)}}
  .card img{{width:190px;height:190px}}
  figcaption{{font-family:ui-monospace,monospace;font-size:10px;color:#c4b5fd;margin-top:10px}}
  .light{{background:#f6f3ea;color:#17161a;margin-top:28px;padding:22px;border-radius:12px}}
  .light .card{{background:#fff;border-color:#d9d3c4}}
  .sizes{{display:flex;gap:18px;align-items:flex-end;margin-top:26px}}
  .sizes img{{width:72px;height:72px}} .sizes img.m{{width:40px;height:40px}}
  .sizes img.s{{width:24px;height:24px}} .sizes img.xs{{width:16px;height:16px}}
</style></head><body>
  <h1>ECJ · quinta iteración</h1>
  <p>la cola de la J se solapa con la última barra de la E · el palo se separa de la C</p>
  <div class="grid">{dark}</div>
  <div class="sizes"><img src="03-5a-favicon.svg" alt="72"><img src="03-5a-favicon.svg" class="m" alt="40">
    <img src="03-5a-favicon.svg" class="s" alt="24"><img src="03-5a-favicon.svg" class="xs" alt="16"></div>
  <div class="light"><h1>Sobre fondo claro</h1><div class="grid">{light}</div></div>
</body></html>"""

(OUT / 'preview.html').write_text(preview, encoding='utf-8')
print('ok', len(files) + 1, 'en', OUT)
