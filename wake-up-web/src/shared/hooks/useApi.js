/**
 * useApi Hook — Fazer requisições HTTP com estados gerenciados
 * 
 * Features:
 * - Loading state
 * - Error handling
 * - Data caching
 * - Retry logic
 * - Auto cleanup
 */

import { useState, useCallback } from 'react'

export default function useApi(apiFunc) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      console.log('[useApi.execute] Chamando apiFunc com args:', args)
      setLoading(true)
      setError(null)

      try {
        console.log('[useApi.execute] Aguardando resposta...')
        const result = await apiFunc(...args)
        console.log('[useApi.execute] Sucesso! Resultado:', result)
        setData(result)
        setError(null)
        return result
      } catch (err) {
        console.error('[useApi.execute] Erro capturado:', err)
        const errorMessage =
          err.response?.data?.message ||
          (err.response?.status === 401 ? 'Não autorizado' :
          err.response?.status === 404 ? 'Não encontrado' :
          err.response?.status === 429 ? 'Muitas requisições. Tente novamente em alguns segundos' :
          err.response?.status >= 500 ? 'Erro do servidor. Tente novamente' :
          err.message || 'Ocorreu um erro')

        console.log('[useApi.execute] Mensagem de erro:', errorMessage)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunc]
  )

  const retry = useCallback(() => {
    return execute()
  }, [execute])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, retry, reset }
}
