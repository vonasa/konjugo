// Lightweight DOM particle bursts + screen flash. All effects no-op under
// prefers-reduced-motion (the functional threat timer is unaffected).

let layer: HTMLElement | null = null;

function getLayer(): HTMLElement {
  if (!layer || !layer.isConnected) {
    layer = document.createElement('div');
    layer.className = 'fx-layer';
    document.body.append(layer);
  }
  return layer;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** A little radial burst of dots at viewport coords (e.g. a correct button). */
export function burstAt(
  x: number,
  y: number,
  color = 'var(--accent)',
  count = 12,
): void {
  if (prefersReducedMotion()) return;
  const l = getLayer();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'fx-dot';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = 28 + Math.random() * 52;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.background = color;
    dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
    l.append(dot);
  }
}

/** A brief inset color flash at the screen edges. */
export function screenFlash(kind: 'wrong'): void {
  if (prefersReducedMotion()) return;
  const l = getLayer();
  const flash = document.createElement('div');
  flash.className = `fx-flash fx-flash-${kind}`;
  flash.addEventListener('animationend', () => flash.remove(), { once: true });
  l.append(flash);
}
