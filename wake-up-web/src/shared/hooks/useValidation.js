/**
 * useValidation Hook — Validadores reutilizáveis
 * 
 * Fornece validadores prontos:
 * - Email
 * - Senha (força)
 * - CPF
 * - Campo obrigatório
 * - Comprimento mínimo/máximo
 * - Regex customizado
 */

import { useCallback } from 'react'

export default function useValidation() {
  const validators = {
    // Email validation
    email: useCallback((value) => {
      if (!value) return 'Email é obrigatório'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return 'Email inválido'
      return ''
    }, []),

    // Password validation (pelo menos 8 caracteres)
    password: useCallback((value) => {
      if (!value) return 'Senha é obrigatória'
      if (value.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
      return ''
    }, []),

    // Strong password (8+ chars, uppercase, number, special)
    strongPassword: useCallback((value) => {
      if (!value) return 'Senha é obrigatória'
      if (value.length < 8) return 'Senha deve ter pelo menos 8 caracteres'
      if (!/[A-Z]/.test(value)) return 'Senha deve conter letra maiúscula'
      if (!/[0-9]/.test(value)) return 'Senha deve conter número'
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Senha deve conter caractere especial'
      return ''
    }, []),

    // Required field
    required: useCallback((value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Este campo é obrigatório'
      }
      return ''
    }, []),

    // Min length
    minLength: (min) => (value) => {
      if (!value) return `Mínimo de ${min} caracteres`
      if (value.length < min) return `Mínimo de ${min} caracteres`
      return ''
    },

    // Max length
    maxLength: (max) => (value) => {
      if (!value) return ''
      if (value.length > max) return `Máximo de ${max} caracteres`
      return ''
    },

    // CPF validation
    cpf: useCallback((value) => {
      if (!value) return 'CPF é obrigatório'
      const cpf = value.replace(/\D/g, '')
      if (cpf.length !== 11) return 'CPF inválido'
      // Validação básica (pode ser expandida)
      return ''
    }, []),

    // Name validation
    name: useCallback((value) => {
      if (!value) return 'Nome é obrigatório'
      if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
      return ''
    }, []),

    // Match field
    match: (fieldNameToMatch, fieldValue) => (value) => {
      if (value !== fieldValue) {
        return `Não corresponde ao campo ${fieldNameToMatch}`
      }
      return ''
    }
  }

  return validators
}
