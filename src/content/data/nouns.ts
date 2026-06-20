import type { Noun } from '../types';

// v1 seed: strong nouns only (no n-declension), with explicit irregular plurals
// and genitive-singular for m/n. Keyed by lemma for pairing lookup.
export const NOUNS: readonly Noun[] = [
  // --- masculine ---
  { lemma: 'Mann', gender: 'm', plural: 'Männer', genitiveSg: 'Mannes' },
  { lemma: 'Hund', gender: 'm', plural: 'Hunde', genitiveSg: 'Hundes' },
  { lemma: 'Tag', gender: 'm', plural: 'Tage', genitiveSg: 'Tages' },
  { lemma: 'Wein', gender: 'm', plural: 'Weine', genitiveSg: 'Weins' },
  { lemma: 'Freund', gender: 'm', plural: 'Freunde', genitiveSg: 'Freundes' },
  { lemma: 'Tisch', gender: 'm', plural: 'Tische', genitiveSg: 'Tisches' },
  { lemma: 'Stuhl', gender: 'm', plural: 'Stühle', genitiveSg: 'Stuhls' },
  { lemma: 'Baum', gender: 'm', plural: 'Bäume', genitiveSg: 'Baumes' },
  { lemma: 'Wagen', gender: 'm', plural: 'Wagen', genitiveSg: 'Wagens' },
  { lemma: 'Berg', gender: 'm', plural: 'Berge', genitiveSg: 'Berges' },
  { lemma: 'Fluss', gender: 'm', plural: 'Flüsse', genitiveSg: 'Flusses' },
  { lemma: 'Film', gender: 'm', plural: 'Filme', genitiveSg: 'Films' },
  { lemma: 'Brief', gender: 'm', plural: 'Briefe', genitiveSg: 'Briefes' },
  { lemma: 'Garten', gender: 'm', plural: 'Gärten', genitiveSg: 'Gartens' },
  { lemma: 'Apfel', gender: 'm', plural: 'Äpfel', genitiveSg: 'Apfels' },
  { lemma: 'Ball', gender: 'm', plural: 'Bälle', genitiveSg: 'Balls' },
  { lemma: 'Schuh', gender: 'm', plural: 'Schuhe', genitiveSg: 'Schuhs' },
  { lemma: 'Stein', gender: 'm', plural: 'Steine', genitiveSg: 'Steins' },
  { lemma: 'Weg', gender: 'm', plural: 'Wege', genitiveSg: 'Weges' },
  { lemma: 'Mantel', gender: 'm', plural: 'Mäntel', genitiveSg: 'Mantels' },
  { lemma: 'Computer', gender: 'm', plural: 'Computer', genitiveSg: 'Computers' },

  // --- feminine ---
  { lemma: 'Frau', gender: 'f', plural: 'Frauen' },
  { lemma: 'Stadt', gender: 'f', plural: 'Städte' },
  { lemma: 'Blume', gender: 'f', plural: 'Blumen' },
  { lemma: 'Tür', gender: 'f', plural: 'Türen' },
  { lemma: 'Hand', gender: 'f', plural: 'Hände' },
  { lemma: 'Katze', gender: 'f', plural: 'Katzen' },
  { lemma: 'Lampe', gender: 'f', plural: 'Lampen' },
  { lemma: 'Straße', gender: 'f', plural: 'Straßen' },
  { lemma: 'Schule', gender: 'f', plural: 'Schulen' },
  { lemma: 'Tasche', gender: 'f', plural: 'Taschen' },
  { lemma: 'Uhr', gender: 'f', plural: 'Uhren' },
  { lemma: 'Brücke', gender: 'f', plural: 'Brücken' },
  { lemma: 'Insel', gender: 'f', plural: 'Inseln' },
  { lemma: 'Wand', gender: 'f', plural: 'Wände' },
  { lemma: 'Nacht', gender: 'f', plural: 'Nächte' },
  { lemma: 'Zeit', gender: 'f', plural: 'Zeiten' },
  { lemma: 'Idee', gender: 'f', plural: 'Ideen' },
  { lemma: 'Brille', gender: 'f', plural: 'Brillen' },
  { lemma: 'Tasse', gender: 'f', plural: 'Tassen' },

  // --- neuter ---
  { lemma: 'Kind', gender: 'n', plural: 'Kinder', genitiveSg: 'Kindes' },
  { lemma: 'Auto', gender: 'n', plural: 'Autos', genitiveSg: 'Autos' },
  { lemma: 'Haus', gender: 'n', plural: 'Häuser', genitiveSg: 'Hauses' },
  { lemma: 'Buch', gender: 'n', plural: 'Bücher', genitiveSg: 'Buches' },
  { lemma: 'Bild', gender: 'n', plural: 'Bilder', genitiveSg: 'Bildes' },
  { lemma: 'Fenster', gender: 'n', plural: 'Fenster', genitiveSg: 'Fensters' },
  { lemma: 'Zimmer', gender: 'n', plural: 'Zimmer', genitiveSg: 'Zimmers' },
  { lemma: 'Glas', gender: 'n', plural: 'Gläser', genitiveSg: 'Glases' },
  { lemma: 'Dorf', gender: 'n', plural: 'Dörfer', genitiveSg: 'Dorfes' },
  { lemma: 'Tier', gender: 'n', plural: 'Tiere', genitiveSg: 'Tieres' },
  { lemma: 'Brot', gender: 'n', plural: 'Brote', genitiveSg: 'Brotes' },
  { lemma: 'Bett', gender: 'n', plural: 'Betten', genitiveSg: 'Bettes' },
  { lemma: 'Spiel', gender: 'n', plural: 'Spiele', genitiveSg: 'Spiels' },
  { lemma: 'Lied', gender: 'n', plural: 'Lieder', genitiveSg: 'Liedes' },
  { lemma: 'Wort', gender: 'n', plural: 'Wörter', genitiveSg: 'Wortes' },
  { lemma: 'Land', gender: 'n', plural: 'Länder', genitiveSg: 'Landes' },
  { lemma: 'Pferd', gender: 'n', plural: 'Pferde', genitiveSg: 'Pferdes' },
  { lemma: 'Kleid', gender: 'n', plural: 'Kleider', genitiveSg: 'Kleides' },
  { lemma: 'Boot', gender: 'n', plural: 'Boote', genitiveSg: 'Bootes' },
  { lemma: 'Ei', gender: 'n', plural: 'Eier', genitiveSg: 'Eies' },
];

const BY_LEMMA = new Map(NOUNS.map((n) => [n.lemma, n]));

export function nounByLemma(lemma: string): Noun {
  const n = BY_LEMMA.get(lemma);
  if (!n) throw new Error(`unknown noun lemma: ${lemma}`);
  return n;
}
