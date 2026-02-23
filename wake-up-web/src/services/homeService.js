import api from './api'

/*
  services/homeService.js — Serviço de Lógica de Home

  Responsabilidade:
  - Chamar endpoints específicos de Home no backend
  - Transformar dados recebidos (se necessário)
  - Tratar erros específicos da home
  - Fornecer interface pública (exported functions)

  Analogia Spring Boot:
  - é como uma classe anotada com @Service
  - Exemplo:
    ```java
    @Service
    public class HomeService {
      @Autowired
      private HomeRepository repo;

      public Stats getEstatisticas() {
        return repo.findStats();
      }
    }
    ```

  Neste padrão:
  - homeService.getEstatisticas() ≈ homeRepository.findStats()
  - api.get() ≈ HTTP/REST chamando o endpoint real

  Endpoints Spring Boot esperados:
  - GET /api/home/estatisticas → { totalUsuarios, alarmes, horas, etc }
  - GET /api/home/recursos → [ { icone, titulo, texto }, ... ]
*/

const homeService = {
  /*
    Busca estatísticas gerais da home
    
    Requisição: GET /api/home/estatisticas
    
    ANTES (script.js global):
    ```javascript
    var API_BASE = 'http://localhost:8080/api';
    function buscarEstatisticasHome() {
      return fetch(API_BASE + '/home/estatisticas', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(r => r.json());
    }
    ```

    DEPOIS (service modular):
    ```javascript
    homeService.getEstatisticas().then(stats => console.log(stats))
    ```

    Vantagens:
    - Não precisa montar headers manualmente
    - Token adicionado automaticamente via interceptador
    - Base URL centralizada
    - Tratamento de erro global
  */
  async getEstatisticas() {
    try {
      const { data } = await api.get('/home/estatisticas')
      
      // Opcionalmente, transformar dados aqui
      return {
        totalUsuarios: data?.totalUsuarios || 0,
        alarmesCriados: data?.alarmesCriados || 0,
        horasEconomizadas: data?.horasEconomizadas || 0,
        avaliacaoMedia: data?.avaliacaoMedia || 0
      }
    } catch (error) {
      console.error('[homeService.getEstatisticas]', error.message)
      throw error // Re-lançar para a página tratar
    }
  },

  /*
    Busca lista de recursos/funcionalidades
    
    Requisição: GET /api/home/recursos
    
    Retorno esperado:
    [
      {
        id: '1',
        icone: '⏰',
        titulo: 'Alarmes Inteligentes',
        texto: 'Descrição...'
      },
      ...
    ]
  */
  async getRecursos() {
    try {
      const { data } = await api.get('/home/recursos')
      
      // Validar array
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('[homeService.getRecursos]', error.message)
      return [] // Retornar array vazio em caso de erro
    }
  }
}

export default homeService
