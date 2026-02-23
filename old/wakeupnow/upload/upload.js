/* ============================================================
   upload/upload.js — Lógica da view de Upload
   Integração: conectar as funções API_* ao seu backend
   ============================================================ */

/* ── Estado local do upload ── */
const UploadState = {
  file: null,
  thumbnail: null,
  uploads: JSON.parse(localStorage.getItem('wun_uploads') || '[]'),
};

/* ── Inicializar drag & drop ── */
function initUpload() {
  const dz = document.getElementById('dropzone');
  if (!dz) return;

  dz.addEventListener('dragover', (e) => {
    e.preventDefault();
    dz.classList.add('dragover');
  });

  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));

  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      processVideoFile(file);
    } else {
      showToast('Arquivo inválido. Selecione um vídeo.', 'error');
    }
  });

  renderRecentUploads();
}

/* ── Selecionar arquivo via input ── */
function handleFileSelect(input) {
  const file = input.files[0];
  if (file) processVideoFile(file);
}

/* ── Processar vídeo selecionado ── */
function processVideoFile(file) {
  UploadState.file = file;

  const url = URL.createObjectURL(file);
  const videoEl = document.getElementById('videoPreview');
  videoEl.src = url;

  // Mostrar metadados
  const meta = document.getElementById('previewMeta');
  meta.innerHTML = `
    <div class="preview-meta-item">
      <strong>${file.name}</strong>
      <span>Nome do arquivo</span>
    </div>
    <div class="preview-meta-item">
      <strong>${formatBytes(file.size)}</strong>
      <span>Tamanho</span>
    </div>
    <div class="preview-meta-item">
      <strong>${file.type.replace('video/', '').toUpperCase()}</strong>
      <span>Formato</span>
    </div>
  `;

  document.getElementById('dropzoneInner').style.display = 'none';
  document.getElementById('dropzonePreview').style.display = 'block';

  // Habilitar botão se título também estiver preenchido
  checkFormReady();
}

/* ── Limpar arquivo ── */
function clearFile() {
  UploadState.file = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('videoPreview').src = '';
  document.getElementById('dropzoneInner').style.display = 'flex';
  document.getElementById('dropzonePreview').style.display = 'none';
  checkFormReady();
}

/* ── Thumbnail ── */
function handleThumb(input) {
  const file = input.files[0];
  if (!file) return;
  UploadState.thumbnail = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('thumbPlaceholder').style.display = 'none';
    const img = document.getElementById('thumbPreview');
    img.src = e.target.result;
    img.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/* ── Verificar se formulário está pronto ── */
function checkFormReady() {
  const ready = UploadState.file && document.getElementById('videoTitle').value.trim();
  document.getElementById('btnUpload').disabled = !ready;
}

/* Escutar título para habilitar botão */
document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('videoTitle');
  if (titleInput) titleInput.addEventListener('input', checkFormReady);
});

/* ── Carregar módulos por tema (conectar ao backend) ── */
function loadModulesForTheme(themeId) {
  const select = document.getElementById('videoModule');
  select.innerHTML = '<option value="">Carregando...</option>';

  // TODO: substituir por chamada real à API
  // fetch(`/api/themes/${themeId}/modules`).then(...)

  const modulesMock = {
    '1': ['Módulo 1 — Crenças Limitantes', 'Módulo 2 — Reprogramação Mental'],
    '2': ['Módulo 1 — Gestão de Tempo', 'Módulo 2 — Deep Work', 'Módulo 3 — Sistemas de Produtividade'],
    '3': ['Módulo 1 — Orçamento Pessoal', 'Módulo 2 — Investimentos Básicos'],
    '4': ['Módulo 1 — Comunicação', 'Módulo 2 — Gestão de Equipes'],
    '5': ['Módulo 1 — Rotina Matinal', 'Módulo 2 — Nutrição e Energia'],
  };

  setTimeout(() => {
    const modules = modulesMock[themeId] || [];
    if (modules.length === 0) {
      select.innerHTML = '<option value="">Nenhum módulo disponível</option>';
      return;
    }
    select.innerHTML = '<option value="">Selecionar módulo...</option>' +
      modules.map((m, i) => `<option value="${i+1}">${m}</option>`).join('');
  }, 400);
}

/* ── Submeter upload ── */
async function submitUpload() {
  const title = document.getElementById('videoTitle').value.trim();
  const theme = document.getElementById('videoTheme').value;
  const module = document.getElementById('videoModule').value;

  if (!title || !theme || !module) {
    showToast('Preencha título, tema e módulo.', 'error');
    return;
  }

  if (!UploadState.file) {
    showToast('Selecione um vídeo primeiro.', 'error');
    return;
  }

  // Mostrar barra de progresso
  const progressWrap = document.getElementById('uploadProgressWrap');
  const fill = document.getElementById('uploadProgressFill');
  const pct = document.getElementById('uploadProgressPct');
  const status = document.getElementById('uploadProgressStatus');
  progressWrap.style.display = 'block';

  const btn = document.getElementById('btnUpload');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enviando...';

const formData = new FormData();
formData.append("video", UploadState.file);
formData.append("thumbnail", UploadState.thumbnail);
formData.append("title", title);
formData.append("theme", theme);
formData.append("module", module);

try {
  const response = await fetch("http://localhost:8080/admin/videos/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erro no upload");
  }

  const result = await response.json(); // ou .text() dependendo do backend

  onUploadSuccess({
    title,
    theme,
    module,
    size: UploadState.file.size
  });

} catch (error) {
  showToast("Erro ao enviar vídeo.", "error");
  btn.disabled = false;
  btn.innerHTML = "⬆ Enviar Vídeo";
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      onUploadSuccess({ title, theme, module, size: UploadState.file.size });
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
    status.textContent = progress < 100 ? 'Enviando...' : 'Processando...';
  }, 200);
}

/* ── Sucesso no upload ── */
function onUploadSuccess(data) {
  const status = document.getElementById('uploadProgressStatus');
  status.textContent = '✓ Upload concluído!';

  // Salvar no estado local (futuramente virá do backend)
  const newUpload = {
    id: Date.now(),
    title: data.title,
    size: data.size,
    date: new Date().toLocaleDateString('pt-BR'),
  };

  UploadState.uploads.unshift(newUpload);
  localStorage.setItem('wun_uploads', JSON.stringify(UploadState.uploads));

  renderRecentUploads();
  showToast(`"${data.title}" enviado com sucesso!`, 'success');

  setTimeout(() => {
    clearUploadForm();
  }, 2000);
}

/* ── Limpar formulário ── */
function clearUploadForm() {
  clearFile();
  document.getElementById('videoTitle').value = '';
  document.getElementById('videoDesc').value = '';
  document.getElementById('videoTheme').value = '';
  document.getElementById('videoModule').innerHTML = '<option value="">Selecione um tema primeiro...</option>';
  document.getElementById('videoOrder').value = '1';
  document.getElementById('thumbPreview').style.display = 'none';
  document.getElementById('thumbPlaceholder').style.display = 'block';
  document.getElementById('thumbInput').value = '';
  document.getElementById('uploadProgressWrap').style.display = 'none';
  document.getElementById('uploadProgressFill').style.width = '0%';
  document.getElementById('btnUpload').innerHTML = '⬆ Enviar Vídeo';
  UploadState.file = null;
  UploadState.thumbnail = null;
  checkFormReady();
}

/* ── Renderizar uploads recentes ── */
function renderRecentUploads() {
  const list = document.getElementById('recentUploadsList');
  const count = document.getElementById('uploadCount');
  if (!list) return;

  count.textContent = `${UploadState.uploads.length} vídeos`;
  document.getElementById('stat-total-videos').textContent = UploadState.uploads.length;

  if (UploadState.uploads.length === 0) {
    list.innerHTML = '<div class="empty-state-sm"><p>Nenhum vídeo enviado ainda.</p></div>';
    return;
  }

  list.innerHTML = UploadState.uploads.slice(0, 8).map(u => `
    <div class="upload-item">
      <div class="upload-item-thumb">🎬</div>
      <div class="upload-item-info">
        <strong>${u.title}</strong>
        <span>${u.date} · ${formatBytes(u.size)}</span>
      </div>
      <span class="tag tag-success" style="flex-shrink:0">✓</span>
    </div>
  `).join('');

  // Atualizar storage stat
  const totalBytes = UploadState.uploads.reduce((acc, u) => acc + (u.size || 0), 0);
  document.getElementById('stat-storage').textContent = formatBytes(totalBytes);
}

/* ── Helpers ── */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
}