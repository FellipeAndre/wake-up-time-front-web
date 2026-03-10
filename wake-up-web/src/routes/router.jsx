import Home from '../features/home/Home'
import { Login, Cadastro, ForgotPassword, ResetPassword } from '../features/auth'
import Upload from '../features/upload/Upload'
import ProtectedRoute from '../components/ProtectedRoute'

/*
  routes/router.jsx — Definição de Rotas

  Responsabilidade:
  - Mapear URLs para componentes (Pages)
  - Definir estrutura de navegação
  - Proteger rotas que exigem autenticação com ProtectedRoute
  - Suportar rotas aninhadas (nested routes)

  Analogia Spring Boot:
  - É como @RequestMapping + @RequireAuth em controllers
  - Define os endpoints e autorização da aplicação

  Sintaxe React Router v6:
  ```
  {
    path: '/home',
    element: <Home />
  }
  ```

  Rotas Protegidas:
  ```
  {
    path: '/upload',
    element: <ProtectedRoute><Upload /></ProtectedRoute>
  }
  ```

  Quando user não autenticado tenta acessar rota protegida:
  1. ProtectedRoute detecta falta de token
  2. Redireciona para /login
  3. User faz login → volta para página solicitada
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
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/upload',
    element: <ProtectedRoute><Upload /></ProtectedRoute>
  },
  {
    path: '*', // Rota 404
    element: <Home /> // Redirecionar para home
  }
]

export default router
