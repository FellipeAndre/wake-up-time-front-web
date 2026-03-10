/**
 * Cadastro.jsx - Página de Registro / Cadastro
 * 
 * Fluxo: Email + Senha + Nome → Backend Register
 * Resposta: JWT Token + User Data
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SignupForm from '../components/SignupForm'
import authService from '../services/authService'

export default function Cadastro() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')

  // Dados pré-preenchidos vindo do Login (se usuário tentou login e email não foi encontrado)
  const prefilledData = location.state?.prefilledData || {}

  const handleSuccess = (result) => {
    console.log('[Cadastro] Sucesso! Salvando dados e redirecionando para login...')
    
    // Salva token e usuário no localStorage
    authService.saveAuthData(result.token, result.user)
    
    // Redireciona para login com mensagem de sucesso
    setTimeout(() => {
      navigate('/login', { 
        state: { 
          message: 'Cadastro realizado com sucesso! Agora faça login com suas credenciais.',
          email: result.user?.email
        } 
      })
    }, 500)
  }

  const handleError = (error) => {
    console.error('[Cadastro] Erro de cadastro:', error)
    setFormError(error)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / Título */}
        <div style={styles.header}>
          <h1 style={styles.title}>Wake Up Now</h1>
          <p style={styles.subtitle}>Crie sua conta e comece agora</p>
        </div>

        {/* Erro geral */}
        {formError && (
          <div style={styles.errorBox}>
            ⚠️ {formError}
          </div>
        )}

        {/* Signup Form */}
        <SignupForm
          initialData={prefilledData}
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Já tem conta? */}
        <div style={styles.footer}>
          <p>
            Já tem conta?{' '}
            <button
              onClick={() => navigate('/login')}
              style={styles.link}
            >
              Faça login aqui
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
    marginBottom: '30px'
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
  errorBox: {
    padding: '12px 16px',
    background: '#2a2a2a',
    border: '1px solid #8a8a8a',
    borderRadius: '6px',
    color: '#d0d0d0',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center'
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
