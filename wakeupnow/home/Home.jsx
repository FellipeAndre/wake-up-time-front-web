import React from 'react';

/**
 * COMPONENTE: Home
 * 
 * Responsabilidade:
 * - Página inicial/landing page
 * - Exibir conteúdo destacado
 * - Call-to-action para cadastro/login
 * - Estatísticas do site
 */

export default function Home() {
  const isAuthenticated = window.AuthState && window.AuthState.isAuthenticated();
  const user = window.AuthState && window.AuthState.data.user;

  const featuredVideos = [
    { id: 1, title: 'Acordar mais cedo', emoji: '🌅' },
    { id: 2, title: 'Meditação matinal', emoji: '🧘' },
    { id: 3, title: 'Exercícios matinais', emoji: '💪' }
  ];

  const stats = [
    { label: 'Vídeos', value: '150+' },
    { label: 'Usuários ativos', value: '5.2k' },
    { label: 'Tempo total', value: '500h' }
  ];

  return (
    <div className="view active home-view">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Acorde mais cedo</h1>
          <p className="hero-subtitle">Aprenda técnicas comprovadas para acordar mais cedo e transformar sua vida</p>
          
          {!isAuthenticated ? (
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg">
                ✨ Começar agora
              </button>
              <button className="btn btn-secondary btn-lg">
                📖 Saber mais
              </button>
            </div>
          ) : (
            <div className="hero-welcome">
              <h2>Bem-vindo, {user?.name}! 👋</h2>
              <p>Continue sua jornada de aprendizado</p>
              <button className="btn btn-primary btn-lg">
                ▶ Assistir aula
              </button>
            </div>
          )}
        </div>

        <div className="hero-image">
          <div className="hero-emoji">🌅</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Videos */}
      {isAuthenticated && (
        <section className="featured">
          <h2>Conteúdo em destaque</h2>
          <div className="featured-grid">
            {featuredVideos.map(video => (
              <div key={video.id} className="featured-card">
                <div className="featured-emoji">{video.emoji}</div>
                <h3>{video.title}</h3>
                <button className="btn btn-sm btn-primary">Assistir</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features">
        <h2>Por que Wake Up Now?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Conteúdo estruturado</h3>
            <p>Vídeos em sequência lógica para você aprender passo a passo</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Certificados</h3>
            <p>Receba certificados ao concluir os cursos</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Comunidade</h3>
            <p>Conecte-se com outras pessoas em busca dos mesmos objetivos</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Acesso 24/7</h3>
            <p>Assista quando quiser, onde quiser, quantas vezes quiser</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Preço acessível</h3>
            <p>Planos para todos os orçamentos</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Transformação real</h3>
            <p>Resultados comprovados de usuários do mundo inteiro</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Comece sua transformação hoje</h2>
        <p>Junte-se a milhares de pessoas que já acordam mais cedo</p>
        <button className="btn btn-primary btn-lg">🚀 Assinar agora</button>
      </section>

    </div>
  );
}

// Styles
const styles = `
.home-view {
  padding: 0;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(200, 200, 200, 0.05) 0%, rgba(200, 200, 200, 0.02) 100%);
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 60px 40px;
    gap: 40px;
  }
}

.hero-content h1 {
  font-size: 3rem;
  margin: 0 0 16px 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-welcome {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 32px;
}

.hero-welcome h2 {
  margin: 0 0 8px 0;
  color: var(--silver);
  font-size: 1.5rem;
}

.hero-welcome p {
  margin: 0 0 20px 0;
  color: var(--text-secondary);
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-emoji {
  font-size: 8rem;
  opacity: 0.8;
}

.btn-lg {
  padding: 14px 32px;
  font-size: 1.1rem;
}

/* Stats Section */
.stats {
  padding: 60px 40px;
  background: var(--bg-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--silver);
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Featured Section */
.featured {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.featured h2 {
  margin-top: 0;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.featured-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
}

.featured-card:hover {
  border-color: var(--silver);
  box-shadow: var(--shadow-md);
}

.featured-emoji {
  font-size: 3rem;
  margin-bottom: 16px;
}

.featured-card h3 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

/* Features Section */
.features {
  padding: 60px 40px;
  background: var(--bg-secondary);
}

.features h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 50px;
  color: var(--text-primary);
  font-size: 2.2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 32px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--silver);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.feature-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(200, 200, 200, 0.1) 0%, rgba(200, 200, 200, 0.05) 100%);
  text-align: center;
}

.cta h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--text-primary);
  font-size: 2.5rem;
}

.cta p {
  margin: 0 0 32px 0;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-emoji {
    font-size: 5rem;
  }

  .stats,
  .featured,
  .features,
  .cta {
    padding: 40px 20px;
  }

  .cta h2 {
    font-size: 1.8rem;
  }
}
`;
