/**
 * SignupForm - Formulário de cadastro para novos usuários
 * Apenas email/nome/senha (sem OAuth, sem CPF)
 */
import { useState } from 'react'
import authService from '../services/authService'

export default function SignupForm({ initialData = {}, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: initialData.email || '',
    name: initialData.name || '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme a senha'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const result = await authService.signup({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      console.log('[SignupForm] Cadastro bem-sucedido')
      onSuccess(result)
    } catch (error) {
      console.error('[SignupForm] Erro:', error)
      onError(error.message || 'Erro ao cadastrar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#f5f5f5',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!!initialData.email}
          placeholder="seu@email.com"
          style={{
            width: '100%',
            padding: '12px',
            background: initialData.email ? '#0d0d0d' : '#2a2a2a',
            color: '#e5e5e5',
            border: errors.email ? '2px solid #8a8a8a' : '1px solid #3a3a3a',
            borderRadius: '8px',
            fontSize: '1rem',
            opacity: initialData.email ? 0.6 : 1,
            cursor: initialData.email ? 'not-allowed' : 'text'
          }}
        />
        {errors.email && (
          <span style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
            {errors.email}
          </span>
        )}
      </div>

      {/* Nome */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#f5f5f5',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          Nome Completo
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome completo"
          style={{
            width: '100%',
            padding: '12px',
            background: '#2a2a2a',
            color: '#e5e5e5',
            border: errors.name ? '2px solid #8a8a8a' : '1px solid #3a3a3a',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        {errors.name && (
          <span style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
            {errors.name}
          </span>
        )}
      </div>

      {/* Senha */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#f5f5f5',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          Senha
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          style={{
            width: '100%',
            padding: '12px',
            background: '#2a2a2a',
            color: '#e5e5e5',
            border: errors.password ? '2px solid #8a8a8a' : '1px solid #3a3a3a',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        {errors.password && (
          <span style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
            {errors.password}
          </span>
        )}
      </div>

      {/* Confirmar Senha */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#f5f5f5',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          Confirmar Senha
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repita a senha"
          style={{
            width: '100%',
            padding: '12px',
            background: '#2a2a2a',
            color: '#e5e5e5',
            border: errors.confirmPassword ? '2px solid #8a8a8a' : '1px solid #3a3a3a',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        {errors.confirmPassword && (
          <span style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#7a7a7a' : '#b0b0b0',
          color: '#0d0d0d',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Cadastrando...' : 'Criar Conta'}
      </button>
    </form>
  )
}
