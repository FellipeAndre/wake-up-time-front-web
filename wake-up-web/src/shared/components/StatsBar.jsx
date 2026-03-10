/**
 * StatsBar Component — Barra de estatísticas refatorada
 */

import './StatsBar.css'

export default function StatsBar({ dados }) {
  if (!dados) return null

  return (
    <section className="stats-bar">
      <div className="stats-bar__container">
        {/* Usuários */}
        <div className="stats-bar__stat">
          <div className="stats-bar__number">
            {dados.totalUsuarios?.toLocaleString() || 0}
          </div>
          <div className="stats-bar__label">
            Usuários Ativos
          </div>
        </div>

        {/* Alarmes */}
        <div className="stats-bar__stat">
          <div className="stats-bar__number">
            {dados.alarmesCriados?.toLocaleString() || 0}
          </div>
          <div className="stats-bar__label">
            Alarmes Criados
          </div>
        </div>

        {/* Horas */}
        <div className="stats-bar__stat">
          <div className="stats-bar__number">
            {dados.horasEconomizadas?.toLocaleString() || 0}h
          </div>
          <div className="stats-bar__label">
            Horas Economizadas
          </div>
        </div>

        {/* Avaliação */}
        <div className="stats-bar__stat">
          <div className="stats-bar__number">
            {dados.avaliacaoMedia || 0} ◆
          </div>
          <div className="stats-bar__label">
            Avaliação Média
          </div>
        </div>
      </div>
    </section>
  )
}
