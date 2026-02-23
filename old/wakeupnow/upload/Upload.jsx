import React, { useState } from 'react';

/**
 * COMPONENTE: Upload
 * 
 * Responsabilidade:
 * - Interface de upload de vídeos
 * - Apenas para administradores
 * - Arrastar e soltar (drag & drop)
 * - Pré-visualização
 * - Formulário de metadados
 * - Progresso de upload
 */

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    theme: '',
    duration: '',
    thumbnail: null
  });
  const [uploadedVideos, setUploadedVideos] = useState([
    { id: 1, title: 'Como acordar cedo', theme: 'Rotina', uploadedAt: '2024-01-15' },
    { id: 2, title: 'Meditação Matinal', theme: 'Bem-estar', uploadedAt: '2024-01-14' }
  ]);

  const themes = ['Rotina', 'Bem-estar', 'Fitness', 'Saúde', 'Outro'];

  // Validar se usuário é admin
  const isAdmin = window.AuthState && window.AuthState.isAdmin();

  if (!isAdmin) {
    return (
      <div className="view active" style={{padding: '40px', textAlign: 'center'}}>
        <h2>🔒 Acesso Restrito</h2>
        <p>Apenas administradores podem acessar esta área.</p>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecione um arquivo de vídeo');
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecione um arquivo de vídeo');
    }
  };

  const handleFormChange = (field, value) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!selectedFile) {
      alert('Selecione um arquivo de vídeo');
      return false;
    }
    if (!uploadForm.title.trim()) {
      alert('Digite o título do vídeo');
      return false;
    }
    if (!uploadForm.theme) {
      alert('Selecione um tema');
      return false;
    }
    return true;
  };

  const simulateUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simular progresso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 30;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    // Simular conclusão após 3s
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Adicionar vídeo à lista
      const newVideo = {
        id: uploadedVideos.length + 1,
        title: uploadForm.title,
        theme: uploadForm.theme,
        uploadedAt: new Date().toLocaleDateString('pt-BR')
      };
      setUploadedVideos(prev => [newVideo, ...prev]);

      // Resetar form
      setSelectedFile(null);
      setUploadForm({
        title: '',
        description: '',
        theme: '',
        duration: '',
        thumbnail: null
      });
      setUploadProgress(0);
      setIsUploading(false);

      alert('Vídeo enviado com sucesso!');
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="view active" style={{padding: '40px'}}>
      <div className="upload-container">
        
        <div className="upload-header">
          <h2>📤 Upload de Vídeos</h2>
          <p className="info-text">Apenas administradores podem fazer upload de novos vídeos</p>
        </div>

        <div className="upload-grid">
          
          {/* Seção de Upload */}
          <div className="upload-section">
            
            {/* Dropzone */}
            <div 
              className={`dropzone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!selectedFile ? (
                <>
                  <div className="dropzone-icon">📹</div>
                  <h3>Arrastar vídeo aqui</h3>
                  <p>ou</p>
                  <label className="file-input-label">
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={handleFileInput}
                      disabled={isUploading}
                      style={{display: 'none'}}
                    />
                    <span className="btn btn-sm btn-primary">Selecionar arquivo</span>
                  </label>
                </>
              ) : (
                <>
                  <div className="file-info">
                    <div className="file-icon">✓</div>
                    <div>
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Mudar arquivo
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Barra de Progresso */}
            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
                <p className="progress-text">{Math.round(uploadProgress)}% enviado</p>
              </div>
            )}

            {/* Formulário de Metadados */}
            {selectedFile && !isUploading && (
              <form className="metadata-form">
                <div className="form-group">
                  <label>Título do vídeo *</label>
                  <input 
                    type="text"
                    placeholder="Ex: Como acordar mais cedo"
                    value={uploadForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea 
                    placeholder="Descreva o conteúdo do vídeo..."
                    value={uploadForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    disabled={isUploading}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tema *</label>
                    <select 
                      value={uploadForm.theme}
                      onChange={(e) => handleFormChange('theme', e.target.value)}
                      disabled={isUploading}
                    >
                      <option value="">Selecionar tema</option>
                      {themes.map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duração (minutos)</label>
                    <input 
                      type="number"
                      placeholder="Ex: 15"
                      value={uploadForm.duration}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                      disabled={isUploading}
                      min="0"
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={simulateUpload}
                  disabled={isUploading}
                >
                  {isUploading ? '⏳ Enviando...' : '📤 Enviar Vídeo'}
                </button>
              </form>
            )}
          </div>

          {/* Seção de Vídeos Enviados */}
          <div className="uploaded-section">
            <h3>Vídeos Enviados ({uploadedVideos.length})</h3>
            
            {uploadedVideos.length > 0 ? (
              <div className="videos-table">
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Tema</th>
                      <th>Data</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedVideos.map(video => (
                      <tr key={video.id}>
                        <td className="col-title">{video.title}</td>
                        <td>{video.theme}</td>
                        <td>{video.uploadedAt}</td>
                        <td className="col-action">
                          <button className="btn-icon" title="Editar">✏️</button>
                          <button className="btn-icon" title="Deletar">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state">Nenhum vídeo enviado ainda</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

// Styles
const styles = `
.upload-container {
  max-width: 1200px;
  margin: 0 auto;
}

.upload-header {
  margin-bottom: 40px;
}

.upload-header h2 {
  margin-top: 0;
  color: var(--text-primary);
}

.info-text {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 1024px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dropzone {
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
  background: var(--bg-secondary);
  cursor: pointer;
}

.dropzone:hover {
  border-color: var(--silver);
  background: var(--bg-input);
}

.dropzone.dragging {
  border-color: var(--silver);
  background: var(--bg-input);
  box-shadow: inset 0 0 10px rgba(200, 200, 200, 0.1);
}

.dropzone.has-file {
  background: var(--bg-card);
  border-color: var(--silver);
}

.dropzone-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.dropzone h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.dropzone p {
  margin: 0 0 16px 0;
  color: var(--text-muted);
}

.file-input-label {
  cursor: pointer;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}

.file-icon {
  font-size: 2rem;
  color: var(--silver);
}

.file-name {
  margin: 0;
  color: var(--text-primary);
  font-weight: 500;
  word-break: break-word;
}

.file-size {
  margin: 4px 0 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.progress-container {
  padding: 20px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--silver);
  transition: width 0.3s;
}

.progress-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
}

.metadata-form {
  padding: 24px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--silver);
  box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-block {
  width: 100%;
}

.uploaded-section {
  padding: 24px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  max-height: 600px;
  overflow-y: auto;
}

.uploaded-section h3 {
  margin-top: 0;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.videos-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

table th {
  background: var(--bg-secondary);
  padding: 12px;
  text-align: left;
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

table td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
}

table tr:hover {
  background: var(--bg-secondary);
}

.col-title {
  color: var(--text-primary);
  font-weight: 500;
}

.col-action {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--bg-secondary);
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 20px;
}
`;
