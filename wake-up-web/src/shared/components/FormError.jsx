/**
 * FormError Component — Exibir erros da API
 */

export default function FormError({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="form-error" role="alert" aria-live="polite">
      <div className="form-error__content">
        <svg className="form-error__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="form-error__message">{error}</p>
      </div>
      {onDismiss && (
        <button
          className="form-error__close"
          onClick={onDismiss}
          aria-label="Fechar managem de erro"
        >
          ✕
        </button>
      )}
    </div>
  )
}
