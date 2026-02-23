import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './style.css'

/*
  ENTRY POINT DO VITE

  Responsabilidade:
  - Renderizar a aplicação React uma única vez na raiz do documento
  - Envolver com BrowserRouter (necessário para React Router)
  - Carregar CSS global

  Analogia Spring Boot:
  - É como a classe main() que inicia a aplicação
  - @SpringBootApplication

  Ordem: BrowserRouter → App → useRoutes
  (Router deve estar no topo da hierarquia)
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
