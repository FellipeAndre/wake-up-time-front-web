/**
 * ProtectedRoute.jsx - Componente para proteger rotas autenticadas
 * 
 * Verifica se usuário tem token válido antes de permitir acesso
 * Se não tiver token, redireciona para login
 */

import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext)

  // Enquanto carrega, mostra loading
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0d0d0d'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#b0b0b0'
        }}>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não tem token, redireciona para login
  if (!token) {
    console.log('[ProtectedRoute] Sem token válido, redirecionando para login')
    return <Navigate to="/login" replace />
  }

  // Se tem token, renderiza o componente
  return children
}
