/**
 * Validation Utilities — Funções úteis de validação
 */

/**
 * Validar formato de email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validar força de senha
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'weak', score: 0 }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

  const strengths = ['weak', 'fair', 'good', 'strong', 'very-strong']
  return {
    strength: strengths[score],
    score,
    percentage: (score / 4) * 100
  }
}

/**
 * Validar CPF (básico)
 */
export const isValidCPF = (cpf) => {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11) return false
  if (/^(\d)\1{10}$/.test(clean)) return false // Todos os dígitos iguais
  return true
}

/**
 * Validar comprimento mínimo
 */
export const hasMinLength = (value, min) => {
  return value && value.length >= min
}

/**
 * Validar comprimento máximo
 */
export const hasMaxLength = (value, max) => {
  return !value || value.length <= max
}

/**
 * Validar campo obrigatório
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return Boolean(value)
}

/**
 * Validar URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validar número de telefone (formato brasileiro)
 */
export const isValidBRPhone = (phone) => {
  const clean = phone.replace(/\D/g, '')
  return clean.length === 10 || clean.length === 11
}
