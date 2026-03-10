/**
 * ForgotPassword Page — Recuperar Senha
 * 
 * Fluxo:
 * 1. Usuário insere email
 * 2. Clica em "Enviar Link"
 * 3. Backend envia email com link de reset
 * 4. Usuário recebe email com link
 * 5. Link leva para ResetPassword (com token na URL)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, FormError } from '../../shared/components'
import { useForm, useValidation, useApi } from '../../shared/hooks'
import authService from '../../services/authService'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const validators = useValidation()
  const { execute: requestReset } = useApi(authService.requestPasswordReset)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm(
    { email: '' },
    async (values) => {
      console.log('[ForgotPassword.onSubmit] Iniciando reset de senha para:', values.email)
      try {
        setApiError('')
        setSuccessMessage('')
        console.log('[ForgotPassword.onSubmit] Chamando requestPasswordReset()...')
        
        const response = await requestReset(values.email)
        
        console.log('[ForgotPassword.onSubmit] Email enviado com sucesso')
        setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
        form.reset()
      } catch (error) {
        console.error('[ForgotPassword.onSubmit] Erro ao solicitar reset:', error)
        setApiError(error.message || 'Erro ao enviar email')
      }
    },
    {
      email: validators.email
    }
  )

  // Verificar se há erros REAIS (não-vazios)
  const hasErrors = Object.values(form.errors).some(error => Boolean(error))

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1 className="forgot-password-title">Recuperar Senha</h1>
          <p className="forgot-password-subtitle">
            Insira seu email para receber um link de recuperação
          </p>
        </div>

        <form onSubmit={form.handleSubmit} className="forgot-password-form" noValidate>
          {apiError && (
            <FormError
              error={apiError}
              onDismiss={() => setApiError('')}
            />
          )}

          {successMessage && (
            <div className="forgot-password-success">
              <p>{successMessage}</p>
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.email ? form.errors.email : ''}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            disabled={hasErrors}
            loading={form.isSubmitting}
            fullWidth
          >
            Enviar Link de Recuperação
          </Button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Lembrou sua senha?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="forgot-password-link"
              aria-label="Voltar para login"
            >
              Volte para login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
