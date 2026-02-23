/* ================================================================
   src/home/home.jsx — Componente React da View Home
   ================================================================
   As funções de negócio estão em script.js (carregado antes):
     buscarEstatisticasHome() → GET /api/home/estatisticas
     buscarRecursosHome()     → GET /api/home/recursos
     navegarPara(pagina)      → comunica com o react.jsx raiz
   ================================================================ */

const { useState, useEffect } = React;

function ViewHome() {

  /* ---- ESTADOS ---- */
  const [estatisticas, setEstatisticas] = useState(null);  /* dados do backend */
  const [recursos,     setRecursos]     = useState([]);     /* lista de recursos */
  const [carregando,   setCarregando]   = useState(true);   /* loading inicial */

  /* ---- CARREGA DADOS AO MONTAR ---- */
  useEffect(function() {
    async function iniciar() {
      try {
        /*
          Promise.all → executa as duas chamadas em paralelo.
          Mais rápido que sequencial (await um, depois await outro).
          Equivalente ao CompletableFuture.allOf() no Java.
        */
        var [stats, lista] = await Promise.all([
          buscarEstatisticasHome(),  /* função do script.js */
          buscarRecursosHome()       /* função do script.js */
        ]);
        setEstatisticas(stats);
        setRecursos(lista);
      } catch (erro) {
        console.error('[home.jsx] Erro ao carregar:', erro);
      } finally {
        setCarregando(false);
      }
    }
    iniciar();
  }, []); /* [] = executa só uma vez ao montar */

  /* Skeleton de loading enquanto busca dados */
  if (carregando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <span className="spinner" style={{ width: 24, height: 24, color: 'var(--acento)', borderTopColor: 'var(--acento)' }}></span>
      </div>
    );
  }

  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <div className="hero__conteudo">
          <div className="hero__tag">
            <span className="hero__dot"></span>
            Acorde. Evolua. Repita.
          </div>

          <h1 className="hero__titulo">
            Sua melhor<br />
            <span className="dim">manhã</span>
            <span className="glow">.</span>
          </h1>

          <p className="hero__desc">
            O Wake Up Now transforma sua rotina matinal em um ritual de
            produtividade com alarmes inteligentes e acompanhamento de sono.
          </p>

          <div className="hero__acoes">
            {/* navegarPara() está no script.js — comunica com o react.jsx raiz */}
            <button className="btn btn-primario btn-lg" onClick={function() { navegarPara('cadastro'); }}>
              Começar grátis →
            </button>
            <button className="btn btn-secundario btn-lg" onClick={function() { navegarPara('login'); }}>
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      {/* ---- BARRA DE ESTATÍSTICAS ---- */}
      {estatisticas && (
        <div className="stats-bar revelar">
          <div className="stat-item">
            <div className="stat-item__numero">{estatisticas.totalUsuarios}</div>
            <div className="stat-item__label">Usuários ativos</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__numero">{estatisticas.alarmesCriados}</div>
            <div className="stat-item__label">Alarmes criados</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__numero">{estatisticas.horasEconomizadas}h</div>
            <div className="stat-item__label">Horas recuperadas</div>
          </div>
          <div className="stat-item">
            <div className="stat-item__numero">⭐ {estatisticas.avaliacaoMedia}</div>
            <div className="stat-item__label">Avaliação média</div>
          </div>
        </div>
      )}

      {/* ---- RECURSOS ---- */}
      <section className="recursos">
        <div className="label-secao revelar">
          <span className="prefixo">//</span> recursos
        </div>
        <h2 className="secao-titulo revelar">Tudo que você precisa</h2>
        <p className="secao-sub revelar">para acordar diferente todos os dias.</p>

        <div className="recursos__grid">
          {recursos.map(function(r, i) {
            return (
              <div
                key={i}
                className="recurso-card revelar"
                style={{ transitionDelay: (i * 80) + 'ms' }}
              >
                <span className="recurso-card__icone">{r.icone}</span>
                <h3 className="recurso-card__titulo">{r.titulo}</h3>
                <p className="recurso-card__texto">{r.texto}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* Monta o componente no index.html desta view */
var raiz = ReactDOM.createRoot(document.getElementById('app-home'));
raiz.render(<ViewHome />);
