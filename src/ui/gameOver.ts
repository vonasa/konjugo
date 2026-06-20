import { el } from './dom';

export interface GameStats {
  score: number;
  answered: number;
  correct: number;
  longestCombo: number;
  tierReached: number;
}

export interface GameOverActions {
  onPlayAgain: () => void;
  onMenu: () => void;
}

/** Overlay shown when lives hit zero. */
export function showGameOver(
  stats: GameStats,
  best: number,
  isNewBest: boolean,
  actions: GameOverActions,
): void {
  const accuracy = stats.answered
    ? Math.round((stats.correct / stats.answered) * 100)
    : 0;

  const rows: [string, string][] = [
    ['Score', String(stats.score)],
    ['Best', String(best)],
    ['Accuracy', `${accuracy}%`],
    ['Longest combo', String(stats.longestCombo)],
    ['Tier reached', String(stats.tierReached)],
  ];

  const list = el('div', { class: 'over-stats' });
  for (const [k, v] of rows) {
    list.append(
      el('div', { class: 'over-row' },
        el('span', { class: 'over-k', text: k }),
        el('span', { class: 'over-v', text: v }),
      ),
    );
  }

  const playAgain = el('button', {
    class: 'over-restart',
    attrs: { type: 'button' },
    text: 'Play again',
  });
  const menuBtn = el('button', {
    class: 'over-menu',
    attrs: { type: 'button' },
    text: 'Change level',
  });

  const panel = el('div', { class: 'over-panel' },
    el('h2', { class: 'over-title', text: 'Game over' }),
    isNewBest
      ? el('p', { class: 'over-newbest', text: '🎉 New personal best!' })
      : el('p', { class: 'over-sub', text: 'Out of lives' }),
    list,
    playAgain,
    menuBtn,
  );

  const overlay = el('div', {
    class: 'over-overlay',
    attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Game over' },
  }, panel);

  document.body.append(overlay);
  playAgain.focus();
  playAgain.addEventListener('click', () => {
    overlay.remove();
    actions.onPlayAgain();
  });
  menuBtn.addEventListener('click', () => {
    overlay.remove();
    actions.onMenu();
  });
}
