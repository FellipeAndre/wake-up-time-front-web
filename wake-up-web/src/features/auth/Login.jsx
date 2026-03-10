/**
 * Login Page — Refatorada com novos componentes
 * 
 * Usa:
 * - Button component com loading state
 * - Input component com validação
 * - FormError component
 * - useForm hook para gerenciar estado
 * - useValidation hook para validadores
 * - useApi hook para requisições
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PasswordInput, FormError } from '../../shared/components'
import { useForm, useValidation, useApi } from '../../shared/hooks'
import authService from '../../services/authService'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const validators = useValidation()
  const { execute: login } = useApi(authService.loginWithEmail)
  const [apiError, setApiError] = useState('')

  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      console.log('[Login.onSubmit] Iniciando submissão com valores:', {
        email: values.email,
        password: '***'
      })
      try {
        setApiError('')
        console.log('[Login.onSubmit] Chamando login()...')
        const response = await login(values.email, values.password)
        console.log('[Login.onSubmit] Login bem-sucedido, resposta:', response)
        // Response contém { token: "jwt..." }
        authService.saveAuthData(response.token)
        console.log('[Login.onSubmit] Token salvo, redirecionando para /home')
        navigate('/home')
      } catch (error) {
        console.error('[Login.onSubmit] Erro na submissão:', error)
        setApiError(error.message || 'Erro ao fazer login')
      }
    },
    {
      email: validators.email,
      password: validators.password
    }
  )

  // Verificar se há erros REAIS (não-vazios)
  const hasErrors = Object.values(form.errors).some(error => Boolean(error))

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Wake Up Now</h1>
          <p className="login-subtitle">Desperte seu potencial</p>
        </div>

        <form onSubmit={form.handleSubmit} className="login-form" noValidate>
          {apiError && (
            <FormError
              error={apiError}
              onDismiss={() => setApiError('')}
            />
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

          <PasswordInput
            label="Senha"
            name="password"
            placeholder="••••••••"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.password ? form.errors.password : ''}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            disabled={hasErrors}
            loading={form.isSubmitting}
            fullWidth
          >
            Entrar
          </Button>
        </form>

        <div className="login-footer">
          <p>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="login-link"
              aria-label="Recuperar senha"
            >
              Esqueci minha senha
            </button>
          </p>
          <p>
            Não tem conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/cadastro')}
              className="login-link"
              aria-label="Ir para página de cadastro"
            >
              Cadastre-se aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
