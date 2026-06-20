import type { Pairing } from '../types';

// Attested adjective+noun collocations — the spine of generation (DESIGN.md §6.2).
// Each is a natural German pairing; case / article / number are varied
// systematically over these. Curated for naturalness and spot-verified on the
// web (Phase 6). Every `noun` here exists in nouns.ts; every `adj` in adjectives.ts.
export const PAIRINGS: readonly Pairing[] = [
  // people
  { adj: 'alt', noun: 'Mann' }, { adj: 'jung', noun: 'Mann' }, { adj: 'groß', noun: 'Mann' }, { adj: 'reich', noun: 'Mann' }, { adj: 'nett', noun: 'Mann' }, { adj: 'stark', noun: 'Mann' },
  { adj: 'jung', noun: 'Frau' }, { adj: 'alt', noun: 'Frau' }, { adj: 'schön', noun: 'Frau' }, { adj: 'nett', noun: 'Frau' }, { adj: 'reich', noun: 'Frau' },
  { adj: 'klein', noun: 'Kind' }, { adj: 'jung', noun: 'Kind' }, { adj: 'süß', noun: 'Kind' }, { adj: 'nett', noun: 'Kind' },
  { adj: 'gut', noun: 'Freund' }, { adj: 'alt', noun: 'Freund' }, { adj: 'jung', noun: 'Freund' }, { adj: 'nett', noun: 'Freund' },

  // animals
  { adj: 'klein', noun: 'Hund' }, { adj: 'groß', noun: 'Hund' }, { adj: 'alt', noun: 'Hund' }, { adj: 'jung', noun: 'Hund' }, { adj: 'schnell', noun: 'Hund' },
  { adj: 'klein', noun: 'Katze' }, { adj: 'alt', noun: 'Katze' }, { adj: 'jung', noun: 'Katze' }, { adj: 'schwarz', noun: 'Katze' },
  { adj: 'groß', noun: 'Tier' }, { adj: 'klein', noun: 'Tier' }, { adj: 'wild', noun: 'Tier' }, { adj: 'jung', noun: 'Tier' },
  { adj: 'groß', noun: 'Pferd' }, { adj: 'jung', noun: 'Pferd' }, { adj: 'schnell', noun: 'Pferd' }, { adj: 'stark', noun: 'Pferd' }, { adj: 'wild', noun: 'Pferd' },

  // vehicles / tech
  { adj: 'neu', noun: 'Auto' }, { adj: 'alt', noun: 'Auto' }, { adj: 'schnell', noun: 'Auto' }, { adj: 'rot', noun: 'Auto' }, { adj: 'blau', noun: 'Auto' },
  { adj: 'neu', noun: 'Wagen' }, { adj: 'alt', noun: 'Wagen' }, { adj: 'schnell', noun: 'Wagen' }, { adj: 'langsam', noun: 'Wagen' },
  { adj: 'neu', noun: 'Computer' }, { adj: 'alt', noun: 'Computer' }, { adj: 'schnell', noun: 'Computer' },
  { adj: 'klein', noun: 'Boot' }, { adj: 'groß', noun: 'Boot' }, { adj: 'alt', noun: 'Boot' }, { adj: 'schnell', noun: 'Boot' },

  // buildings / places
  { adj: 'alt', noun: 'Haus' }, { adj: 'neu', noun: 'Haus' }, { adj: 'groß', noun: 'Haus' }, { adj: 'klein', noun: 'Haus' }, { adj: 'schön', noun: 'Haus' }, { adj: 'leer', noun: 'Haus' },
  { adj: 'alt', noun: 'Stadt' }, { adj: 'groß', noun: 'Stadt' }, { adj: 'klein', noun: 'Stadt' }, { adj: 'schön', noun: 'Stadt' },
  { adj: 'alt', noun: 'Schule' }, { adj: 'neu', noun: 'Schule' }, { adj: 'groß', noun: 'Schule' },
  { adj: 'groß', noun: 'Garten' }, { adj: 'klein', noun: 'Garten' }, { adj: 'schön', noun: 'Garten' }, { adj: 'grün', noun: 'Garten' },
  { adj: 'klein', noun: 'Dorf' }, { adj: 'alt', noun: 'Dorf' },
  { adj: 'klein', noun: 'Insel' }, { adj: 'groß', noun: 'Insel' }, { adj: 'schön', noun: 'Insel' }, { adj: 'grün', noun: 'Insel' },

  // nature
  { adj: 'groß', noun: 'Baum' }, { adj: 'alt', noun: 'Baum' }, { adj: 'grün', noun: 'Baum' },
  { adj: 'groß', noun: 'Berg' }, { adj: 'weiß', noun: 'Berg' },
  { adj: 'lang', noun: 'Fluss' }, { adj: 'breit', noun: 'Fluss' }, { adj: 'tief', noun: 'Fluss' }, { adj: 'kalt', noun: 'Fluss' },
  { adj: 'groß', noun: 'Stein' }, { adj: 'klein', noun: 'Stein' }, { adj: 'hart', noun: 'Stein' },

  // food / drink
  { adj: 'gut', noun: 'Wein' }, { adj: 'rot', noun: 'Wein' }, { adj: 'alt', noun: 'Wein' }, { adj: 'süß', noun: 'Wein' }, { adj: 'kalt', noun: 'Wein' },
  { adj: 'rot', noun: 'Apfel' }, { adj: 'grün', noun: 'Apfel' }, { adj: 'süß', noun: 'Apfel' }, { adj: 'frisch', noun: 'Apfel' },
  { adj: 'frisch', noun: 'Brot' }, { adj: 'warm', noun: 'Brot' }, { adj: 'alt', noun: 'Brot' }, { adj: 'hart', noun: 'Brot' },
  { adj: 'frisch', noun: 'Ei' }, { adj: 'hart', noun: 'Ei' }, { adj: 'weich', noun: 'Ei' },

  // objects
  { adj: 'gut', noun: 'Buch' }, { adj: 'neu', noun: 'Buch' }, { adj: 'alt', noun: 'Buch' }, { adj: 'lang', noun: 'Buch' }, { adj: 'schlecht', noun: 'Buch' },
  { adj: 'groß', noun: 'Tisch' }, { adj: 'klein', noun: 'Tisch' }, { adj: 'alt', noun: 'Tisch' }, { adj: 'neu', noun: 'Tisch' },
  { adj: 'alt', noun: 'Stuhl' }, { adj: 'neu', noun: 'Stuhl' }, { adj: 'hart', noun: 'Stuhl' }, { adj: 'weich', noun: 'Stuhl' },
  { adj: 'neu', noun: 'Schuh' }, { adj: 'alt', noun: 'Schuh' }, { adj: 'braun', noun: 'Schuh' }, { adj: 'schwarz', noun: 'Schuh' },
  { adj: 'neu', noun: 'Mantel' }, { adj: 'alt', noun: 'Mantel' }, { adj: 'warm', noun: 'Mantel' }, { adj: 'lang', noun: 'Mantel' }, { adj: 'schwarz', noun: 'Mantel' },
  { adj: 'neu', noun: 'Kleid' }, { adj: 'schön', noun: 'Kleid' }, { adj: 'rot', noun: 'Kleid' }, { adj: 'lang', noun: 'Kleid' }, { adj: 'blau', noun: 'Kleid' },
  { adj: 'groß', noun: 'Tasche' }, { adj: 'klein', noun: 'Tasche' }, { adj: 'neu', noun: 'Tasche' }, { adj: 'schwarz', noun: 'Tasche' },
  { adj: 'alt', noun: 'Uhr' }, { adj: 'neu', noun: 'Uhr' },
  { adj: 'neu', noun: 'Brille' }, { adj: 'alt', noun: 'Brille' },
  { adj: 'alt', noun: 'Lampe' }, { adj: 'neu', noun: 'Lampe' }, { adj: 'hell', noun: 'Lampe' },
  { adj: 'voll', noun: 'Glas' }, { adj: 'leer', noun: 'Glas' }, { adj: 'kalt', noun: 'Glas' },
  { adj: 'voll', noun: 'Tasse' }, { adj: 'leer', noun: 'Tasse' }, { adj: 'klein', noun: 'Tasse' }, { adj: 'warm', noun: 'Tasse' },
  { adj: 'groß', noun: 'Ball' }, { adj: 'klein', noun: 'Ball' }, { adj: 'rot', noun: 'Ball' },
  { adj: 'lang', noun: 'Brief' }, { adj: 'kurz', noun: 'Brief' }, { adj: 'alt', noun: 'Brief' },
  { adj: 'alt', noun: 'Bild' }, { adj: 'neu', noun: 'Bild' }, { adj: 'schön', noun: 'Bild' }, { adj: 'groß', noun: 'Bild' }, { adj: 'klein', noun: 'Bild' },

  // rooms / structures
  { adj: 'groß', noun: 'Fenster' }, { adj: 'klein', noun: 'Fenster' }, { adj: 'alt', noun: 'Fenster' }, { adj: 'neu', noun: 'Fenster' },
  { adj: 'groß', noun: 'Zimmer' }, { adj: 'klein', noun: 'Zimmer' }, { adj: 'warm', noun: 'Zimmer' }, { adj: 'hell', noun: 'Zimmer' }, { adj: 'leer', noun: 'Zimmer' },
  { adj: 'alt', noun: 'Tür' }, { adj: 'neu', noun: 'Tür' }, { adj: 'breit', noun: 'Tür' },
  { adj: 'weiß', noun: 'Wand' }, { adj: 'kalt', noun: 'Wand' },
  { adj: 'alt', noun: 'Brücke' }, { adj: 'lang', noun: 'Brücke' }, { adj: 'breit', noun: 'Brücke' },
  { adj: 'weich', noun: 'Bett' }, { adj: 'hart', noun: 'Bett' }, { adj: 'warm', noun: 'Bett' }, { adj: 'groß', noun: 'Bett' },
  { adj: 'lang', noun: 'Straße' }, { adj: 'breit', noun: 'Straße' }, { adj: 'alt', noun: 'Straße' }, { adj: 'leer', noun: 'Straße' },
  { adj: 'lang', noun: 'Weg' }, { adj: 'kurz', noun: 'Weg' }, { adj: 'breit', noun: 'Weg' },

  // body
  { adj: 'warm', noun: 'Hand' }, { adj: 'kalt', noun: 'Hand' }, { adj: 'klein', noun: 'Hand' }, { adj: 'stark', noun: 'Hand' },

  // abstract / time
  { adj: 'schön', noun: 'Tag' }, { adj: 'lang', noun: 'Tag' }, { adj: 'kurz', noun: 'Tag' }, { adj: 'warm', noun: 'Tag' }, { adj: 'kalt', noun: 'Tag' }, { adj: 'frei', noun: 'Tag' },
  { adj: 'lang', noun: 'Nacht' }, { adj: 'kalt', noun: 'Nacht' }, { adj: 'warm', noun: 'Nacht' },
  { adj: 'lang', noun: 'Zeit' }, { adj: 'kurz', noun: 'Zeit' }, { adj: 'frei', noun: 'Zeit' }, { adj: 'schön', noun: 'Zeit' },
  { adj: 'gut', noun: 'Idee' }, { adj: 'neu', noun: 'Idee' }, { adj: 'schlecht', noun: 'Idee' },
  { adj: 'lang', noun: 'Wort' }, { adj: 'kurz', noun: 'Wort' }, { adj: 'neu', noun: 'Wort' }, { adj: 'hart', noun: 'Wort' },
  { adj: 'groß', noun: 'Land' }, { adj: 'klein', noun: 'Land' }, { adj: 'reich', noun: 'Land' }, { adj: 'arm', noun: 'Land' }, { adj: 'frei', noun: 'Land' }, { adj: 'schön', noun: 'Land' },

  // media / leisure
  { adj: 'gut', noun: 'Film' }, { adj: 'neu', noun: 'Film' }, { adj: 'alt', noun: 'Film' }, { adj: 'lang', noun: 'Film' }, { adj: 'schlecht', noun: 'Film' },
  { adj: 'gut', noun: 'Spiel' }, { adj: 'neu', noun: 'Spiel' }, { adj: 'lang', noun: 'Spiel' }, { adj: 'schön', noun: 'Spiel' },
  { adj: 'schön', noun: 'Lied' }, { adj: 'alt', noun: 'Lied' }, { adj: 'neu', noun: 'Lied' }, { adj: 'laut', noun: 'Lied' },
  { adj: 'rot', noun: 'Blume' }, { adj: 'schön', noun: 'Blume' }, { adj: 'klein', noun: 'Blume' }, { adj: 'frisch', noun: 'Blume' },
];
