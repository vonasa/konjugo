import {
  ENDINGS_TABLE,
  ARTICLE_TYPES,
  CASES,
  GENDER_KEYS,
  type ArticleType,
  type Case,
  type GenderKey,
} from '../content';
import { el } from './dom';

// Built straight from ENDINGS_TABLE so the reference can never drift from the
// rules the game actually uses.

const PATTERN: Record<ArticleType, { title: string; sub: string }> = {
  definite: { title: 'Definite article', sub: 'der · die · das — "weak"' },
  indefinite: { title: 'Indefinite / kein / possessive', sub: 'ein · eine — "mixed"' },
  none: { title: 'No article', sub: '"strong"' },
};
const CASE_SHORT: Record<Case, string> = {
  nom: 'Nom',
  acc: 'Akk',
  dat: 'Dat',
  gen: 'Gen',
};
const GENDER_HEAD: Record<GenderKey, string> = { m: 'M', f: 'F', n: 'N', pl: 'Pl' };
const GENDER_CLASS: Record<GenderKey, string> = {
  m: 'g-m',
  f: 'g-f',
  n: 'g-n',
  pl: 'g-pl',
};

function buildTable(at: ArticleType): HTMLElement {
  const wrap = el('div', { class: 'ref-table-wrap' });
  wrap.append(
    el(
      'div',
      { class: 'ref-table-title' },
      el('span', { class: 'ref-table-name', text: PATTERN[at].title }),
      el('span', { class: 'ref-table-sub', text: PATTERN[at].sub }),
    ),
  );

  const table = el('table', { class: 'ref-table' });
  const headRow = el('tr');
  headRow.append(el('th', { class: 'corner' }));
  for (const g of GENDER_KEYS) {
    headRow.append(el('th', { class: `gh ${GENDER_CLASS[g]}`, text: GENDER_HEAD[g] }));
  }
  table.append(el('thead', {}, headRow));

  const body = el('tbody');
  for (const c of CASES) {
    const row = el('tr');
    row.append(el('th', { class: 'rh', text: CASE_SHORT[c] }));
    for (const g of GENDER_KEYS) {
      row.append(el('td', { text: '-' + ENDINGS_TABLE[at][c][g] }));
    }
    body.append(row);
  }
  table.append(body);
  wrap.append(table);
  return wrap;
}

function pauseIcon(): string {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>`;
}

/** Create the reference button; its overlay lives on <body>. Idempotent (HMR-safe). */
export function createReferenceButton(handlers: {
  onOpen?: () => void;
  onClose?: () => void;
} = {}): HTMLButtonElement {
  const existing = document.querySelector<HTMLButtonElement>('.ref-btn');
  if (existing) return existing;

  const btn = el('button', {
    class: 'ref-btn',
    attrs: {
      type: 'button',
      'aria-label': 'Pause and show the endings table',
      title: 'Pause · endings table',
    },
  });
  btn.innerHTML = pauseIcon();

  const overlay = el('div', {
    class: 'ref-overlay',
    attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Adjective endings reference' },
  });
  overlay.hidden = true;

  const close = el('button', {
    class: 'ref-close',
    attrs: { type: 'button', 'aria-label': 'Close' },
    text: '✕',
  });
  const header = el(
    'div',
    { class: 'ref-header' },
    el('h2', { class: 'ref-title', text: 'Adjective endings' }),
    close,
  );
  const tables = el('div', { class: 'ref-tables' });
  for (const at of ARTICLE_TYPES) tables.append(buildTable(at));
  const note = el('p', {
    class: 'ref-note',
    text: 'The five endings: -e · -en · -er · -es · -em',
  });

  overlay.append(el('div', { class: 'ref-panel' }, header, tables, note));

  const open = (): void => {
    overlay.hidden = false;
    close.focus();
    handlers.onOpen?.();
  };
  const hide = (): void => {
    overlay.hidden = true;
    btn.focus();
    handlers.onClose?.();
  };
  btn.addEventListener('click', open);
  close.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.hidden && e.key === 'Escape') hide();
  });

  document.body.append(overlay);
  return btn;
}
