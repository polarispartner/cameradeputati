# Camera dei Deputati — Tavolo Multimediale

Sito/app da installare su **tavoli multimediali touch orizzontali da ~50"**.
Non è un sito web responsive tradizionale: è una _installazione_ a risoluzione fissa.

## Specifiche display

- Hardware: **schermo 50" 4K** (3840 × 2160), **landscape**.
- Canvas di design dei PSD: **1920 × 1080** (i PSD sono a FullHD, ma l'output gira in 4K).
- Strategia di scaling: `html { font-size: calc(100vw / 120) }` → 1rem = 16px a 1920w, 32px a 3840w. Tutte le misure in `rem` (default Tailwind) scalano linearmente col viewport.
- Per il massimo di nitidezza su 4K: **immagini esportate a 2x rispetto al canvas** (o asset vettoriali / SVG / testo CSS). Il background `BG_HOMEPAGE.jpg` è già 3840×2160.
- Interazione: **touch**, no mouse, no tastiera. Nessun hover, solo stati `:active`.
- Nessun scroll: ogni schermata sta nel viewport.

## Stack

- **Vite + React 19** (JSX, nessun TypeScript salvo richiesta esplicita).
- **Tailwind CSS v4** (configurato via `@tailwindcss/vite`, tema in `src/index.css` con `@theme`).
- **Open Sans** + **Open Sans Condensed** caricati da Google Fonts in `index.html`.
  - Famiglie disponibili come classi Tailwind: `font-sans` (Open Sans), `font-condensed` (Open Sans Condensed).

## Struttura cartelle

```
src/
  App.jsx              # entry applicativo
  main.jsx             # bootstrap React
  index.css            # Tailwind + tema + reset per installazione
  components/          # componenti riusabili
  assets/images/       # PNG/JPG/SVG esportati dai PSD
design/                # PSD sorgenti e riferimenti grafici (non serviti in build)
public/                # file serviti 1:1 (favicon, eventuali video/loop)
```

## Convenzioni grafiche

- I PSD del cliente vanno in `design/`. Le immagini esportate vanno in `src/assets/images/` e importate da JS (così Vite le ottimizza) — a meno che non servano come file statici referenziati da path assoluto, nel qual caso stanno in `public/`.
- Esportare dai PSD a **scala 1:1 rispetto a 1920×1080**. Per elementi rasterizzati considerare @2x se si teme lo scaling su pannelli con DPR maggiore.
- Nessun `max-width` da desktop classico: usare misure fisse in `px` oppure unità viewport (`vw`/`vh`) ragionando sempre su 1920×1080.

## Regole UI per il tavolo

- Target touch minimo: **64×64 px** (meglio 80+ su 50").
- Niente testo sotto i **20 px**; titoli generosi (48+ px) visto il contesto espositivo.
- Niente hover-only: ogni affordance deve essere visibile di default.
- Disabilitati by default: selezione testo, menu contestuale, scroll elastico (vedi reset in `index.css`).
- Preferire transizioni rapide (150–250 ms) per feedback tattile.

## Comandi

```bash
npm install        # primo setup
npm run dev        # dev server su http://localhost:5173 (esposto in LAN via host:true)
npm run build      # build produzione in dist/
npm run preview    # serve la build locale
```

## Note operative

- Quando si aggiunge una schermata, creare un componente in `src/components/` e montarlo da `App.jsx`. Evitare router finché non è richiesto: una macchina a stati semplice in `App.jsx` è spesso sufficiente.
- Quando l'utente fornisce un PSD, chiedere (o dedurre) la dimensione del canvas e rispettarla. Non reinventare layout: implementare quanto esportato.
- Non introdurre TypeScript, React Router, state manager (Redux/Zustand) o librerie UI senza chiederlo prima.
