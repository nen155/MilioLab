import { Component } from '@angular/core';

/**
 * Escenario decorativo. Las tres capas están siempre en el DOM y el CSS decide
 * cuál se ve según `data-layout`: montaña y cordada, mesa de fieltro o consola.
 */
@Component({
  selector: 'app-scenery',
  template: `
    <div class="scenery scenery-rock" aria-hidden="true">
      <span class="rock-sun"></span>
      <svg class="rock-ridges" viewBox="0 0 1440 480" preserveAspectRatio="none">
        <path class="rock-back" d="M0 300 L120 220 L210 260 L330 150 L430 210 L540 120 L650 200 L760 140 L880 230 L980 170 L1100 240 L1220 180 L1320 230 L1440 200 L1440 480 L0 480 Z" />
        <path class="rock-mid" d="M0 360 L90 300 L200 340 L300 270 L420 330 L520 280 L640 350 L760 300 L880 360 L1000 310 L1120 370 L1240 320 L1340 360 L1440 330 L1440 480 L0 480 Z" />
        <path class="rock-front" d="M0 430 L120 390 L240 420 L360 380 L480 425 L600 395 L720 430 L840 400 L960 435 L1080 405 L1200 440 L1320 410 L1440 430 L1440 480 L0 480 Z" />
        <path class="rock-route" d="M150 476 C 250 420, 320 400, 360 330 S 470 260, 520 200 S 630 160, 668 84" />
        <circle class="rock-anchor" cx="150" cy="476" r="5" />
        <circle class="rock-anchor" cx="360" cy="330" r="5" />
        <circle class="rock-anchor" cx="520" cy="200" r="5" />
        <circle class="rock-anchor" cx="668" cy="84" r="6" />
      </svg>
      <span class="rock-chalk rock-chalk-1"></span>
      <span class="rock-chalk rock-chalk-2"></span>
      <span class="rock-chalk rock-chalk-3"></span>
    </div>

    <div class="scenery scenery-felt" aria-hidden="true">
      <span class="felt-glow"></span>
      <span class="felt-card felt-card-a"></span>
      <span class="felt-card felt-card-b"></span>
      <span class="felt-card felt-card-c"></span>
      <span class="felt-grain"></span>
    </div>

    <div class="scenery scenery-hud" aria-hidden="true">
      <span class="hud-scan"></span>
      <span class="hud-reticle"></span>
      <span class="hud-bracket hud-bracket-tl"></span>
      <span class="hud-bracket hud-bracket-tr"></span>
      <span class="hud-bracket hud-bracket-bl"></span>
      <span class="hud-bracket hud-bracket-br"></span>
    </div>
  `,
})
export class SceneryComponent {}
