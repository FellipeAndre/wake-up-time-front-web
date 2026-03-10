/**
 * Hero Component — Seção principal refatorada
 */

import { Button } from './index'
import './Hero.css'

export default function Hero({ onEspecificar, onLogin }) {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          Wake Up Now
        </h1>
        
        <p className="hero__subtitle">
          Desperte seu potencial com alarmes inteligentes e aprendizado de qualidade
        </p>

        <div className="hero__buttons">
          <Button
            variant="primary"
            size="lg"
            onClick={onEspecificar}
            aria-label="Criar conta nova"
          >
            Começar grátis
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={onLogin}
            aria-label="Fazer login"
          >
            Já tenho conta
          </Button>
        </div>

        <p className="hero__trust">
          Junte-se a milhares de usuários que acordam cedo
        </p>
      </div>

      <div className="hero__background">
        {/* Decorative background element */}
      </div>
    </section>
  )
}
