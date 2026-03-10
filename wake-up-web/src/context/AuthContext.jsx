/**
 * AuthContext.jsx - Contexto Global de Autenticação
 * 
 * Gerencia:
 * - Token JWT
 * - Funções de login/logout
 * - Persistência em localStorage
 * 
 * NOTE: O user object não é armazenado aqui.
 * Se precisar de dados do usuário, crie um endpoint /api/me
 */

import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Ao montar, restaura token salvo em localStorage
   */
  useEffect(() => {
    const storedAuth = authService.getStoredAuth()
    
    if (storedAuth?.token) {
      console.log('[AuthContext] Restaurando sessão do localStorage')
      setToken(storedAuth.token)
    }

    setLoading(false)
  }, [])

  /**
   * Login - Salva token
   */
  const login = (authToken) => {
    console.log('[AuthContext] Login realizado')
    setToken(authToken)
    authService.saveAuthData(authToken)
  }

  /**
   * Logout - Remove token
   */
  const logout = () => {
    console.log('[AuthContext] Logout')
    setToken(null)
    authService.logout()
  }

  return (
    <AuthContext.Provider value={{
      token,
      loading,
      isAuthenticated: !!token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
