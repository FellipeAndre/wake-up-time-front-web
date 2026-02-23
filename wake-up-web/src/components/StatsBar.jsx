/*
  components/StatsBar.jsx — Componente: Barra de Estatísticas

  Responsabilidade:
  - Renderizar estatísticas do aplicativo
  - Exibir números em cards
  - Nenhuma lógica de requisição

  Props:
  - dados: objeto com { totalUsuarios, alarmesCriados, etc }

  Boas Práticas:
  - Validar props com PropTypes (opcional)
  - Ter defaults case não receba dados
  - Componente stateless (sem useState)
*/

export default function StatsBar({ dados }) {
  // Validação: se não receber dados, não renderizar
  if (!dados) {
    return null
  }

  return (
    <section className="stats-bar">
      <div className="container stats-container">
        <div className="stat-item revelar">
          <div className="stat-numero">{dados.totalUsuarios || 0}</div>
          <div className="stat-label">Usuários ativos</div>
        </div>

        <div className="stat-item revelar">
          <div className="stat-numero">{dados.alarmesCriados || 0}</div>
          <div className="stat-label">Alarmes criados</div>
        </div>

        <div className="stat-item revelar">
          <div className="stat-numero">{dados.horasEconomizadas || 0}h</div>
          <div className="stat-label">Horas recuperadas</div>
        </div>

        <div className="stat-item revelar">
          <div className="stat-numero">⭐ {dados.avaliacaoMedia || 0}</div>
          <div className="stat-label">Avaliação média</div>
        </div>
      </div>
    </section>
  )
}
