/**
 * GoogleOAuthButton - Botão de autenticação Google
 * Usa Google Identity Services (SDK do Google)
 */
import { useEffect, useRef } from 'react'

export default function GoogleOAuthButton({ onSuccess, onError, label = 'Continuar com Google' }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    // Carrega o script do Google se não estiver carregado
    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        initializeGoogle()
      }
    } else {
      initializeGoogle()
    }
  }, [])

  const initializeGoogle = () => {
    if (!window.google) return

    // Inicializa Google Sign-In
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse
    })

    // Renderiza o botão do Google
    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        theme: 'dark'
      })
    }
  }

  const handleGoogleResponse = async (response) => {
    try {
      if (!response.credential) {
        onError(new Error('Nenhuma credencial recebida do Google'))
        return
      }

      // Decodifica o JWT do Google para extrair dados
      const token = response.credential
      const payload = parseJwt(token)

      const userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: 'google',
        token: token
      }

      console.log('[GoogleOAuth] Usuário autenticado:', userData)
      onSuccess(userData)
    } catch (error) {
      console.error('[GoogleOAuth] Erro:', error)
      onError(error)
    }
  }

  // Decodifica JWT sem validar assinatura (seguro pois Google assinou)
  const parseJwt = (token) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  }

  return (
    <div
      ref={buttonRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}
    />
  )
}
