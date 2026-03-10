/**
 * ResetPassword Page — Alterar Senha via Token
 * 
 * Fluxo:
 * 1. Usuário clica no link do email
 * 2. URL tem token como QueryParam: /reset-password?token=xxxxx
 * 3. Insere nova senha
 * 4. Clica em "Alterar Senha"
 * 5. Backend valida token e atualiza senha
 * 6. Redireciona para login
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, PasswordInput, FormError } from '../../shared/components'
import { useForm, useValidation, useApi } from '../../shared/hooks'
import authService from '../../services/authService'
import './ResetPassword.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const validators = useValidation()
  const { execute: resetPassword } = useApi(authService.resetPassword)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isValidToken, setIsValidToken] = useState(true)

  // Extrair token da URL
  const token = searchParams.get('token')

  useEffect(() => {
    console.log('[ResetPassword] Component mounted, token:', token ? 'token encontrado' : 'SEM TOKEN')
    
    if (!token) {
      console.error('[ResetPassword] Erro: token não encontrado na URL')
      setIsValidToken(false)
      setApiError('Link de recuperação inválido ou expirado. Tente solicitar um novo link.')
    }
  }, [token])

  const form = useForm(
    { password: '', confirmPassword: '' },
    async (values) => {
      console.log('[ResetPassword.onSubmit] Iniciando reset de senha')
      
      if (values.password !== values.confirmPassword) {
        setApiError('As senhas não conferem')
        return
      }

      try {
        setApiError('')
        setSuccessMessage('')
        console.log('[ResetPassword.onSubmit] Chamando resetPassword()...')
        
        const response = await resetPassword(token, values.password)
        
        console.log('[ResetPassword.onSubmit] Senha alterada com sucesso')
        setSuccessMessage('Senha alterada com sucesso! Redirecionando para login...')
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } catch (error) {
        console.error('[ResetPassword.onSubmit] Erro ao resetar senha:', error)
        setApiError(error.message || 'Erro ao alterar senha')
      }
    },
    {
      password: validators.password,
      confirmPassword: (value) => {
        if (!value) return 'Confirme sua senha'
        return ''
      }
    }
  )

  // Verificar se há erros REAIS (não-vazios)
  const hasErrors = Object.values(form.errors).some(error => Boolean(error))

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1 className="reset-password-title">Alterar Senha</h1>
          <p className="reset-password-subtitle">
            Insira sua nova senha
          </p>
        </div>

        {!isValidToken ? (
          <div className="reset-password-error">
            <FormError
              error={apiError}
              onDismiss={() => navigate('/forgot-password')}
            />
            <Button
              onClick={() => navigate('/forgot-password')}
              variant="secondary"
              fullWidth
            >
              Solicitar Novo Link
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={form.handleSubmit} className="reset-password-form" noValidate>
              {apiError && (
                <FormError
                  error={apiError}
                  onDismiss={() => setApiError('')}
                />
              )}

              {successMessage && (
                <div className="reset-password-success">
                  <p>{successMessage}</p>
                </div>
              )}

              <PasswordInput
                label="Nova Senha"
                name="password"
                placeholder="••••••••"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.password ? form.errors.password : ''}
                required
                autoComplete="new-password"
                helperText="Mínimo 8 caracteres"
              />

              <PasswordInput
                label="Confirmar Senha"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.confirmPassword ? form.errors.confirmPassword : ''}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                disabled={hasErrors}
                loading={form.isSubmitting}
                fullWidth
              >
                Alterar Senha
              </Button>
            </form>

            <div className="reset-password-footer">
              <p>
                Lembrou sua senha?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="reset-password-link"
                  aria-label="Voltar para login"
                >
                  Volte para login
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
