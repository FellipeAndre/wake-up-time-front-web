/**
 * AppleSignInButton - Botão de autenticação Apple
 * Usa Apple Sign-In SDK
 */
import { useEffect } from 'react'

export default function AppleSignInButton({ onSuccess, onError, label = 'Continuar com Apple' }) {
  useEffect(() => {
    // Carrega o script do Apple se não estiver carregado
    if (!window.AppleID) {
      const script = document.createElement('script')
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid.js'
      script.type = 'text/javascript'
      document.head.appendChild(script)

      script.onload = () => {
        initializeApple()
      }
    } else {
      initializeApple()
    }
  }, [])

  const initializeApple = () => {
    if (!window.AppleID) {
      console.error('[AppleSignIn] AppleID SDK não carregado')
      return
    }

    window.AppleID.auth.init({
      clientId: import.meta.env.VITE_APPLE_BUNDLE_ID,
      teamId: import.meta.env.VITE_APPLE_TEAM_ID,
      keyId: import.meta.env.VITE_APPLE_KEY_ID,
      redirectURI: window.location.origin,
      scope: 'email name',
      redirectMethod: 'form',
      usePopup: true
    })
  }

  const handleAppleSignIn = async () => {
    try {
      if (!window.AppleID) {
        onError(new Error('Apple Sign-In SDK não disponível'))
        return
      }

      const response = await window.AppleID.auth.signIn()

      if (!response || !response.authorization) {
        onError(new Error('Nenhuma resposta do Apple Sign-In'))
        return
      }

      const { user, authorization } = response
      const identityToken = authorization.id_token

      const userData = {
        email: user?.email || '',
        name: user?.name?.firstName + ' ' + user?.name?.lastName || 'Apple User',
        provider: 'apple',
        token: identityToken
      }

      console.log('[AppleSignIn] Usuário autenticado:', userData)
      onSuccess(userData)
    } catch (error) {
      console.error('[AppleSignIn] Erro:', error)
      onError(error)
    }
  }

  return (
    <button
      onClick={handleAppleSignIn}
      style={{
        width: '100%',
        padding: '12px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        background: '#000000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#1a1a1a'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#000000'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M16.365 1.43c1.423 0 2.605 1.092 2.605 2.556 0 1.512-.955 2.603-2.605 2.603-1.46 0-2.66-1.043-2.66-2.603 0-1.464 1.2-2.556 2.66-2.556zm.184 8.148h-4.596c-.868 0-1.657.79-1.657 1.656v8.815c0 .866.789 1.657 1.657 1.657h4.596c.867 0 1.656-.791 1.656-1.657v-8.815c0-.866-.789-1.656-1.656-1.656z" />
      </svg>
      {label}
    </button>
  )
}
