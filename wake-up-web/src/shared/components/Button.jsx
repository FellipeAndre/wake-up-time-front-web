/**
 * Button Component — Botão reutilizável
 * 
 * Variants: primary, secondary, danger, ghost
 * Sizes: sm, md, lg
 * Loading state suportado
 */

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const widthClass = fullWidth ? 'btn--full' : ''
  const disabledClass = disabled || loading ? 'btn--disabled' : ''

  const finalClass = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`.trim()

  return (
    <button
      type={type}
      className={finalClass}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner"></span>
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
