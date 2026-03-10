/**
 * Upload Feature — Página de upload refatorada
 */

import { useState } from 'react'
import { Button, FormError } from '../../shared/components'
import { useApi } from '../../shared/hooks'
import './Upload.css'

export default function Upload() {
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const { execute: uploadVideo, loading } = useApi(() => Promise.resolve())

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
    if (!validTypes.includes(file.type)) {
      setError('Tipo de arquivo inválido. Use MP4, WebM ou OGG.')
      return
    }

    // Validar tamanho (máx 500MB)
    if (file.size > 500 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 500MB.')
      return
    }

    setError('')
    setUploadedFile({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type
    })
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      setError('Selecione um arquivo para enviar')
      return
    }

    try {
      await uploadVideo()
      setUploadedFile(null)
    } catch (err) {
      setError('Erro ao enviar arquivo')
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1 className="upload-title">Upload de Vídeos</h1>
        <p className="upload-subtitle">Envie seus vídeos para a plataforma</p>

        {error && (
          <FormError
            error={error}
            onDismiss={() => setError('')}
          />
        )}

        <div className="upload-dropzone">
          <input
            type="file"
            id="file-input"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleFileChange}
            className="upload-input"
            aria-label="Selecione arquivo de vídeo"
          />
          
          <label htmlFor="file-input" className="upload-label">
            <span className="upload-icon">☆</span>
            <span className="upload-text">
              {uploadedFile ? uploadedFile.name : 'Clique ou arraste um arquivo'}
            </span>
            {uploadedFile && (
              <span className="upload-size">{uploadedFile.size} MB</span>
            )}
          </label>
        </div>

        {uploadedFile && (
          <Button
            onClick={handleUpload}
            loading={loading}
            fullWidth
          >
            Enviar Vídeo
          </Button>
        )}
      </div>
    </div>
  )
}
