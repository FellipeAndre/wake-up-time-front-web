/**
 * StatsBar Component - Barra de estatísticas
 */
export default function StatsBar({ dados }) {
  if (!dados) return null

  return (
    <section style={{
      padding: '40px',
      background: '#1f1f1f',
      borderTop: '1px solid #3a3a3a',
      borderBottom: '1px solid #3a3a3a'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        {/* Usuários */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#b0b0b0',
            marginBottom: '10px'
          }}>
            {dados.totalUsuarios?.toLocaleString() || 0}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#8a8a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Usuários Ativos
          </div>
        </div>

        {/* Alarmes */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#b0b0b0',
            marginBottom: '10px'
          }}>
            {dados.alarmesCriados?.toLocaleString() || 0}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#8a8a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Alarmes Criados
          </div>
        </div>

        {/* Horas */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#b0b0b0',
            marginBottom: '10px'
          }}>
            {dados.horasEconomizadas?.toLocaleString() || 0}h
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#8a8a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Horas Economizadas
          </div>
        </div>

        {/* Avaliação */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#b0b0b0',
            marginBottom: '10px'
          }}>
            {dados.avaliacaoMedia || 0} ⭐
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#8a8a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Avaliação Média
          </div>
        </div>
      </div>
    </section>
  )
}
