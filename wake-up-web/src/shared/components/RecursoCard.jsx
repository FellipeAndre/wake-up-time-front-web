/**
 * RecursoCard Component — Card de recurso refatorado
 */

import './RecursoCard.css'

export default function RecursoCard({ icone, titulo, texto }) {
  return (
    <article className="recurso-card">
      <div className="recurso-card__icon" aria-hidden="true">
        {icone}
      </div>
      <h3 className="recurso-card__title">{titulo}</h3>
      <p className="recurso-card__text">{texto}</p>
    </article>
  )
}
