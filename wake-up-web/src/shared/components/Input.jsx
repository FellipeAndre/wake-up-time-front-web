/**
 * Input Component — Campo de entrada reutilizável
 * 
 * Features:
 * - Label associada
 * - Mensagem de erro
 * - State de loading
 * - Accessibility: aria-labels, aria-invalid, aria-describedby
 */

export default function Input({
  label,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  error = '',
  disabled = false,
  required = false,
  autoComplete = 'off',
  className = '',
  helperText = '',
  ...props
}) {
  const inputId = `input-${name}`
  const errorId = `error-${name}`
  const helperId = `helper-${name}`
  const hasError = Boolean(error)

  return (
    <div className={`input-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required" aria-label="obrigatório">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        className={`input ${hasError ? 'input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-label={label || placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        {...props}
      />

      {hasError && (
        <span id={errorId} className="input__error" role="alert">
          {error}
        </span>
      )}

      {helperText && !hasError && (
        <span id={helperId} className="input__helper">
          {helperText}
        </span>
      )}
    </div>
  )
}
