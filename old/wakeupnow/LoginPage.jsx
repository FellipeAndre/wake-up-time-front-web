/**
 * 🔐 LOGIN PAGE · Wake Up Now
 * 
 * Fluxo:
 * 1. User clica Google/Apple
 * 2. Abre dialog OAuth
 * 3. Backend valida token
 * 4. Se existe: login automático
 * 5. Se novo: redireciona pra cadastro com dados
 */

function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [emailForm, setEmailForm] = React.useState({ email: '', password: '' });

  /**
   * Simula clique no botão Google
   * Em produção, usar: @react-oauth/google
   */
  const handleGoogleClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simular token Google (em produção, vem do GoogleLogin component)
      const mockGoogleToken = 'google_' + Date.now();
      
      const result = await window.AuthService.validateGoogleToken(mockGoogleToken);

      if (result.success && !result.isNewUser) {
        // ✅ Usuário existe - faz login automático
        console.log('✅ Login via Google (usuário existente)');
        window.AuthService.saveAuthData(result.user, result.token);
        window.location.href = '/wakeupnow/index.html#/videos';
      } else if (result.isNewUser) {
        // ⚠️ Usuário novo - redireciona pra cadastro com dados
        console.log('⚠️ Novo usuário - redirecionando pra cadastro');
        sessionStorage.setItem('oauth_data', JSON.stringify({
          email: result.userData.email,
          name: result.userData.name,
          provider: 'google',
          token: mockGoogleToken
        }));
        window.location.href = '/wakeupnow/index.html#/cadastro?oauth=true';
      }
    } catch (err) {
      setError('❌ Erro ao autenticar com Google: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Simula clique no botão Apple
   */
  const handleAppleClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      const mockAppleToken = 'apple_' + Date.now();
      const result = await window.AuthService.validateAppleToken(mockAppleToken);

      if (result.success && !result.isNewUser) {
        console.log('✅ Login via Apple (usuário existente)');
        window.AuthService.saveAuthData(result.user, result.token);
        window.location.href = '/wakeupnow/index.html#/videos';
      } else if (result.isNewUser) {
        console.log('⚠️ Novo usuário via Apple - redirecionando pra cadastro');
        sessionStorage.setItem('oauth_data', JSON.stringify({
          email: result.userData.email,
          name: result.userData.name,
          provider: 'apple',
          token: mockAppleToken
        }));
        window.location.href = '/wakeupnow/index.html#/cadastro?oauth=true';
      }
    } catch (err) {
      setError('❌ Erro ao autenticar com Apple: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login com email/senha
   */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await window.AuthService.loginEmail(
        emailForm.email,
        emailForm.password
      );

      if (result.success) {
        window.AuthService.saveAuthData(result.user, result.token);
        window.location.href = '/wakeupnow/index.html#/videos';
      } else {
        setError(result.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('❌ Erro ao fazer login: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="view active" style={{padding: 0}}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '100vh',
        background: 'var(--bg-page)'
      }}>
        
        {/* LADO ESQUERDO - Informações */}
        <div style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(200,200,200,0.05) 0%, transparent 100%)'
        }}>
          <h1 style={{fontSize: '3rem', marginBottom: '16px', color: 'var(--text-primary)'}}>
            Bem-vindo de volta
          </h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6}}>
            Faça login ou crie sua conta para acessar conteúdo exclusivo.
          </p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div style={{display: 'flex', gap: '12px'}}>
              <div style={{fontSize: '2rem'}}>🎬</div>
              <div>
                <h3 style={{margin: 0, color: 'var(--text-primary)'}}>Conteúdo Profissional</h3>
                <p style={{margin: '4px 0', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  Vídeos de alta qualidade organizados por módulos
                </p>
              </div>
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <div style={{fontSize: '2rem'}}>🔒</div>
              <div>
                <h3 style={{margin: 0, color: 'var(--text-primary)'}}>Segurança Garantida</h3>
                <p style={{margin: '4px 0', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  Autenticação com Google/Apple + senha criptografada
                </p>
              </div>
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <div style={{fontSize: '2rem'}}>⚡</div>
              <div>
                <h3 style={{margin: 0, color: 'var(--text-primary)'}}>Acesso Imediato</h3>
                <p style={{margin: '4px 0', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                  Cadastro rápido com OAuth - nenhuma forma tediosa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO - Formulário */}
        <div style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{width: '100%', maxWidth: '380px'}}>
            <h2 style={{marginTop: 0, marginBottom: '32px', color: 'var(--text-primary)', textAlign: 'center'}}>
              Entrar na plataforma
            </h2>

            {error && (
              <div style={{
                background: 'rgba(255,109,109,0.1)',
                color: '#ff6d6d',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {!showEmailForm ? (
              <>
                {/* Botões OAuth */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
                  <button
                    onClick={handleGoogleClick}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-primary)',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.background = 'var(--bg-surface)';
                        e.target.style.borderColor = 'var(--silver)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--bg-card)';
                      e.target.style.borderColor = 'var(--border)';
                    }}
                  >
                    🔵 Continuar com Google
                  </button>

                  <button
                    onClick={handleAppleClick}
                    disabled={isLoading}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-primary)',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.background = 'var(--bg-surface)';
                        e.target.style.borderColor = 'var(--silver)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--bg-card)';
                      e.target.style.borderColor = 'var(--border)';
                    }}
                  >
                    🍎 Continuar com Apple
                  </button>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0'}}>
                  <div style={{flex: 1, height: '1px', background: 'var(--border)'}}></div>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>OU</span>
                  <div style={{flex: 1, height: '1px', background: 'var(--border)'}}></div>
                </div>

                <button
                  onClick={() => setShowEmailForm(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid var(--silver)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--silver)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(200,200,200,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  📧 Usar email/senha
                </button>
              </>
            ) : (
              <>
                {/* Formulário Email */}
                <form onSubmit={handleEmailLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                      placeholder="seu@email.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                      Senha
                    </label>
                    <input
                      type="password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{width: '100%'}}
                  >
                    {isLoading ? '⏳ Entrando...' : '🔓 Entrar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    ← Voltar aos métodos OAuth
                  </button>
                </form>
              </>
            )}

            <p style={{
              marginTop: '24px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              Não tem conta? Vamos criar durante o primeiro login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
