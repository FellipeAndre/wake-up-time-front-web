/* ================================================================
   src/home/script.js — Regras de Negócio da View Home
   ================================================================
   Responsável por TODA comunicação com o backend Spring Boot
   referente à view Home.

   Endpoints Spring Boot que este arquivo consome:
     GET /api/home/estatisticas → números gerais do app
     GET /api/home/recursos     → lista de funcionalidades

   COMO FUNCIONA:
   Este arquivo é carregado como <script src="script.js"> no index.html
   ANTES do home.jsx, tornando as funções disponíveis globalmente.
   O home.jsx chama essas funções nos seus useEffect/handlers.
   ================================================================ */

/* ----------------------------------------------------------------
   CONFIGURAÇÃO
   ---------------------------------------------------------------- */

/*
  URL base do backend.
  Altere para o endereço do seu Spring Boot conforme o ambiente.
  Em produção, use variável de ambiente ou config separada.
*/
var API_BASE = 'http://localhost:8080/api';

/*
  Monta o header de autorização com o token JWT salvo no browser.
  O Spring Boot valida este token via filtro (OncePerRequestFilter).

  Equivalente no Spring:
  @GetMapping("/home/estatisticas")
  public ResponseEntity<?> getEstatisticas(
    @RequestHeader("Authorization") String authHeader) { ... }
*/
function montarHeaders() {
  var token = localStorage.getItem('wun_token');
  return {
    'Content-Type':  'application/json',
    'Authorization': token ? 'Bearer ' + token : ''
  };
}

/* ================================================================
   FUNÇÃO: buscarEstatisticasHome
   ================================================================
   Busca os números de destaque para o painel da home.

   Endpoint Spring Boot:
   @RestController
   @RequestMapping("/api/home")
   public class HomeController {
     @GetMapping("/estatisticas")
     public ResponseEntity<EstatisticasDTO> getEstatisticas() {
       return ResponseEntity.ok(homeService.calcularEstatisticas());
     }
   }

   Retorna objeto com:
   { totalUsuarios, alarmesCriados, horasEconomizadas, avaliacaoMedia }
   ================================================================ */
async function buscarEstatisticasHome() {
  try {
    var resposta = await fetch(API_BASE + '/home/estatisticas', {
      method:  'GET',
      headers: montarHeaders()
    });

    if (!resposta.ok) throw new Error('Status ' + resposta.status);

    return await resposta.json();

  } catch (erro) {
    /*
      Se o backend não estiver disponível, retorna dados mockados
      para não travar a interface durante o desenvolvimento.
      REMOVA os mocks quando integrar com o Spring Boot real.
    */
    console.warn('[home/script.js] buscarEstatisticasHome → usando mock:', erro.message);
    return {
      totalUsuarios:      '12.487',
      alarmesCriados:     '89.312',
      horasEconomizadas:  '34.800',
      avaliacaoMedia:     '4.8'
    };
  }
}

/* ================================================================
   FUNÇÃO: buscarRecursosHome
   ================================================================
   Busca a lista de funcionalidades/recursos para exibir na home.

   Endpoint Spring Boot:
   @GetMapping("/recursos")
   public ResponseEntity<List<RecursoDTO>> getRecursos() {
     return ResponseEntity.ok(recursoService.listarAtivos());
   }
   ================================================================ */
async function buscarRecursosHome() {
  try {
    var resposta = await fetch(API_BASE + '/home/recursos', {
      method:  'GET',
      headers: montarHeaders()
    });

    if (!resposta.ok) throw new Error('Status ' + resposta.status);
    return await resposta.json();

  } catch (erro) {
    console.warn('[home/script.js] buscarRecursosHome → usando mock:', erro.message);
    return [
      { icone: '⏰', titulo: 'Alarme Inteligente',  texto: 'Múltiplos níveis de intensidade e análise do ciclo do sono para despertar no momento certo.' },
      { icone: '🚿', titulo: 'Rotina Matinal',       texto: 'Sequência personalizada de atividades matinais: hidratação, alongamento e banho frio.' },
      { icone: '📊', titulo: 'Dashboard de Progresso', texto: 'Gráficos e métricas detalhadas do seu padrão de sono e produtividade ao longo do tempo.' },
      { icone: '🔔', titulo: 'Notificações Smart',   texto: 'Lembretes inteligentes adaptados à sua rotina e horários de trabalho.' },
      { icone: '🤝', titulo: 'Comunidade',            texto: 'Desafios coletivos e rankings semanais para manter a motivação em alta.' },
      { icone: '🔗', titulo: 'Integrações',           texto: 'Conecte com Google Calendar, Apple Health e outros apps do seu ecossistema.' }
    ];
  }
}

/*
  Navega para outra view dentro do app principal.
  Usa window.parent.postMessage para comunicar com o react.jsx raiz,
  que controla qual view está sendo exibida no iframe.

  Equivalente a um redirect no Spring: return "redirect:/login"
*/
function navegarPara(pagina) {
  window.parent.postMessage({ tipo: 'IR_PARA', pagina: pagina }, '*');
}
