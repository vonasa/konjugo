import { el } from './dom';
import { PRESETS, type Preset } from '../game/presets';
import { isMuted, toggleMuted } from '../game/settings';

/** The title screen: pick a difficulty preset. `refButton` (the endings cheat
 *  sheet) is moved into the top bar while this screen is shown. */
export function renderMenu(
  onSelect: (preset: Preset) => void,
  refButton?: HTMLElement,
): HTMLElement {
  const mute = el('button', {
    class: 'icon-btn mute-btn',
    attrs: { type: 'button', 'aria-label': 'Toggle sound' },
  });
  const syncMute = (): void => {
    mute.textContent = isMuted() ? '🔇' : '🔊';
    mute.setAttribute('aria-pressed', String(isMuted()));
  };
  syncMute();
  mute.addEventListener('click', () => {
    toggleMuted();
    syncMute();
  });

  const top = el('div', { class: 'menu-top' }, mute);
  if (refButton) top.append(refButton);

  const title = el(
    'h1',
    { class: 'logo' },
    'Konjug',
    el('span', { class: 'logo-accent', text: 'o' }),
  );
  const tagline = el('p', {
    class: 'tagline',
    text: 'German adjective endings — arcade drill',
  });

  const cards = el('div', { class: 'preset-cards' });
  for (const preset of PRESETS) {
    const card = el(
      'button',
      { class: `preset-card preset-${preset.id}`, attrs: { type: 'button' } },
      el('span', { class: 'preset-name', text: preset.name }),
      el('span', { class: 'preset-blurb', text: preset.blurb }),
    );
    card.addEventListener('click', () => onSelect(preset));
    cards.append(card);
  }

  return el('main', { class: 'screen menu' }, top, title, tagline, cards);
}
