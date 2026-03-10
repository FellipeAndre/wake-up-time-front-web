/**
 * RecursoCard - Card individual de recurso/feature
 */
export default function RecursoCard({ id, icone, titulo, texto, onClick }) {
  return (
    <div
      onClick={onClick}
      role="article"
      aria-label={titulo}
      style={{
        padding: '30px',
        background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
        border: '1px solid #3a3a3a',
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)'
          e.currentTarget.style.borderColor = '#b0b0b0'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(176, 176, 176, 0.15)'
          e.currentTarget.style.transform = 'translateY(-4px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'
        e.currentTarget.style.borderColor = '#3a3a3a'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Ícone */}
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '16px',
        display: 'inline-block'
      }}>
        {icone}
      </div>

      {/* Título */}
      <h3 style={{
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#e5e5e5',
        marginBottom: '10px'
      }}>
        {titulo}
      </h3>

      {/* Descrição */}
      <p style={{
        fontSize: '0.9rem',
        color: '#8a8a8a',
        lineHeight: '1.5',
        margin: '0'
      }}>
        {texto}
      </p>
    </div>
  )
}
