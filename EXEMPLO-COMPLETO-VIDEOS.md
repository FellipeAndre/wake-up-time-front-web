# 🔗 EXEMPLO COMPLETO: Adicionar Novo Serviço

Exemplo real mostrando como **adicionar uma nova funcionalidade** na arquitetura moderna.

**Cenário:** Implementar página "Vídeos" com listagem e filtragem.

---

## 📍 Step-by-Step

### PASSO 1: Definir Endpoint Spring Boot

```java
// Backend Spring Boot (Java)
// VideosController.java

@RestController
@RequestMapping("/api/videos")
public class VideosController {

  @Autowired
  private VideoService videoService;

  @GetMapping("/list")
  public ResponseEntity<?> listarVideos(
    @RequestParam(required = false) String tema,
    @RequestParam(required = false) String modulo
  ) {
    List<VideoDTO> videos = videoService.listar(tema, modulo);
    return ResponseEntity.ok(videos);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
    VideoDTO video = videoService.buscarPorId(id);
    return ResponseEntity.ok(video);
  }

  @PostMapping("/{id}/favoritar")
  public ResponseEntity<?> favoritarVideo(@PathVariable Long id) {
    videoService.favoritarVideo(id);
    return ResponseEntity.ok().build();
  }
}
```

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "titulo": "Como acordar cedo",
    "descricao": "Dicas práticas...",
    "tema": "Hábitos",
    "modulo": "Fundamentos",
    "thumb": "https://...",
    "duracao": 480,
    "assistido": false,
    "favorito": false
  }
]
```

---

### PASSO 2: Criar Service em React

```javascript
// src/services/videosService.js

import api from './api'

/*
  VideoService — Lógica de vídeos
  
  Responsabilidade:
  - Chamar endpoints de vídeos
  - Transformar respostas
  - Tratar erros específicos
  
  Análogo em Spring:
  - @Service class VideoService
*/

export const videosService = {
  
  /*
    Listar vídeos com filtros opcionais
    
    GET /api/videos/list?tema=Hábitos&modulo=Fundamentos
  */
  async listarVideos(filtros = {}) {
    try {
      const { data } = await api.get('/videos/list', {
        params: filtros  // Converte em query string
      })
      
      // Validação e transformação (opcional)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('[videosService.listarVideos]', error.message)
      throw error
    }
  },

  /*
    Buscar vídeo específico
    
    GET /api/videos/{id}
  */
  async buscarPorId(id) {
    try {
      const { data } = await api.get(`/videos/${id}`)
      return data
    } catch (error) {
      console.error('[videosService.buscarPorId]', error.message)
      throw error
    }
  },

  /*
    Marcar como favorito
    
    POST /api/videos/{id}/favoritar
  */
  async favoritarVideo(id) {
    try {
      const { data } = await api.post(`/videos/${id}/favoritar`)
      return data
    } catch (error) {
      console.error('[videosService.favoritarVideo]', error.message)
      throw error
    }
  }
}

export default videosService
```

---

### PASSO 3: Criar Page Component (Orquestrador)

```javascript
// src/pages/Videos.jsx

import { useState, useEffect } from 'react'
import videosService from '../services/videosService'
import VideoCard from '../components/VideoCard'
import '../styles/videos.css'

/*
  Videos Page — Orquestradora
  
  Responsabilidade:
  - Gerenciar estado de filtros
  - Chamar service de vídeos
  - Tratar erros
  - Passar dados para components
  - Lidar com interações complexas
  
  Análogo em Spring:
  - @RestController que orquestra @Service
*/

export default function Videos() {
  // ESTADO
  const [videos, setVideos] = useState([])
  const [filtros, setFiltros] = useState({
    tema: '',
    modulo: ''
  })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // LIFECYCLE: Executado ao montar E quando filtros mudam
  useEffect(() => {
    async function carregarVideos() {
      try {
        setCarregando(true)
        setErro(null)

        // Chamar service com filtros atuais 🔑
        const dados = await videosService.listarVideos(filtros)
        setVideos(dados)
      } catch (erro) {
        console.error('[Videos.jsx]', erro.message)
        setErro('Erro ao carregar vídeos. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    carregarVideos()
  }, [filtros]) // Re-carrega quando filtros mudam

  // HANDLERS
  const handleFiltroTema = (novaTema) => {
    setFiltros(prev => ({ ...prev, tema: novaTema }))
  }

  const handleFiltroModulo = (novoModulo) => {
    setFiltros(prev => ({ ...prev, modulo: novoModulo }))
  }

  const handleFavoritarVideo = async (videoId) => {
    try {
      await videosService.favoritarVideo(videoId)
      
      // Atualizar estado local
      setVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, favorito: !v.favorito } : v
      ))
    } catch (erro) {
      setErro('Erro ao favoritarizar. Tente novamente.')
    }
  }

  // RENDERIZAÇÃO
  if (carregando) {
    return <div className="loading"><span className="spinner"></span></div>
  }

  if (erro) {
    return <div className="error"><p>{erro}</p></div>
  }

  return (
    <section className="videos-page">
      <h1>Biblioteca de Vídeos</h1>

      {/* FILTROS */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Tema..."
          value={filtros.tema}
          onChange={e => handleFiltroTema(e.target.value)}
          className="filtro-input"
        />
        <input
          type="text"
          placeholder="Módulo..."
          value={filtros.modulo}
          onChange={e => handleFiltroModulo(e.target.value)}
          className="filtro-input"
        />
      </div>

      {/* GRID DE VÍDEOS */}
      <div className="videos-grid">
        {videos.length > 0 ? (
          videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onFavorito={() => handleFavoritarVideo(video.id)}
            />
          ))
        ) : (
          <p className="sem-resultados">Nenhum vídeo encontrado.</p>
        )}
      </div>
    </section>
  )
}
```

---

### PASSO 4: Criar Component Presentational

```javascript
// src/components/VideoCard.jsx

/*
  VideoCard Component — Presentational (apenas renderiza)
  
  Responsabilidade:
  - Exibir informações do vídeo
  - Receber handlers via props
  - Zero lógica de negócio
  
  Análogo em Spring/Thymeleaf:
  - Template que recebe dados via Model
*/

export default function VideoCard({ video, onFavorito }) {
  return (
    <div className="video-card">
      {/* Thumbnail */}
      <div className="video-thumb">
        <img src={video.thumb} alt={video.titulo} />
        <span className="duracao">{formatarDuracao(video.duracao)}</span>
      </div>

      {/* Info */}
      <div className="video-info">
        <p className="video-tema">{video.tema} / {video.modulo}</p>
        <h3 className="video-titulo">{video.titulo}</h3>
        <p className="video-descricao">{video.descricao}</p>
      </div>

      {/* Actions */}
      <div className="video-actions">
        <button
          className={`btn-favorito ${video.favorito ? 'ativo' : ''}`}
          onClick={onFavorito}
          title={video.favorito ? 'Remover favorito' : 'Adicionar favorito'}
        >
          ⭐
        </button>
        <button className="btn-play">
          ▶ Assistir
        </button>
      </div>
    </div>
  )
}

// Utilitário: formatar duração
function formatarDuracao(segundos) {
  const minutos = Math.floor(segundos / 60)
  return `${minutos}:${(segundos % 60).toString().padStart(2, '0')}`
}
```

---

### PASSO 5: Registrar Rota

```javascript
// src/routes/router.jsx

import Videos from '../pages/Videos'

const router = [
  // ... outras rotas
  {
    path: '/videos',
    element: <Videos />
  },
  // ... mais rotas
]

export default router
```

---

### PASSO 6: Adicionar ao Menu

```javascript
// src/components/layout/Layout.jsx

function Sidebar({ onNavigate }) {
  const menuItems = [
    { label: 'Home', icon: '⌂', path: '/home' },
    { label: 'Vídeos', icon: '🎬', path: '/videos' },  // ← Novo
    { label: 'Upload', icon: '⬆️', path: '/upload' },
    { label: 'Pagamento', icon: '💳', path: '/pagamento' }
  ]

  return (
    <nav>
      {menuItems.map(item => (
        <button key={item.path} onClick={() => onNavigate(item.path)}>
          {item.icon} {item.label}
        </button>
      ))}
    </nav>
  )
}
```

---

### PASSO 7: Adicionar Styles

```css
/* src/styles/videos.css */

.videos-page {
  padding: 32px 0;
}

.filtros {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filtro-input {
  padding: 10px 16px;
  border: 1px solid var(--borda);
  border-radius: var(--raio-md);
  background: var(--fundo-input);
  color: var(--texto);
  font-size: 0.95rem;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.video-card {
  background: var(--fundo-card);
  border: 1px solid var(--borda);
  border-radius: var(--raio-lg);
  overflow: hidden;
  transition: all 0.22s ease;
  cursor: pointer;
}

.video-card:hover {
  border-color: var(--acento);
  transform: translateY(-4px);
  box-shadow: var(--brilho-magenta);
}

.video-thumb {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.video-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duracao {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.video-info {
  padding: 16px;
}

.video-tema {
  font-size: 0.85rem;
  color: var(--acento);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.video-titulo {
  font-size: 1.1rem;
  color: var(--texto-branco);
  margin-bottom: 8px;
  line-height: 1.4;
}

.video-descricao {
  font-size: 0.9rem;
  color: var(--texto);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.btn-favorito,
.btn-play {
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.22s ease;
  font-size: 0.95rem;
}

.btn-favorito {
  background: transparent;
  border: 1px solid var(--borda);
  color: var(--texto);
}

.btn-favorito:hover,
.btn-favorito.ativo {
  border-color: var(--acento);
  color: var(--acento);
}

.btn-play {
  background: var(--acento);
  color: white;
  flex: 2;
}

.btn-play:hover {
  background: var(--acento-hover);
  box-shadow: var(--brilho-magenta);
  transform: translateY(-2px);
}

.sem-resultados {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--texto-fraco);
  padding: 32px;
}
```

---

## 📊 Fluxo Completo

```
User clica em "Vídeos" na Sidebar
      ↓
React Router navega para /videos
      ↓
Pages/Videos.jsx monta (useEffect)
      ↓
videosService.listarVideos(filtros)
      ↓
api.get('/videos/list?tema=...&modulo=...')
      ↓
Interceptador adiciona Bearer token
      ↓
GET http://localhost:8080/api/videos/list?...
      ↓
Spring Boot VideosController.listarVideos()
      ↓
VideoService consulta banco de dados
      ↓
Retorna JSON [ { id, titulo, thumb, ... }, ... ]
      ↓
api.js valida status (200? 401? 403?)
      ↓
videosService retorna array
      ↓
Videos.jsx: setVideos(dados)
      ↓
Component re-renderiza
      ↓
{videos.map(v => <VideoCard video={v} />)}
      ↓
User vê listagem de vídeos carregada ✅
      ↓
User clica em Favoritar
      ↓
VideoCard chama onFavorito={() => handleFavoritarVideo(id)}
      ↓
POST /api/videos/{id}/favoritar
      ↓
videosService.favoritarVideo(id)
      ↓
Spring Boot marca como favorito
      ↓
Videos.jsx atualiza estado local
      ↓
Card muda visualmente (star ⭐ fica ativa)
```

---

## ✅ Checklist de Implementação

- [ ] Backend: Criar endpoint `/api/videos/list`
- [ ] Backend: Criar endpoint `/api/videos/{id}`
- [ ] Backend: Criar endpoint `/api/videos/{id}/favoritar`
- [ ] Frontend: Criar `src/services/videosService.js`
- [ ] Frontend: Criar `src/pages/Videos.jsx`
- [ ] Frontend: Criar `src/components/VideoCard.jsx`
- [ ] Frontend: Registrar rota em `src/routes/router.jsx`
- [ ] Frontend: Adicionar menu item em `Layout.jsx`
- [ ] Frontend: Criar `src/styles/videos.css`
- [ ] Test: Testar fluxo end-to-end

---

## 🔄 Padrão Para Outro Service Qualquer

Agora que você entendeu todos os passos, basta repetir para outra funcionalidade:

1. **Backend (Spring):** Criar controller + service
2. **Frontend Service:** Criar `src/services/xxService.js`
3. **Frontend Page:** Criar `src/pages/Xx.jsx`
4. **Frontend Components:** Criar `src/components/XxCard.jsx`
5. **Router:** Registrar rota
6. **Menu:** Adicionar link
7. **Styles:** Adicionar CSS

**Tempo estimado:** 30 minutos por nova funcionalidade

---

## 🎯 Dicas Profissionais

1. **Reutilizar Components:** Se `VideoCard` serve, use em múltiplos lugares
2. **Compartilhar Lógica:** Se múltiplas páginas usam `videosService`, perfeito!
3. **Testes:** Mock `videosService` em testes de page
4. **Error Handling:** Sempre tratar erros em pages
5. **Loading States:** Sempre mostrar spinner enquanto carrega

---

**Pronto! Você tem um padrão completo para adicionar qualquer nova funcionalidade.** 🚀
