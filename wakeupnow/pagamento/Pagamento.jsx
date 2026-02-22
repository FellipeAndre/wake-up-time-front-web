import React, { useState } from 'react';

/**
 * COMPONENTE: Pagamento
 * 
 * Responsabilidade:
 * - Exibir planos de assinatura
 * - Detalhes de cada plano
 * - Processamento de pagamento
 * - Métodos de pagamento (Cartão, PIX, Boleto)
 */

export default function Pagamento() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    pixKey: '',
  });

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29.90,
      duration: '/mês',
      description: 'Perfeito para iniciantes',
      features: [
        '✓ 20 vídeos de conteúdo',
        '✓ Suporte por email',
        '✗ Certificado',
        '✗ Comunidade exclusiva'
      ],
      cta: 'Escolher Starter'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79.90,
      duration: '/mês',
      description: 'Para os mais dedicados',
      features: [
        '✓ Todos os vídeos',
        '✓ Suporte prioritário',
        '✓ Certificado de conclusão',
        '✗ Comunidade exclusiva'
      ],
      cta: 'Escolher Pro',
      featured: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 149.90,
      duration: '/mês',
      description: 'Máximo de benefícios',
      features: [
        '✓ Todos os vídeos',
        '✓ Suporte 24/7',
        '✓ Certificado premium',
        '✓ Comunidade exclusiva'
      ],
      cta: 'Escolher Elite'
    }
  ];

  const maskCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };

  const maskExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleFormChange = (field, value) => {
    if (field === 'cardNumber') {
      value = maskCardNumber(value);
    } else if (field === 'cardExpiry') {
      value = maskExpiry(value);
    } else if (field === 'cardCVV') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePayment = () => {
    if (!selectedPlan) {
      alert('Selecione um plano');
      return false;
    }

    if (paymentMethod === 'card') {
      if (!paymentForm.cardName || !paymentForm.cardNumber || !paymentForm.cardExpiry || !paymentForm.cardCVV) {
        alert('Preencha todos os dados do cartão');
        return false;
      }
      if (paymentForm.cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Número do cartão inválido');
        return false;
      }
    } else if (paymentMethod === 'pix') {
      if (!paymentForm.pixKey) {
        alert('Preencha a chave PIX');
        return false;
      }
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validatePayment()) return;

    setIsProcessing(true);

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = plans.find(p => p.id === selectedPlan);
      alert(`Parabéns! Você se inscreveu no plano ${plan.name}\nValor: R$ ${plan.price.toFixed(2)}/mês`);
      
      // Limpar form
      setSelectedPlan(null);
      setPaymentForm({
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        pixKey: '',
      });
    } catch (error) {
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlanData = selectedPlan ? plans.find(p => p.id === selectedPlan) : null;

  return (
    <div className="view active" style={{padding: '40px'}}>
      <div className="pagamento-container">
        
        {/* Grid: Planos à esquerda, Pagamento à direita */}
        <div className="pagamento-grid">
          
          {/* Seção de Planos */}
          <div className="plans-section">
            <h2>Escolha seu plano</h2>
            <div className="plans-list">
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  className={`plan-card ${plan.featured ? 'featured' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.featured && <div className="plan-badge">⭐ Mais popular</div>}
                  
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <p className="plan-desc">{plan.description}</p>
                  </div>

                  <div className="plan-price">
                    <span className="amount">R$ {plan.price.toFixed(2)}</span>
                    <span className="duration">{plan.duration}</span>
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de Pagamento */}
          {selectedPlanData && (
            <div className="payment-section">
              <div className="payment-panel">
                <h3>Resumo do pedido</h3>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Plano</span>
                    <strong>{selectedPlanData.name}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Valor mensal</span>
                    <strong>R$ {selectedPlanData.price.toFixed(2)}</strong>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <strong>R$ {selectedPlanData.price.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Abas de Pagamento */}
                <div className="payment-tabs">
                  <button 
                    className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Cartão
                  </button>
                  <button 
                    className={`tab-btn ${paymentMethod === 'pix' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    🔐 PIX
                  </button>
                  <button 
                    className={`tab-btn ${paymentMethod === 'boleto' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('boleto')}
                    disabled
                  >
                    📄 Boleto
                  </button>
                </div>

                {/* Formulário de Cartão */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handlePayment}>
                    <div className="form-group">
                      <label>Nome no cartão</label>
                      <input 
                        type="text"
                        placeholder="João Silva"
                        value={paymentForm.cardName}
                        onChange={(e) => handleFormChange('cardName', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Número do cartão</label>
                      <input 
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentForm.cardNumber}
                        onChange={(e) => handleFormChange('cardNumber', e.target.value)}
                        maxLength="19"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Vencimento</label>
                        <input 
                          type="text"
                          placeholder="MM/AA"
                          value={paymentForm.cardExpiry}
                          onChange={(e) => handleFormChange('cardExpiry', e.target.value)}
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input 
                          type="text"
                          placeholder="123"
                          value={paymentForm.cardCVV}
                          onChange={(e) => handleFormChange('cardCVV', e.target.value)}
                          maxLength="3"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block"
                      disabled={isProcessing}
                    >
                      {isProcessing ? '⏳ Processando...' : 'Confirmar Pagamento'}
                    </button>
                  </form>
                )}

                {/* Formulário de PIX */}
                {paymentMethod === 'pix' && (
                  <form onSubmit={handlePayment}>
                    <div className="form-group">
                      <label>Chave PIX</label>
                      <input 
                        type="text"
                        placeholder="seu.email@example.com ou outro identificador"
                        value={paymentForm.pixKey}
                        onChange={(e) => handleFormChange('pixKey', e.target.value)}
                      />
                    </div>

                    <div className="pix-info">
                      <p>🔐 Você será direcionado para confirmar o pagamento PIX de forma segura.</p>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block"
                      disabled={isProcessing}
                    >
                      {isProcessing ? '⏳ Processando...' : 'Pagar com PIX'}
                    </button>
                  </form>
                )}

                {/* Boleto Indisponível */}
                {paymentMethod === 'boleto' && (
                  <div className="payment-unavailable">
                    <p>Boleto indisponível no momento. Use cartão ou PIX.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// Styles
const styles = `
.pagamento-container {
  max-width: 1200px;
  margin: 0 auto;
}

.pagamento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 1024px) {
  .pagamento-grid {
    grid-template-columns: 1fr;
  }
}

.plans-section h2 {
  margin-top: 0;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-card {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.plan-card:hover {
  border-color: var(--silver);
  box-shadow: var(--shadow-md);
}

.plan-card.selected {
  border-color: var(--silver);
  background: var(--bg-secondary);
  box-shadow: 0 0 20px rgba(200, 200, 200, 0.2);
}

.plan-card.featured {
  border-color: var(--silver);
}

.plan-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: var(--silver);
  color: var(--charcoal);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.plan-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.plan-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.plan-price {
  margin: 20px 0;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--silver);
}

.duration {
  color: var(--text-muted);
  font-size: 1rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.plan-features li {
  padding: 8px 0;
  color: var(--text-secondary);
}

.payment-section {
  position: sticky;
  top: 40px;
}

.payment-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
}

.payment-panel h3 {
  margin-top: 0;
  color: var(--text-primary);
}

.order-summary {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin: 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: var(--text-secondary);
}

.summary-row.total {
  font-size: 1.1rem;
  color: var(--text-primary);
  padding-top: 12px;
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}

.payment-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
}

.tab-btn {
  padding: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.tab-btn:hover:not(:disabled) {
  border-color: var(--silver);
  color: var(--silver);
}

.tab-btn.active {
  background: var(--silver);
  color: var(--charcoal);
  border-color: var(--silver);
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--silver);
  box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-block {
  width: 100%;
}

.pix-info {
  background: var(--bg-secondary);
  border-left: 3px solid var(--silver);
  padding: 12px;
  border-radius: var(--radius-sm);
  margin: 16px 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.payment-unavailable {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-align: center;
}
`;
