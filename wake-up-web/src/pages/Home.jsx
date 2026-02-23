import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import homeService from '../services/homeService'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import RecursoCard from '../components/RecursoCard'

/*
  pages/Home.jsx — Page Component (Orquestrador)

  Responsabilidade:
  - Gerenciar estado da página
  - Chamar services para buscar dados
  - Tratar erros
  - Renderizar componentes menores (presentational)
  - Navegar para outras páginas

  Analogia Spring Boot:
  - É como um @RestController
  - Recebe "requisição" (user acessa /home)
  - Chama @Service (homeService)
  - Retorna resposta (renderiza componentes)
*/

/*
  ═════════════════════════════════════════════════════════════

  COMPARAÇÃO: ANTES vs DEPOIS

  ❌ ANTES (script.js global):
  ```javascript
  const { useState, useEffect } = React;
  function ViewHome() {
    const [stats, setStats] = useState(null);
    
    useEffect(function() {
      buscarEstatisticasHome()  // Função global
        .then(setStats)
        .catch(erro => console.error(erro));
    }, []);

    return (
      <section>
        <h1>Home</h1>
        { Renderizar tudo aqui mesmo, sem componentes }
      </section>
    );
  }
    */

  var raiz = ReactDOM.createRoot(document.getElementById('app-home'));
  raiz.render(<ViewHome />);

  /*
  ```

  PROBLEMAS:
  - Função global buscarEstatisticasHome() em escopo global
  - ReactDOM.createRoot espalhado em múltiplos arquivos
  - Sem React Router — navegação manual
  - Difícil de testar e reutilizar
  - Sem separação clara de responsabilidades

  ───────────────────────────────────────────────────────────

  ✅ DEPOIS (pages/Home.jsx modular):
  ```javascript
  */

  export default function Home() {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      homeService.getEstatisticas()  // Service importado
        .then(setStats)
        .catch(handleError);
    }, []);

    return (
      <>
        <Hero onEspecificarClique={() => navigate('/cadastro')} />
        <StatsBar dados={stats} />
      </>
    );
  }
    /*
  ```

  VANTAGENS:
  - homeService é módulo, não global
  - Componente isolado e reutilizável
  - React Router cuida da navegação
  - Fácil testar: mock homeService
  - Separação clara: Page orquestra, Components renderizam

  ═════════════════════════════════════════════════════════════
*/

export default function Home() {
  // ESTADOS
  const [estatisticas, setEstatisticas] = useState(null)
  const [recursos, setRecursos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // NAVEGAÇÃO
  const navigate = useNavigate()

  /*
    LIFECYCLE: Executado uma vez ao montar o componente
    
    Equivalente em Spring Boot:
    ```java
    @PostConstruct
    public void init() {
      loadData();
    }
    ```

    O que acontece:
    1. Componente monta
    2. useEffect executa cada função async em paralelo (Promise.all)
    3. await retorna dados
    4. setState atualiza o DOM
    5. Componentes filhos recebem dados via props
  */
  useEffect(() => {
    async function carregarDados() {
      try {
        // Promise.all executa ao MESMO TEMPO (mais rápido)
        // Análogo a CompletableFuture.allOf() no Java
        const [stats, lista] = await Promise.all([
          homeService.getEstatisticas(),
          homeService.getRecursos()
        ])

        setEstatisticas(stats)
        setRecursos(lista)
      } catch (erro) {
        // Tratar erro
        console.error('[Home.jsx] Erro ao carregar:', erro.message)
        setErro('Não foi possível carregar dados. Tente novamente.')
      } finally {
        // Sempre executado (loading ou sucesso/erro)
        setCarregando(false)
      }
    }

    carregarDados()
  }, []) // [] = executa só uma vez (ao montar)

  // HANDLERS
  const handleEspecificarConta = () => {
    navigate('/cadastro')
  }

  const handleLoginConta = () => {
    navigate('/login')
  }

  // SKELETON: Mostra While carregando
  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  // ERRO: Mostra mensagem se requisição falhar
  if (erro) {
    return (
      <div className="error-container">
        <h2>Oops! Algo deu errado</h2>
        <p>{erro}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  // ═══ RENDERIZAÇÃO NORMAL ═══
  // Cada componente abaixo é PRESENTATIONAL
  // Não fazem fetch, apenas recebem dados via props

  return (
    <>
      {/* Seção Hero — chamada estética de ação */}
      <Hero
        onEspecificar={handleEspecificarConta}
        onLogin={handleLoginConta}
      />

      {/* Barra de Estatísticas */}
      {estatisticas && (
        <StatsBar dados={estatisticas} />
      )}

      {/* Grid de Recursos/Funcionalidades */}
      <section className="recursos-section">
        <div className="container">
          <h2>Recursos Disponíveis</h2>
          <div className="recursos-grid">
            {recursos.length > 0 ? (
              recursos.map((recurso) => (
                <RecursoCard
                  key={recurso.id}
                  icone={recurso.icone}
                  titulo={recurso.titulo}
                  texto={recurso.texto}
                />
              ))
            ) : (
              <p className="text-center">Nenhum recurso disponível.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
