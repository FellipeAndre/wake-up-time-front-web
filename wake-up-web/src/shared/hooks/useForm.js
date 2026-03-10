/**
 * useForm Hook — Gerenciar estado e validação de formulários
 * 
 * Features:
 * - Gerenciar valores dos campos
 * - Validação ao perder foco
 * - Suporte a múltiplos validadores
 * - Reset de form
 * - handleChange otimizado
 */

import { useState, useCallback } from 'react'

export default function useForm(initialValues = {}, onSubmit, validators = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validar campo individual
  const validateField = useCallback((name, value) => {
    if (!validators[name]) return ''

    const validator = validators[name]
    if (typeof validator === 'function') {
      return validator(value) || ''
    }

    return ''
  }, [validators])

  // Handle change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    console.log('[useForm.handleChange]', name, ':', newValue)

    setValues((prev) => ({
      ...prev,
      [name]: newValue
    }))

    // Validar ao digitar se já foi tocado
    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }))
    }
  }, [touched, validateField])

  // Handle blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target

    console.log('[useForm.handleBlur]', name, ':', value)

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }))
  }, [validateField])

  // Handle submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      console.log('[useForm.handleSubmit] Validando valores:', values)

      // Validar todos os campos
      const newErrors = {}
      Object.keys(validators).forEach((name) => {
        const error = validateField(name, values[name])
        if (error) newErrors[name] = error
      })

      console.log('[useForm.handleSubmit] Erros de validação:', newErrors)
      setErrors(newErrors)

      // Se houver erros, não submeter
      if (Object.keys(newErrors).length > 0) {
        console.log('[useForm.handleSubmit] Validação falhou, não submeter')
        return
      }

      console.log('[useForm.handleSubmit] Validação passou, chamando onSubmit()')
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validators, validateField, onSubmit]
  )

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Set field value (útil para reset de campos específicos)
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Set field error (útil para erros da API)
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError
  }
}
