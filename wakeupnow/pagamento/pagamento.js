/* ============================================================
   pagamento/pagamento.js — Lógica da view de Pagamento
   Integração: conectar ao gateway (Stripe, PagSeguro, MercadoPago)
   ============================================================ */

/* ── Estado do pagamento ── */
const PayState = {
  plan: 'pro',
  price: 97,
  discount: 0,
  method: 'cartao',
  pixTimerInterval: null,
};

/* ── Selecionar plano ── */
function selectPlan(plan, price) {
  PayState.plan = plan;
  PayState.price = price;

  // Atualizar cards
  document.querySelectorAll('.pay-plan-card').forEach(card => {
    const isSelected = card.dataset.plan === plan;
    card.classList.toggle('selected', isSelected);
  });

  // Atualizar checks
  ['starter', 'pro', 'elite'].forEach(p => {
    const check = document.getElementById(`check-${p}`);
    if (!check) return;
    check.classList.toggle('active', p === plan);
    check.textContent = p === plan ? '✓' : '';
  });

  // Atualizar parcelas
  updateInstallments(price);

  // Atualizar resumo
  updateSummary();
}

/* ── Atualizar parcelas do cartão ── */
function updateInstallments(price) {
  const el = document.getElementById('card-installments');
  if (!el) return;

  const p = price;
  el.innerHTML = `
    <option value="1">1x de R$ ${fmt(p)} (sem juros)</option>
    <option value="3">3x de R$ ${fmt(p/3)} (sem juros)</option>
    <option value="6">6x de R$ ${fmt(p/6)} (sem juros)</option>
    <option value="12">12x de R$ ${fmt(p/12 * 1.0199)} (com juros)</option>
  `;
}

/* ── Atualizar resumo do pedido ── */
function updateSummary() {
  const planNames = { starter: 'Plano Starter', pro: 'Plano Pro', elite: 'Plano Elite' };
  const total = PayState.price - PayState.discount;

  const el = (id) => document.getElementById(id);
  if (!el('summaryPlanName')) return;

  el('summaryPlanName').textContent = planNames[PayState.plan] || 'Plano';
  el('summaryPlanPrice').innerHTML = `R$ ${fmt(PayState.price)}<span>/mês</span>`;
  el('summarySubtotal').textContent = `R$ ${fmt(PayState.price)}`;
  el('summaryDiscount').textContent = PayState.discount > 0 ? `- R$ ${fmt(PayState.discount)}` : 'R$ 0,00';
  el('summaryFee').textContent = 'R$ 0,00';
  el('summaryTotal').textContent = `R$ ${fmt(total)}`;

  const btnPrice = document.getElementById('btnPrice');
  if (btnPrice) btnPrice.textContent = fmt(total);
}

/* ── Trocar método de pagamento ── */
function switchPayMethod(method) {
  PayState.method = method;

  ['cartao', 'pix', 'boleto'].forEach(m => {
    document.getElementById(`method-${m}`).style.display = m === method ? 'block' : 'none';
    document.getElementById(`tab-${m}`).classList.toggle('active', m === method);
  });

  // Resetar PIX se trocar
  if (method !== 'pix') {
    clearInterval(PayState.pixTimerInterval);
    if (document.getElementById('pixQrWrap'))
      document.getElementById('pixQrWrap').style.display = 'none';
  }
}

/* ── Máscaras ── */
function maskCard(input) {
  let v = input.value.replace(/\D/g,'').slice(0,16);
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = v;
}

function maskExpiry(input) {
  let v = input.value.replace(/\D/g,'').slice(0,4);
  if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
  input.value = v;
}

/* ── Submeter pagamento com cartão ── */
async function submitPayment(method) {
  const btn = document.getElementById('btnPagar');
  if (!btn) return;

  if (method === 'cartao') {
    const num = document.getElementById('card-number').value.replace(/\s/g,'');
    const name = document.getElementById('card-name').value.trim();
    const exp = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;

    if (num.length < 13 || !name || exp.length < 5 || cvv.length < 3) {
      showToast('Preencha todos os dados do cartão corretamente.', 'error');
      return;
    }
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processando...';

  try {
    // TODO: Integrar com gateway de pagamento
    // Ex: Stripe
    // const { paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
    // const res = await fetch('/api/pagamento/processar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentMethodId: paymentMethod.id, plano: PayState.plan })
    // });

    // Simular processamento
    await new Promise(r => setTimeout(r, 2000));

    // Sucesso
    onPaymentSuccess();

  } catch (err) {
    showToast(err.message || 'Erro no pagamento. Tente novamente.', 'error');
    btn.disabled = false;
    btn.innerHTML = `🔒 Pagar R$ ${fmt(PayState.price - PayState.discount)}`;
  }
}

/* ── Sucesso ── */
function onPaymentSuccess() {
  const planNames = { starter: 'Starter', pro: 'Pro', elite: 'Elite' };
  document.getElementById('successPlanName').textContent = planNames[PayState.plan];
  document.getElementById('successModal').classList.add('open');
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('open');
}

/* ── Gerar PIX ── */
async function generatePix() {
  showToast('Gerando QR Code PIX...', 'success');

  // TODO: fetch('/api/pagamento/pix', { method:'POST', ... })
  await new Promise(r => setTimeout(r, 1000));

  document.getElementById('pixQrWrap').style.display = 'block';
  document.querySelector('.pix-area button')?.remove();

  // Timer de 15 min
  let seconds = 15 * 60;
  PayState.pixTimerInterval = setInterval(() => {
    seconds--;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const timerEl = document.getElementById('pixTimer');
    if (timerEl) timerEl.innerHTML = `⏱ Expira em <strong>${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</strong>`;
    if (seconds <= 0) {
      clearInterval(PayState.pixTimerInterval);
      if (timerEl) timerEl.textContent = '⚠ QR Code expirado. Gere um novo.';
    }
  }, 1000);
}

/* ── Copiar chave PIX ── */
function copyPixKey() {
  const key = document.getElementById('pixKey').textContent;
  navigator.clipboard.writeText(key).then(() => {
    showToast('Chave PIX copiada!', 'success');
  });
}

/* ── Gerar Boleto ── */
async function generateBoleto() {
  const cpf = document.getElementById('boleto-cpf').value.replace(/\D/g,'');
  if (cpf.length !== 11) { showToast('CPF inválido.', 'error'); return; }

  // TODO: fetch('/api/pagamento/boleto', ...)
  await new Promise(r => setTimeout(r, 800));
  showToast('Boleto gerado! O PDF será aberto em breve.', 'success');
}

/* ── Aplicar cupom ── */
async function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (!code) return;

  // TODO: fetch(`/api/cupons/${code}`)
  if (code === 'WAKEUP20') {
    PayState.discount = Math.round(PayState.price * 0.2);
    updateSummary();
    showToast('Cupom aplicado! 20% de desconto.', 'success');
  } else {
    showToast('Cupom inválido ou expirado.', 'error');
  }
}

/* ── Helper formato BRL ── */
function fmt(v) {
  return v.toFixed(2).replace('.', ',');
}

/* ── Inicializar view de pagamento ── */
function initPagamento() {
  updateInstallments(PayState.price);
  updateSummary();
}
