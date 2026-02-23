import { useRoutes } from 'react-router-dom'
import router from './routes/router'
import Layout from './components/layout/Layout'

/*
  APP.JSX — Componente Raiz

  Responsabilidade:
  - Configurar rotas da aplicação
  - Envolver com Layout global (Sidebar + Topbar + conteúdo)
  - Carregar Context Providers (Auth, etc)

  Analogia Spring Boot:
  - É como a classe @Configuration que configura beans globais
  - Análogo a um servlet raiz que carrega filtros/interceptadores

  NOTE: BrowserRouter está em main.jsx, aqui só configuramos as rotas
*/

export default function App() {
  const routes = useRoutes(router)

  return (
    <Layout>
      {routes}
    </Layout>
  )
}
