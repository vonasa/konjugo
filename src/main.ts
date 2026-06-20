import './style.css';
import './ui/components.css';
import { el } from './ui/dom';
import { mulberry32 } from './util/rng';
import { createReferenceButton } from './ui/reference';
import { createHud } from './ui/hud';
import { RoundView } from './ui/round';
import { runSession } from './game/controller';
import type { Preset } from './game/presets';
import { getBest, setBest } from './game/persistence';
import { showGameOver } from './ui/gameOver';
import { renderMenu } from './ui/menu';
import { sfx, initAudioUnlock } from './fx/audio';

const appOrNull = document.querySelector<HTMLDivElement>('#app');
if (!appOrNull) throw new Error('#app root not found');
const app: HTMLDivElement = appOrNull;

const rng = mulberry32(Date.now() >>> 0);

// Opening the reference overlay pauses the active round (and resumes on close).
let currentView: RoundView | null = null;
// Created once; the same node is moved between the menu and the in-game HUD.
const refButton = createReferenceButton({
  onOpen: () => currentView?.pause(),
  onClose: () => currentView?.resume(),
});

// Restart → abandon the current run and return to the level-select screen.
const restartButton = el('button', {
  class: 'icon-btn restart-btn',
  attrs: {
    type: 'button',
    'aria-label': 'Restart — back to level select',
    title: 'Restart',
  },
});
restartButton.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>`;
restartButton.addEventListener('click', () => {
  currentView?.cancel();
  showMenu();
});

initAudioUnlock();

function showMenu(): void {
  currentView = null;
  app.replaceChildren(renderMenu(startGame, refButton));
}

function startGame(preset: Preset): void {
  const hud = createHud([restartButton, refButton]);
  const roundEl = el('div', { class: 'round' });
  app.replaceChildren(el('main', { class: 'screen game' }, hud.root, roundEl));

  const view = new RoundView(roundEl);
  currentView = view;
  void runSession(preset, { rng, hud, view }).then((stats) => {
    if (!stats) return; // run abandoned via the restart button
    sfx.gameOver();
    const isNewBest = setBest(stats.score);
    showGameOver(stats, getBest(), isNewBest, {
      onPlayAgain: () => startGame(preset),
      onMenu: showMenu,
    });
  });
}

showMenu();
