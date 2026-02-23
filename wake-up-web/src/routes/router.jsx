import Home from '../pages/Home'
import Login from '../pages/Login'
import Cadastro from '../pages/Cadastro'
import Upload from '../pages/Upload'

/*
  routes/router.jsx — Definição de Rotas

  Responsabilidade:
  - Mapear URLs para componentes (Pages)
  - Definir estrutura de navegação
  - Suportar rotas aninhadas (nested routes)

  Analogia Spring Boot:
  - É como @RequestMapping em controllers
  - Define os endpoints da aplicação

  Sintaxe React Router v6:
  ```
  {
    path: '/home',
    element: <Home />
  }
  ```

  Quando user acessa /home:
  1. Router detecta o path
  2. Renderiza o elemento <Home />
  3. Home.jsx carrega dados via homeService
  4. Componentes internos (Hero, StatsBar) recebem props
*/

const router = [
  {
    path: '/',
    element: <Home />,
    index: true // Rota padrão
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  {
    path: '/upload',
    element: <Upload />
  },
  {
    path: '*', // Rota 404
    element: <Home /> // Redirecionar para home
  }
]

export default router
