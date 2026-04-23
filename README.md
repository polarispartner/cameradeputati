# Camera dei Deputati — Tavolo Multimediale

Installazione interattiva per tavoli multimediali touch orizzontali da ~50".

## Stack

React 19 + Vite + Tailwind CSS v4. Font: Open Sans / Open Sans Condensed.

## Setup

```bash
npm install
npm run dev
```

Dev server su `http://localhost:5173` (esposto anche in LAN).

## Build

```bash
npm run build     # output in dist/
npm run preview   # serve la build in locale per test
```

## Risoluzione di riferimento

**1920 × 1080 (landscape)**. Tutto il layout è pensato per questa risoluzione fissa.
Per anteprima desktop usare la modalità _Responsive_ di Chrome DevTools impostando 1920×1080.

## Struttura

- `src/` — codice applicativo
- `src/assets/images/` — immagini esportate dai PSD (importate via JS)
- `public/` — file statici serviti 1:1
- `design/` — PSD sorgenti e riferimenti grafici (fuori dalla build)

Vedi `CLAUDE.md` per dettagli su convenzioni, regole UI e workflow.
