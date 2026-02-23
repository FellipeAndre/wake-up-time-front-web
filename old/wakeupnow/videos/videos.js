/* ============================================================
   videos/videos.js — Lógica da view de Vídeos
   ============================================================ */

/* ── Toggle tema (expandir/recolher) ── */
function toggleTheme(header) {
  const block = header.closest('.theme-block');
  block.classList.toggle('collapsed');
}

/* ── Toggle módulo (expandir/recolher) ── */
function toggleModule(header) {
  const card = header.closest('.module-card');
  const videosList = card.querySelector('.videos-list');
  if (!videosList) return;

  const isOpen = videosList.style.display !== 'none';
  videosList.style.display = isOpen ? 'none' : 'block';
  card.classList.toggle('open', !isOpen);
}

/* ── Reproduzir vídeo ── */
function playVideo(item, title) {
  if (item.classList.contains('locked')) return;

  document.getElementById('videoModalTitle').textContent = title;
  document.getElementById('videoModalSub').textContent =
    '⚡ Streaming via backend · URL do vídeo virá da API';
  document.getElementById('videoModal').classList.add('open');
}

/* ── Fechar modal ── */
function closeVideoModal(event) {
  if (!event || event.target.id === 'videoModal' || event.currentTarget === undefined) {
    document.getElementById('videoModal').classList.remove('open');
  }
}

/* ── Paywall ── */
function showPaywall() {
  showToast('Este conteúdo requer plano Pro ou Elite.', 'error');
  setTimeout(() => navigateTo('pagamento'), 1000);
}

/* ── Busca ── */
function filterVideos(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.video-item').forEach(item => {
    const text = item.querySelector('strong')?.textContent.toLowerCase() || '';
    item.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
  });
}

/* ── Filtrar por tema ── */
function filterByTheme(themeId) {
  document.querySelectorAll('.theme-block').forEach(block => {
    const match = !themeId || block.dataset.theme === themeId;
    block.style.display = match ? 'block' : 'none';
  });
}
