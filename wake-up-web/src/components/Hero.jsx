/**
 * Hero Component - Seção banner principal
 */
export default function Hero({ onEspecificar, onLogin }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1f1f1f 100%)',
      padding: '100px 40px',
      textAlign: 'center',
      borderBottom: '1px solid #3a3a3a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(176, 176, 176, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: '0'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(176, 176, 176, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: '0'
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: '1'
      }}>
        {/* Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          paddingBottom: '20px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          color: '#8a8a8a',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#b0b0b0',
            borderRadius: '50%'
          }} />
          Acorde. Evolua. Repita.
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          color: '#e5e5e5',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          Sua melhor<br />
          <span style={{ color: '#b0b0b0' }}>jornada</span>
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: '1.1rem',
          color: '#8a8a8a',
          marginBottom: '50px',
          lineHeight: '1.6',
          maxWidth: '700px',
          margin: '0 auto 50px'
        }}>
          O Wake Up Now transforma sua rotina matinal em um ritual de
          produtividade com alarmes inteligentes e acompanhamento de sono.
        </p>

        {/* Botões CTA */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onEspecificar}
            style={{
              padding: '15px 40px',
              fontSize: '1rem',
              fontWeight: '600',
              background: '#b0b0b0',
              color: '#0d0d0d',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(176, 176, 176, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e0e0e0'
              e.target.style.boxShadow = '0 6px 20px rgba(176, 176, 176, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#b0b0b0'
              e.target.style.boxShadow = '0 4px 15px rgba(176, 176, 176, 0.3)'
            }}
          >
            Começar grátis →
          </button>

          <button
            onClick={onLogin}
            style={{
              padding: '15px 40px',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'transparent',
              color: '#b0b0b0',
              border: '2px solid #b0b0b0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(176, 176, 176, 0.1)'
              e.target.style.borderColor = '#e0e0e0'
              e.target.style.color = '#e0e0e0'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = '#b0b0b0'
              e.target.style.color = '#b0b0b0'
            }}
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </section>
  )
}
