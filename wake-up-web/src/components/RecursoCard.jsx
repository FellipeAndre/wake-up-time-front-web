/*
  components/RecursoCard.jsx — Componente: Card de Recurso

  Responsabilidade:
  - Renderizar um card de recurso individual
  - Reutilizável (será usado em loop)
  - Receber dados via props
  - Handlers opcionais (onClick, onHover)

  Props:
  - id: identificador único
  - icone: emoji ou ícone
  - titulo: nome do recurso
  - texto: descrição
  - onClick: callback opcional ao clicar

  Exemplo uso:
  ```jsx
  <RecursoCard
    id="1"
    icone="⏰"
    titulo="Alarmes Inteligentes"
    texto="Descrição..."
    onClick={() => alert('clicou')}
  />
  ```

  Padrão presentational:
  - Não faz fetch
  - Não tem estado complexo
  - Apenas renderiza e delega callbacks
*/

export default function RecursoCard({ id, icone, titulo, texto, onClick }) {
  return (
    <div
      className="recurso-card revelar"
      onClick={onClick}
      role="article"
      aria-label={titulo}
    >
      <span className="recurso-icone">{icone}</span>
      <h3 className="recurso-titulo">{titulo}</h3>
      <p className="recurso-texto">{texto}</p>
    </div>
  )
}
