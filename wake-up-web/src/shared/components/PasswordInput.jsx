/**
 * PasswordInput Component — Input de senha com toggle de visibilidade
 * 
 * Features:
 * - Botão de olho para mostrar/esconder senha
 * - Tudo integrado ao Input base
 * - Acessibilidade com aria-labels
 */

import { useState } from 'react'
import Input from './Input'
import './PasswordInput.css'

export default function PasswordInput({
  label,
  name,
  placeholder = '••••••••',
  value = '',
  onChange,
  onBlur,
  error = '',
  disabled = false,
  required = false,
  helperText = '',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`password-input ${className}`.trim()}>
      <Input
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        disabled={disabled}
        required={required}
        helperText={helperText}
        className="password-input__field"
        {...props}
      />
      
      <button
        type="button"
        className="password-input__toggle"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
        aria-pressed={showPassword}
      >
        <span className="password-input__icon">
          {showPassword ? '◁' : '▷'}
        </span>
      </button>
    </div>
  )
}
