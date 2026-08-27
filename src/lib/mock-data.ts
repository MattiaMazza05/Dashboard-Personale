/**
 * Dati segnaposto (MOCK) per le sezioni non ancora collegate a un database reale:
 * Università, Sport e Casa. Sono qui solo per far vedere come apparirà la UI —
 * sostituiscili con dati veri (Supabase, Strava, ecc.) quando le sezioni saranno pronte.
 *
 * Lavoro invece NON usa questo file: quella sezione è già collegata a Supabase
 * (vedi src/app/work/*).
 */

export const kpiUni = [
  { label: "Media libretto", value: "26,4", note: "ponderata su 108 CFU" },
  { label: "CFU", value: "108 / 180", pct: 60, note: "72 CFU alla laurea" },
  { label: "Tirocinio", value: "112 h", pct: 62, note: "68 ore residue" },
  { label: "Esami in coda", value: "3", note: "sessione di settembre" },
];

export const esami = [
  { giorni: 9, nome: "Analisi II", data: "3 set 2026", aula: "aula M3, 9:00", cfu: "9 CFU" },
  { giorni: 17, nome: "Basi di dati", data: "11 set 2026", aula: "orale, studio 2.14", cfu: "6 CFU" },
  { giorni: 28, nome: "Diritto privato", data: "22 set 2026", aula: "aula B1, 14:30", cfu: "6 CFU" },
];

export const libretto = [
  { nome: "Reti di calcolatori", voto: "28", cfu: "9", data: "12 lug 2026" },
  { nome: "Algoritmi e strutture dati", voto: "27", cfu: "12", data: "14 feb 2026" },
  { nome: "Fisica I", voto: "24", cfu: "9", data: "20 gen 2026" },
  { nome: "Programmazione", voto: "30", cfu: "12", data: "09 lug 2025" },
];

export const kpiSport = [
  { label: "Km questa settimana", value: "26", note: "+12% sulla scorsa" },
  { label: "Sessioni", value: "1 / 5", note: "piano settimana 35" },
  { label: "Streak", value: "6 sett.", note: "mai sotto 3 uscite" },
  { label: "Prossima gara", value: "40 g", note: "Mezza di Verona" },
];

export const pianoSettimana = [
  { giorno: "Lun", nome: "Palestra pull — trazioni, rematore", volume: "65 min", target: "carico +2,5 kg", fatto: true },
  { giorno: "Mar", nome: "Ripetute 6×1000 in pista", volume: "8 km", target: "4:35/km", fatto: false },
  { giorno: "Mer", nome: "Palestra push — panca, spalle", volume: "70 min", target: "3×8", fatto: false },
  { giorno: "Ven", nome: "Fondo medio", volume: "10 km", target: "5:05/km", fatto: false },
  { giorno: "Dom", nome: "Lungo — preparazione mezza", volume: "18 km", target: "5:30/km", fatto: false },
];

export const volumeCorsa = [
  { settimana: "S30", km: 18 },
  { settimana: "S31", km: 22 },
  { settimana: "S32", km: 26 },
  { settimana: "S33", km: 14 },
  { settimana: "S34", km: 24 },
  { settimana: "S35", km: 26 },
];

export const gare = [
  { nome: "Mezza di Verona", data: "4 ott 2026", distanza: "21,1 km", giorni: "40 g" },
  { nome: "Corsa dei Navigli", data: "15 nov 2026", distanza: "10 km", giorni: "82 g" },
];

export const turniCasa = [
  { iniziale: "M", cosa: "Cucina", chi: "Mattia", fino: "dom 31 ago", mio: true },
  { iniziale: "L", cosa: "Bagno", chi: "Luca", fino: "dom 31 ago", mio: false },
  { iniziale: "S", cosa: "Soggiorno e spazzatura", chi: "Sara", fino: "dom 31 ago", mio: false },
];

export const ricorrenzeCasa = [
  { nome: "Cambio lenzuola", ogni: 14, ultimaVolta: 9 },
  { nome: "Bagno a fondo", ogni: 7, ultimaVolta: 5 },
  { nome: "Frigo e scadenze", ogni: 10, ultimaVolta: 3 },
];

/** Riepilogo per le card "Sezione" nella Home, per i domini non ancora reali. */
export const riepilogoHome = {
  uni: {
    flag: "3 esami",
    stats: [
      { value: "26,4", label: "media" },
      { value: "108", label: "CFU" },
    ],
    lines: [
      { a: "Analisi II", b: "tra 9 giorni" },
      { a: "Tirocinio", b: "112 / 180 h" },
    ],
  },
  sport: {
    flag: "streak 6",
    stats: [
      { value: "26 km", label: "settimana" },
      { value: "1/5", label: "sessioni" },
    ],
    lines: [
      { a: "Prossima", b: "ripetute domani" },
      { a: "Mezza di Verona", b: "tra 40 giorni" },
    ],
  },
  casa: {
    flag: "turno tuo",
    stats: [
      { value: "Cucina", label: "tocca a te" },
      { value: "9 g", label: "lenzuola" },
    ],
    lines: [
      { a: "Umido", b: "stasera" },
      { a: "Rotazione", b: "domenica sera" },
    ],
  },
};

/** Agenda dei prossimi giorni mostrata in Home — mischia le sezioni, per ora è finta. */
export const agendaHome = [
  { quando: "Domani", nome: "Ripetute 6×1000", nota: "pista · 4:35/km", tag: "Sport" },
  { quando: "Gio 27", nome: "Bagno — turno di Luca", nota: "rotazione settimanale", tag: "Casa" },
  { quando: "Ven 28", nome: "Fondo medio 10 km", nota: "5:05/km", tag: "Sport" },
];

/** Fonti sincronizzate mostrate in sidebar — segnaposto finché non colleghi Strava ecc. */
export const fontiSincronizzate = [
  { nome: "Strava", quando: "non collegato" },
  { nome: "Apple Health", quando: "non collegato" },
  { nome: "Conto corrente", quando: "non collegato" },
];
