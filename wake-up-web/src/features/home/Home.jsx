/**
 * Home Feature — Página inicial refatorada
 * 
 * Melhorias:
 * - Estilos separados em CSS
 * - Componentes reutilizáveis
 * - Sem estilos inline
 * - Sem emojis (usando símbolos Unicode para melhor acessibilidade)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../../shared/components/Hero'
import StatsBar from '../../shared/components/StatsBar'
import RecursoCard from '../../shared/components/RecursoCard'
import { Button } from '../../shared/components'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  
  const [estatisticas] = useState({
    totalUsuarios: 5200,
    alarmesCriados: 12450,
    horasEconomizadas: 8900,
    avaliacaoMedia: 4.8
  })
  
  // Recursos com símbolos em vez de emojis para melhor acessibilidade
  const [recursos] = useState([
    { id: 1, icone: '◆', titulo: 'Alarmes Inteligentes', texto: 'Acordar mais cedo nunca foi tão fácil' },
    { id: 2, icone: '▢', titulo: 'Cursos Online', texto: 'Aprenda com conteúdo de qualidade' },
    { id: 3, icone: '◈', titulo: 'Certificados', texto: 'Ganhe certificados após completar' },
    { id: 4, icone: '◇', titulo: 'Comunidade', texto: 'Conecte-se com outros usuários' }
  ])

  const handleEspecificar = () => {
    navigate('/cadastro')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="home-page">
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
      <section className="home-recursos">
        <h2 className="home-recursos__title">
          Por que escolher Wake Up Now?
        </h2>

        <div className="home-recursos__grid">
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
      <section className="home-cta">
        <h2 className="home-cta__title">
          Pronto para começar?
        </h2>
        <p className="home-cta__subtitle">
          Junte-se a milhares de usuários que já transformaram suas manhãs
        </p>

        <div className="home-cta__buttons">
          <Button
            variant="primary"
            size="lg"
            onClick={handleEspecificar}
            aria-label="Criar nova conta"
          >
            Criar Conta
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleLogin}
            aria-label="Fazer login na conta existente"
          >
            Fazer Login
          </Button>
        </div>
      </section>
    </div>
  )
}
