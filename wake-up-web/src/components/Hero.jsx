/*
  components/Hero.jsx — Componente: Seção Hero

  Responsabilidade:
  - Renderizar UI da seção hero
  - Receber callbacks via props
  - Nenhuma lógica de negócio
  - Nenhuma requisição HTTP

  Analogia Spring Boot:
  - É como um Thymeleaf template
  - Recebe dados via Model
  - Renderiza HTML

  Props:
  - onEspecificar: callback quando clica em "Começar"
  - onLogin: callback quando clica em "Já tenho conta"

  Padrão:
  - Component recebe dados via props
  - Chamar callbacks (handlers) via props
  - Nunca fazer fetch direto
*/

export default function Hero({ onEspecificar, onLogin }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <span className="dot"></span>
          Acorde. Evolua. Repita.
        </div>

        <h1 className="hero-titulo">
          Sua melhor<br />
          <span className="destaque">jornada</span>
          <span className="glow">.</span>
        </h1>

        <p className="hero-descricao">
          O Wake Up Now transforma sua rotina matinal em um ritual de
          produtividade com alarmes inteligentes e acompanhamento de sono.
        </p>

        <div className="hero-botoes">
          <button
            className="btn btn-primary btn-lg"
            onClick={onEspecificar}
          >
            Começar grátis →
          </button>
          <button
            className="btn btn-secundario btn-lg"
            onClick={onLogin}
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </section>
  )
}
