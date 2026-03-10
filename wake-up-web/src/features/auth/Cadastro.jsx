/**
 * Cadastro Page — Refatorada com novos componentes
 * 
 * Usa:
 * - Button component com loading state
 * - Input component com validação
 * - FormError component
 * - useForm hook
 * - useValidation hook
 * - useApi hook
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PasswordInput, FormError } from '../../shared/components'
import { useForm, useValidation, useApi } from '../../shared/hooks'
import authService from '../../services/authService'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const validators = useValidation()
  const { execute: signup } = useApi(authService.signup)
  const [apiError, setApiError] = useState('')



  const form = useForm(
    { name: '', email: '', password: '' },
    async (values) => {
      console.log('[Cadastro.onSubmit] Iniciando submissão com valores:', {
        name: values.name,
        email: values.email,
        password: '***'
      })
      try {
        setApiError('')
        console.log('[Cadastro.onSubmit] Chamando signup()...')
        const response = await signup({
          name: values.name,
          email: values.email,
          password: values.password
        })
        console.log('[Cadastro.onSubmit] Signup retornou, resposta:', response)
        // Cadastro bem-sucedido: redirecionar para login
        navigate('/login')
      } catch (error) {
        console.error('[Cadastro.onSubmit] Erro na submissão:', error)
        setApiError(error.message || 'Erro ao cadastrar')
      }
    },
    {
      name: validators.name,
      email: validators.email,
      password: validators.password
    }
  )

  // Verificar se há erros REAIS (não-vazios)
  const hasErrors = Object.values(form.errors).some(error => Boolean(error))

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="cadastro-header">
          <h1 className="cadastro-title">Criar Conta</h1>
          <p className="cadastro-subtitle">Junte-se à Wake Up Now</p>
        </div>

        <form onSubmit={form.handleSubmit} className="cadastro-form" noValidate>
          {apiError && (
            <FormError
              error={apiError}
              onDismiss={() => setApiError('')}
            />
          )}

          <Input
            label="Nome Completo"
            name="name"
            type="text"
            placeholder="Seu nome"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.touched.name ? form.errors.name : ''}
            required
            autoComplete="name"
          />

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
            autoComplete="new-password"
            helperText="Mínimo 8 caracteres"
          />

          <Button
            type="submit"
            disabled={hasErrors}
            loading={form.isSubmitting}
            fullWidth
          >
            Cadastrar
          </Button>
        </form>

        <div className="cadastro-footer">
          <p>
            Já tem conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="cadastro-link"
              aria-label="Ir para página de login"
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
