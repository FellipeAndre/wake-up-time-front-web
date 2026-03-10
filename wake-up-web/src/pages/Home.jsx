import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import RecursoCard from '../components/RecursoCard'

/**
 * Home Component - Página inicial do Wake Up Now
 */
export default function Home() {
  const navigate = useNavigate()
  const [estatisticas, setEstatisticas] = useState({
    totalUsuarios: 5200,
    alarmesCriados: 12450,
    horasEconomizadas: 8900,
    avaliacaoMedia: 4.8
  })
  
  const [recursos] = useState([
    { id: 1, icone: '⏰', titulo: 'Alarmes Inteligentes', texto: 'Acordar mais cedo nunca foi tão fácil' },
    { id: 2, icone: '📚', titulo: 'Cursos Online', texto: 'Aprenda com conteúdo de qualidade' },
    { id: 3, icone: '🎓', titulo: 'Certificados', texto: 'Ganhe certificados após completar' },
    { id: 4, icone: '👥', titulo: 'Comunidade', texto: 'Conecte-se com outros usuários' }
  ])

  const handleEspecificar = () => {
    navigate('/cadastro')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#e5e5e5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Hero 
        onEspecificar={handleEspecificar}
        onLogin={handleLogin}
      />

      {/* Stats Bar */}
      {estatisticas && (
        <StatsBar dados={estatisticas} />
      )}

      {/* Recursos Section */}
      <section style={{ 
        padding: '60px 40px',
        background: '#1f1f1f',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          textAlign: 'center',
          fontSize: '2rem',
          color: '#b0b0b0',
          marginBottom: '40px'
        }}>
          Por que escolher Wake Up Now?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {recursos.map((recurso) => (
            <RecursoCard
              key={recurso.id}
              icone={recurso.icone}
              titulo={recurso.titulo}
              texto={recurso.texto}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: '#0d0d0d',
        borderTop: '1px solid #3a3a3a'
      }}>
        <h2 style={{ 
          fontSize: '2rem',
          color: '#b0b0b0',
          marginBottom: '20px'
        }}>
          Pronto para começar?
        </h2>
        <p style={{ 
          fontSize: '1.1rem',
          color: '#d0d0d0',
          marginBottom: '30px'
        }}>
          Junte-se a milhares de usuários que já transformaram suas manhãs
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleEspecificar}
            style={{
              padding: '15px 40px',
              background: '#b0b0b0',
              color: '#0d0d0d',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#d0d0d0'}
            onMouseOut={(e) => e.target.style.background = '#b0b0b0'}
          >
            Criar Conta
          </button>

          <button
            onClick={handleLogin}
            style={{
              padding: '15px 40px',
              background: 'transparent',
              color: '#b0b0b0',
              border: '2px solid #b0b0b0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#b0b0b0'
              e.target.style.color = '#0d0d0d'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#b0b0b0'
            }}
          >
            Fazer Login
          </button>
        </div>
      </section>
    </div>
  )
}
