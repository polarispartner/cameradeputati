import donneBg from '../assets/images/ruolo-donne-bg.jpg'
import consultaBg from '../assets/images/consulta-bg.jpg'
import referendumBg from '../assets/images/referendum-bg.jpg'
import costituenteBg from '../assets/images/costituente-bg.jpg'
import { PDF_PAGES } from '../assets/pdfs/manifest'

const item = (id, title, image, description, extra = {}) => ({
  id,
  title,
  image,
  description,
  ...extra,
})

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum. lacus vel facilisis."

const DONNE_TITLES = [
  'Comizio per il voto alle donne',
  'Le prime elettrici al seggio, Roma 1946',
  'Manifesto UDI per il referendum istituzionale',
  'Ritratto',
  'Assemblea',
  "Nilde Iotti all'Assemblea Costituente durante una seduta del pomeriggio di maggio",
  'Teresa Noce interviene in aula sulla questione del lavoro femminile e della parità salariale tra uomini e donne',
  'Le 21 madri costituenti riunite davanti a Montecitorio in una fotografia storica scattata nel 1946',
  'Firma',
  'Corteo',
  'Manifesto elettorale della Democrazia Cristiana rivolto alle donne italiane in vista delle elezioni del 2 giugno 1946',
  'Angela Gotelli',
  "Discorso di Lina Merlin sull'articolo 3 della Costituzione e il principio di uguaglianza tra cittadini senza distinzione di sesso",
  'Seggio di quartiere',
  'Copertina del settimanale Noi Donne dedicata alla vittoria del suffragio femminile nel referendum del 1946',
  'Intervista radiofonica',
  'Comizio di Camilla Ravera in piazza',
  'Schede',
  "Dibattito parlamentare sull'accesso delle donne alle cariche pubbliche e alla magistratura nel dopoguerra italiano",
  'Ritratto ufficiale',
  'Volantino UDI',
  'Angelina Merlin firma la Costituzione',
  'Cerimonia',
  'Riunione della commissione dei 75 con le costituenti',
  "Fotografia di gruppo delle deputate elette all'Assemblea Costituente scattata nel cortile d'onore di Palazzo Montecitorio",
  'Appello alle donne',
  'Prima seduta',
  'Corteo del 1° maggio 1946 con le operaie tessili in testa al cordone',
  "Cronaca dell'Unità",
  'Targa commemorativa',
]

const REFERENDUM_TITLES = {
  campagna: [
    'Manifesto monarchico per la scelta istituzionale',
    'Manifesto repubblicano del CLN',
    'Comizio di Pietro Nenni a Piazza del Popolo',
    'Comizio di Alcide De Gasperi a Milano',
    'Volantino dell\'Unione Democratica Nazionale',
    'Manifesto del Partito Comunista Italiano',
    'Propaganda monarchica a Napoli',
    'Umberto II in visita alle regioni del Sud',
    'Comizio repubblicano a Bologna',
    'Manifesto del Partito d\'Azione',
    'Affissione dei manifesti nelle strade di Roma',
    'Radiocronaca della campagna referendaria',
    'Conferenza stampa di Ivanoe Bonomi',
    'Volantino femminile per la Repubblica',
    'Manifesto elettorale DC',
    'Appello dei reduci per la scelta istituzionale',
  ],
  voto: [
    'Le prime elettrici al seggio',
    'Seggio elettorale a Roma, 2 giugno 1946',
    'File ai seggi nelle prime ore del mattino',
    'Schede per il referendum istituzionale',
    'Urna sigillata al termine della giornata',
    'Presidente di seggio verifica i documenti',
    'Voto nelle campagne del Meridione',
    'Seggio allestito in una scuola elementare',
    'Militari al voto',
    'Anziani accompagnati al seggio',
    'Scrutatori al lavoro',
    'Chiusura dei seggi e inizio spoglio',
    'Trasporto delle urne alle prefetture',
    'Votazioni nelle isole minori',
    'Affluenza ai seggi di Milano',
    'Voto a Torino nel quartiere operaio',
  ],
  risultati: [
    'Proclamazione della Repubblica alla radio',
    'Prima pagina dell\'Unità del 6 giugno 1946',
    'Prima pagina del Corriere della Sera',
    'Folla festante in Piazza del Quirinale',
    'Umberto II lascia il Quirinale',
    'Cerimonia di insediamento di De Nicola',
    'Cartina dei risultati per provincia',
    'Tabella ufficiale dei voti della Cassazione',
    'Esultanza a Piazza Venezia',
    'I risultati definitivi pubblicati in Gazzetta Ufficiale',
    'Reazioni nelle regioni del Sud',
    'Celebrazioni a Milano il 10 giugno',
    'Discorso radiofonico di De Gasperi',
    'Giuramento del governo provvisorio',
  ],
}

const COSTITUENTE_TITLES = {
  composizione: [
    'Apertura dell\'Assemblea Costituente',
    'I 556 deputati eletti il 2 giugno 1946',
    'Gruppo parlamentare Democrazia Cristiana',
    'Gruppo parlamentare Partito Socialista',
    'Gruppo parlamentare Partito Comunista',
    'Le 21 madri costituenti',
    'Foto di gruppo dei deputati del Partito d\'Azione',
    'Rappresentanti dell\'Uomo Qualunque',
    'Il Consiglio di presidenza',
    'Seduta plenaria a Palazzo Montecitorio',
    'Elezione di Giuseppe Saragat a presidente',
    'Composizione della Commissione dei 75',
    'Gruppo parlamentare liberale',
    'Deputati repubblicani in aula',
    'Ingresso dei costituenti a Montecitorio',
    'Foto di gruppo delle donne elette',
  ],
  protagonisti: [
    'Ritratto di Giuseppe Saragat',
    'Umberto Terracini al banco della presidenza',
    'Meuccio Ruini, presidente della Commissione dei 75',
    'Piero Calamandrei durante un intervento',
    'Palmiro Togliatti interviene in aula',
    'Alcide De Gasperi presidente del Consiglio',
    'Pietro Nenni al microfono',
    'Giorgio La Pira alla Costituente',
    'Giuseppe Dossetti in discussione',
    'Aldo Moro, deputato democristiano',
    'Concetto Marchesi relatore',
    'Nilde Iotti durante un intervento',
    'Teresa Mattei alla Costituente',
    'Ferruccio Parri in aula',
  ],
  lavoro: [
    'Apertura dei lavori, 25 giugno 1946',
    'Commissione dei 75 al lavoro',
    'Prima sottocommissione: diritti e doveri',
    'Seconda sottocommissione: ordinamento della Repubblica',
    'Terza sottocommissione: rapporti economici e sociali',
    'Discussione dell\'articolo 1',
    'Dibattito sull\'articolo 3 — principio di uguaglianza',
    'Dibattito sull\'articolo 7 — Patti Lateranensi',
    'Discussione sulle autonomie regionali',
    'Seduta sull\'organizzazione giudiziaria',
    'Approvazione del testo finale, 22 dicembre 1947',
    'Firma della Costituzione da parte di De Nicola',
    'Promulgazione della Costituzione, 27 dicembre 1947',
    'Pubblicazione in Gazzetta Ufficiale',
    'Seduta sulle disposizioni transitorie',
    'Relazione finale di Meuccio Ruini',
  ],
}

const CONSULTA_TITLES = {
  composizione: [
    'Prima seduta plenaria della Consulta Nazionale',
    'I 430 consultori riuniti a Palazzo Montecitorio',
    'Nomina dei rappresentanti dei partiti del CLN',
    'Delegazione dei sindacati alla Consulta',
    'Ritratto del Presidente Carlo Sforza',
    'Gruppo parlamentare democristiano',
    'Gruppo parlamentare comunista',
    'Gruppo parlamentare socialista',
    'Rappresentanti del Partito d\'Azione',
    'Delegati liberali in aula',
    'I consultori nominati dal governo Parri',
    'Composizione delle commissioni permanenti',
    'Le donne alla Consulta Nazionale',
    'Seduta congiunta con il governo De Gasperi',
    'Rinnovo della composizione nel marzo 1946',
    'Ingresso dei consultori a Montecitorio',
    'Foto di gruppo del Consiglio di presidenza',
    'Arrivo della delegazione regionale siciliana',
  ],
  protagonisti: [
    'Ritratto ufficiale di Carlo Sforza',
    'Meuccio Ruini in aula',
    'Vittorio Emanuele Orlando interviene alla Consulta',
    'Benedetto Croce durante un intervento',
    'Ivanoe Bonomi, già presidente del Consiglio',
    'Ferruccio Parri, primo proponente della Consulta',
    'Alcide De Gasperi tra i banchi',
    'Palmiro Togliatti in discussione',
    'Pietro Nenni al microfono',
    'Giuseppe Saragat interviene',
    'Randolfo Pacciardi alla tribuna',
    'Ugo La Malfa, esponente azionista',
    'Concetto Marchesi durante una relazione',
    'Angela Maria Cingolani, prima donna alla Consulta',
  ],
  lavoro: [
    'Dibattito sulla legge elettorale',
    'Discussione sul referendum istituzionale',
    'Relazione sulla riforma agraria',
    'Lavori della commissione finanze',
    'Seduta notturna sulla legge sul voto alle donne',
    'Parere sul bilancio dello Stato 1946',
    'Discussione sul trattato di pace',
    'Commissione per l\'epurazione',
    'Lavori preparatori della Costituente',
    'Parere sulla legge sulla stampa',
    'Interventi sul risarcimento dei danni di guerra',
    'Commissione industria e commercio',
    'Seduta sul ripristino della libertà sindacale',
    'Relazione sulle autonomie regionali',
    'Dibattito sui criteri di selezione per i costituenti',
    'Approvazione del parere sul DLL 98/1946',
  ],
}

const buildItems = (prefix, titles, image) =>
  titles.map((title, i) =>
    item(`${prefix}-${i + 1}`, title, image, LOREM),
  )

export const TOPICS = [
  {
    id: 'donne',
    title: 'Il ruolo delle donne',
    theme: '#1ed0c7',
    bg: donneBg,
    sections: [
      {
        id: 'suffragio',
        title: 'Suffragio',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('donne-suffragio-foto', DONNE_TITLES, donneBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('donne-suffragio-giornale', DONNE_TITLES.slice(0, 12), donneBg) },
          {
            type: 'documenti',
            title: 'Documenti',
            items: [
              item(
                'donne-suffragio-doc-1',
                DONNE_TITLES[0],
                PDF_PAGES['donne/pdf-di-test'][0],
                LOREM,
                { pages: PDF_PAGES['donne/pdf-di-test'] },
              ),
              ...buildItems('donne-suffragio-doc-rest', DONNE_TITLES.slice(1, 8), donneBg),
            ],
          },
        ],
      },
      {
        id: 'consulta',
        title: 'La Consulta',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('donne-consulta-foto', DONNE_TITLES, donneBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('donne-consulta-giornale', DONNE_TITLES.slice(0, 10), donneBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('donne-consulta-doc', DONNE_TITLES.slice(0, 6), donneBg) },
        ],
      },
      {
        id: 'sindache',
        title: 'Le Sindache',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('donne-sindache-foto', DONNE_TITLES, donneBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('donne-sindache-giornale', DONNE_TITLES.slice(0, 10), donneBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('donne-sindache-doc', DONNE_TITLES.slice(0, 6), donneBg) },
        ],
      },
      {
        id: 'costituenti',
        title: 'Le Costituenti',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('donne-costituenti-foto', DONNE_TITLES, donneBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('donne-costituenti-giornale', DONNE_TITLES.slice(0, 10), donneBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('donne-costituenti-doc', DONNE_TITLES.slice(0, 6), donneBg) },
        ],
      },
    ],
  },
  {
    id: 'consulta',
    title: 'La Consulta nazionale',
    theme: '#ec1f81',
    bg: consultaBg,
    sections: [
      {
        id: 'composizione',
        title: 'La composizione',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('consulta-comp-foto', CONSULTA_TITLES.composizione, consultaBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('consulta-comp-doc', CONSULTA_TITLES.composizione.slice(0, 8), consultaBg) },
        ],
      },
      {
        id: 'protagonisti',
        title: 'I protagonisti',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('consulta-prot-foto', CONSULTA_TITLES.protagonisti, consultaBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('consulta-prot-giornale', CONSULTA_TITLES.protagonisti.slice(0, 10), consultaBg) },
        ],
      },
      {
        id: 'lavoro',
        title: 'Il lavoro',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('consulta-lav-foto', CONSULTA_TITLES.lavoro, consultaBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('consulta-lav-giornale', CONSULTA_TITLES.lavoro.slice(0, 12), consultaBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('consulta-lav-doc', CONSULTA_TITLES.lavoro.slice(0, 8), consultaBg) },
        ],
      },
    ],
  },
  {
    id: 'referendum',
    title: 'Il Referendum del 2 giugno',
    theme: '#8ebdf5',
    bg: referendumBg,
    sections: [
      {
        id: 'campagna',
        title: 'La campagna',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('ref-camp-foto', REFERENDUM_TITLES.campagna, referendumBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('ref-camp-giornale', REFERENDUM_TITLES.campagna.slice(0, 10), referendumBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('ref-camp-doc', REFERENDUM_TITLES.campagna.slice(0, 8), referendumBg) },
        ],
      },
      {
        id: 'voto',
        title: 'Il voto',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('ref-voto-foto', REFERENDUM_TITLES.voto, referendumBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('ref-voto-giornale', REFERENDUM_TITLES.voto.slice(0, 10), referendumBg) },
        ],
      },
      {
        id: 'risultati',
        title: 'I risultati',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('ref-ris-foto', REFERENDUM_TITLES.risultati, referendumBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('ref-ris-giornale', REFERENDUM_TITLES.risultati.slice(0, 12), referendumBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('ref-ris-doc', REFERENDUM_TITLES.risultati.slice(0, 6), referendumBg) },
        ],
      },
    ],
  },
  {
    id: 'costituente',
    title: "L'Assemblea Costituente",
    theme: '#00715a',
    bg: costituenteBg,
    sections: [
      {
        id: 'composizione',
        title: 'La composizione',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('cost-comp-foto', COSTITUENTE_TITLES.composizione, costituenteBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('cost-comp-doc', COSTITUENTE_TITLES.composizione.slice(0, 8), costituenteBg) },
        ],
      },
      {
        id: 'protagonisti',
        title: 'I protagonisti',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('cost-prot-foto', COSTITUENTE_TITLES.protagonisti, costituenteBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('cost-prot-giornale', COSTITUENTE_TITLES.protagonisti.slice(0, 10), costituenteBg) },
        ],
      },
      {
        id: 'lavoro',
        title: 'Il lavoro',
        subsections: [
          { type: 'foto', title: 'Foto/Video', items: buildItems('cost-lav-foto', COSTITUENTE_TITLES.lavoro, costituenteBg) },
          { type: 'giornale', title: 'Giornale', items: buildItems('cost-lav-giornale', COSTITUENTE_TITLES.lavoro.slice(0, 12), costituenteBg) },
          { type: 'documenti', title: 'Documenti', items: buildItems('cost-lav-doc', COSTITUENTE_TITLES.lavoro.slice(0, 8), costituenteBg) },
        ],
      },
    ],
  },
]

export const findTopic = (topicId) => TOPICS.find((t) => t.id === topicId)

export const findSection = (topicId, sectionId) =>
  findTopic(topicId)?.sections.find((s) => s.id === sectionId)

export const findSubsection = (topicId, sectionId, subType) =>
  findSection(topicId, sectionId)?.subsections.find((s) => s.type === subType)

export const findItem = (topicId, sectionId, subType, itemId) =>
  findSubsection(topicId, sectionId, subType)?.items.find((i) => i.id === itemId)
