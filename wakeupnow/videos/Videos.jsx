import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: Videos
 * 
 * Responsabilidade:
 * - Exibir biblioteca de vídeos
 * - Filtrar por tema
 * - Buscar por título
 * - Controle de acesso por plano
 */

export default function Videos() {
  const [videos] = useState([
    {
      id: 1,
      title: 'Como acordar cedo',
      theme: 'Rotina',
      duration: '12:30',
      locked: false,
      thumbnail: '🎥'
    },
    {
      id: 2,
      title: 'Técnicas de meditação',
      theme: 'Bem-estar',
      duration: '18:45',
      locked: false,
      thumbnail: '🧘'
    },
    {
      id: 3,
      title: 'Exercícios matinais',
      theme: 'Fitness',
      duration: '25:00',
      locked: true,
      thumbnail: '💪'
    },
    {
      id: 4,
      title: 'Nutrição para madrugadores',
      theme: 'Saúde',
      duration: '15:20',
      locked: true,
      thumbnail: '🥗'
    },
  ]);

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const themes = ['Rotina', 'Bem-estar', 'Fitness', 'Saúde'];

  const filteredVideos = videos.filter(video => {
    const matchesTheme = !selectedTheme || video.theme === selectedTheme;
    const matchesSearch = !searchQuery || video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const handlePlayVideo = (video) => {
    if (video.locked && !window.AuthState.isAuthenticated()) {
      alert('Você precisa estar logado para acessar este vídeo');
      return;
    }
    if (video.locked) {
      alert('Este vídeo requer uma assinatura Premium');
      return;
    }
    alert(`Reproduzindo: ${video.title}`);
  };

  return (
    <div className="view active" style={{padding: '40px'}}>
      <div className="videos-container">
        
        {/* Busca */}
        <div className="search-container">
          <input 
            type="text"
            placeholder="🔍 Buscar vídeo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filtros por tema */}
        <div className="theme-filters">
          <button 
            className={`theme-btn ${!selectedTheme ? 'active' : ''}`}
            onClick={() => setSelectedTheme(null)}
          >
            Todos
          </button>
          {themes.map(theme => (
            <button 
              key={theme}
              className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => setSelectedTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Grid de vídeos */}
        <div className="videos-grid">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  {video.thumbnail}
                  {video.locked && <div className="lock-badge">🔒</div>}
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="video-theme">{video.theme}</p>
                  <p className="video-duration">⏱️ {video.duration}</p>
                  <button 
                    className={`btn btn-sm ${video.locked ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handlePlayVideo(video)}
                  >
                    {video.locked ? '🔒 Bloqueado' : '▶ Assistir'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)'}}>
              Nenhum vídeo encontrado
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// Styles
const styles = `
.videos-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--silver);
  box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.1);
}

.theme-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
}

.theme-btn:hover {
  border-color: var(--silver);
  color: var(--silver);
}

.theme-btn.active {
  background: var(--silver);
  color: var(--charcoal);
  border-color: var(--silver);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.video-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.video-card:hover {
  border-color: var(--silver);
  box-shadow: var(--shadow-md);
}

.video-thumbnail {
  aspect-ratio: 16/9;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
}

.lock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.5rem;
  background: rgba(0,0,0,0.5);
  padding: 4px 8px;
  border-radius: 4px;
}

.video-info {
  padding: 16px;
}

.video-info h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-theme {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.video-duration {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 12px 0;
}
`;
