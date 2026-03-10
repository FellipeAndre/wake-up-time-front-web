/**
 * Login.jsx - Página de Login
 * 
 * Fluxo:
 * 1. Email + Senha → Backend validate
 * 2. Backend retorna JWT token
 * 3. Valida token com backend (GET /auth/validate)
 * 4. Se válido → salva no AuthContext + localStorage + redireciona para home
 * 5. Se usuário não existe (404) → redireciona para cadastro
 * 6. Se senha errada (401) → mostra erro
 */

import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import authService from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Mostrar mensagem de sucesso se veio do cadastro
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message)
      if (location.state?.email) {
        setEmail(location.state.email)
      }
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validação básica
      if (!email || !password) {
        setError('Email e senha são obrigatórios')
        setLoading(false)
        return
      }

      console.log('[Login] Tentando login com email:', email)

      // Tenta login com email + password
      const result = await authService.loginWithEmail(email, password)
      
      if (!result.token) {
        setError('Erro: Token não retornado pelo servidor')
        setLoading(false)
        return
      }

      console.log('[Login] Token recebido, validando com o backend...')

      // Valida token com o backend
      try {
        const isValid = await authService.validateToken(result.token)
        
        if (!isValid) {
          setError('Token inválido. Tente fazer login novamente.')
          setLoading(false)
          return
        }

        console.log('[Login] Token validado com sucesso')

      } catch (validationError) {
        console.error('[Login] Erro ao validar token:', validationError)
        setError('Erro ao validar token. Tente novamente.')
        setLoading(false)
        return
      }

      // Sucesso! Salva token no AuthContext e localStorage
      console.log('[Login] Salvando dados de autenticação...')
      authService.saveAuthData(result.token, result.user)
      login(result.token) // Atualiza AuthContext

      console.log('[Login] Login bem-sucedido, redirecionando para home...')
      
      // Redireciona para home com um pequeno delay
      setTimeout(() => {
        navigate('/')
      }, 500)

    } catch (err) {
      console.error('[Login] Erro:', err)

      // Se usuário não encontrado, redireciona para cadastro
      if (err.message?.includes('não encontrado')) {
        console.log('[Login] Usuário não encontrado, redirecionando para cadastro')
        navigate('/cadastro', { state: { prefilledData: { email } } })
      } else if (err.message?.includes('incorretos')) {
        setError('Email ou senha incorretos')
      } else {
        setError(err.message || 'Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo/Título */}
        <div style={styles.header}>
          <h1 style={styles.title}>Wake Up Now</h1>
          <p style={styles.subtitle}>Entre para continuar</p>
        </div>

        {/* Mensagem de Sucesso */}
        {success && (
          <div style={styles.successBox}>
            ✓ {success}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={loading}
              style={styles.input}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '30px' }}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              disabled={loading}
              style={styles.input}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Rodapé */}
        <div style={styles.footer}>
          <p>
            Não tem conta?{' '}
            <button
              onClick={() => navigate('/cadastro')}
              style={styles.link}
            >
              Crie uma aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0d0d0d',
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    border: '1px solid #3a3a3a',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#e5e5e5',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#8a8a8a',
    margin: '0'
  },
  successBox: {
    padding: '12px 16px',
    background: '#1a3a2a',
    border: '1px solid #4a9a6a',
    borderRadius: '6px',
    color: '#7fd69f',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  errorBox: {
    padding: '12px 16px',
    background: '#3a1a2a',
    border: '1px solid #9a4a6a',
    borderRadius: '6px',
    color: '#d07a9f',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#f5f5f5',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#2a2a2a',
    color: '#e5e5e5',
    border: '1px solid #3a3a3a',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#b0b0b0',
    color: '#0d0d0d',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    fontSize: '14px',
    color: '#8a8a8a'
  },
  link: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#b0b0b0',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    font: 'inherit'
  }
}
