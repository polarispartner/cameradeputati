import placeholder from '../assets/images/ruolo-donne-bg.jpg'

export const SECTIONS = [
  { id: 'suffragio', title: 'Suffragio' },
  { id: 'consulta', title: 'La Consulta' },
  { id: 'sindache', title: 'Le Sindache' },
  { id: 'costituenti', title: 'Le Costituenti' },
]

const TITLES = [
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

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum. lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Intl reetdomagna aliqua."

const buildItems = (prefix) =>
  TITLES.map((title, i) => ({
    id: `${prefix}-${i + 1}`,
    title,
    image: placeholder,
    description: DESCRIPTION,
  }))

export const FOTO_VIDEO = {
  suffragio: buildItems('suffragio'),
  consulta: buildItems('consulta'),
  sindache: buildItems('sindache'),
  costituenti: buildItems('costituenti'),
}
