import { useNavigate } from 'react-router-dom'

/*
  components/layout/Layout.jsx — HOC: Layout Global

  Responsabilidade:
  - Renderizar estrutura comum (Sidebar + Topbar)
  - Renderizar area de conteúdo (children)
  - Disponibilizar em todas as páginas
*/

export default function Layout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="app-container">
      {/* SIDEBAR — Navegação lateral (lado direito com flex-direction: row-reverse) */}
      <Sidebar onNavigate={navigate} />

      {/* CONTENT — Área principal (esquerda) */}
      <main className="main-content">
        {/* TOPBAR — Barra superior (temporariamente oculta) */}
        {/* <Topbar /> */}

        {/* CONTEÚDO DA PÁGINA — Injeta children aqui */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}

/*
  ═══════════════════════════════════════════════════════════
  SIDEBAR — Navegação Lateral
  ═══════════════════════════════════════════════════════════
*/
function Sidebar({ onNavigate }) {
  const menuItems = [
    { label: 'Home', icon: '■', path: '/home' },
    { label: 'Vídeos', icon: '▶', path: '/videos' },
    { label: 'Upload', icon: '▲', path: '/upload' },
    { label: 'Pagamento', icon: '◆', path: '/pagamento' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Wake Up Now</h1>
        <p>Desperte seu potencial</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className="nav-item"
            onClick={() => onNavigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem('wun_token')
            onNavigate('/login')
          }}
        >
          Sair
        </button>
      </div>
    </aside>
  )
}

/*
  ═══════════════════════════════════════════════════════════
  TOPBAR — Barra Superior
  ═══════════════════════════════════════════════════════════
*/
function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <h2 className="page-title">Wake Up Now</h2>
        <div className="topbar-actions">
          {/* Componentes da topbar: notificações, perfil, etc */}
        </div>
      </div>
    </header>
  )
}
