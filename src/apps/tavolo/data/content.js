import donneBg from '../assets/images/ruolo-donne-bg.jpg'
import consultaBg from '../assets/images/consulta-bg.jpg'
import referendumBg from '../assets/images/referendum-bg.jpg'
import costituenteBg from '../assets/images/costituente-bg.jpg'
import { TOPIC_ITEMS } from '../assets/images/contents/manifest'

const SUB_ORDER = ['foto', 'giornale', 'documenti']
// "giornale" è l'id interno usato da ingest (mappa STAMPA → giornale); il titolo
// mostrato è sempre "Stampa" per tutti i temi.
const SUB_TITLE = { foto: 'Foto', giornale: 'Stampa', documenti: 'Documenti' }

const buildSubsections = (topicId, sectionId) => {
  const sec = TOPIC_ITEMS[topicId]?.[sectionId] || {}
  return SUB_ORDER.filter((t) => sec[t]?.length).map((type) => ({
    type,
    title: SUB_TITLE[type],
    items: sec[type],
  }))
}

const section = (topicId, id, title) => ({
  id,
  title,
  subsections: buildSubsections(topicId, id),
})

export const TOPICS = [
  {
    id: 'consulta',
    title: 'La Consulta nazionale',
    theme: '#ec1f81',
    bg: consultaBg,
    sections: [
      section('consulta', 'composizione', 'La composizione'),
      section('consulta', 'lavoro', 'Il lavoro'),
    ],
  },
  {
    id: 'donne',
    title: 'Il voto alle donne',
    theme: '#1ed0c7',
    bg: donneBg,
    sections: [
      section('donne', 'suffragio', "L'estensione del suffragio"),
      section('donne', 'amministrative', 'Le elezioni amministrative'),
    ],
  },
  {
    id: 'referendum',
    title: 'Il Referendum istituzionale',
    theme: '#8ebdf5',
    bg: referendumBg,
    sections: [
      section('referendum', 'campagna', 'La campagna'),
      section('referendum', 'voto', 'Il voto'),
      section('referendum', 'risultati', 'I risultati'),
    ],
  },
  {
    id: 'costituente',
    title: "L'Assemblea Costituente",
    theme: '#00715a',
    bg: costituenteBg,
    sections: [
      section('costituente', 'composizione', "L'elezione e la composizione"),
      section('costituente', 'lavoro', 'Il lavoro'),
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
