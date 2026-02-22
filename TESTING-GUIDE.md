# 🧪 Teste de Fluxo OAuth - Wake Up Now

## ✅ Checklist de Teste

Execute cada passo e verifique no console do navegador (F12).

---

## 1️⃣ Teste Básico - Verificar Setup

Abra `http://localhost:3000` e execute no Console (F12):

```javascript
// Test 1: Verificar se funções existem
console.log('✓ navigateTo existente?', typeof window.navigateTo === 'function');
console.log('✓ AuthService existente?', typeof window.AuthService === 'object');
console.log('✓ setCurrentViewGlobal?', typeof window.setCurrentViewGlobal === 'function');

// Test 2: Verificar localStorage
console.log('✓ localStorage vazio?', localStorage.getItem('wun_token') === null);

// Test 3: Chamar navigateTo
window.navigateTo('home'); // Deve ir para Home
window.navigateTo('login'); // Deve ir para LoginPage
window.navigateTo('videos'); // Deve ir para Videos
```

**Esperado:** Todos os logs mostram `✓ true`

---

## 2️⃣ Teste - Botão "Começar Agora" Redireciona

1. Abra a página Home
2. Clique em **"🚀 Começar Agora"**
3. **Esperado:** Você é redirecionado para **LoginPage**
4. **Verificar Console:** Sem mensagens de erro

---

## 3️⃣ Teste - LoginPage Mostra Botões

Na LoginPage, verifique:

```javascript
// Verificar se está na view login
document.querySelector('[class*="login"]') ? console.log('✓ LoginPage renderizada') : console.log('✗ Falhou');

// Verificar botões
document.body.textContent.includes('Google') ? console.log('✓ Botão Google visível') : console.log('✗ Falhou');
document.body.textContent.includes('Apple') ? console.log('✓ Botão Apple visível') : console.log('✗ Falhou');
```

---

## 4️⃣ Teste - AuthService POST para Backend

Teste a chamada ao backend (mesmo que retorne erro):

```javascript
// Simular POST para /api/auth/google (mesmo que backend não exista)
window.AuthService.validateGoogleToken('test_token_123')
    .then(result => {
        console.log('✓ Requisição enviada ao backend');
        console.log('✓ Resposta:', result);
    })
    .catch(err => {
        console.log('❌ Backend não respondeu (esperado se não estiver pronto)');
        console.log('Erro:', err.message);
    });
```

**Esperado:** 
- Se backend está rodando: Resposta JSON
- Se backend não existe: Erro "Failed to fetch" ou erro 404

---

## 5️⃣ Teste - Salvar Auth Data

```javascript
// Simular login bem-sucedido
const userData = {
    id: 'user-123',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'user'
};
const token = 'jwt_fake_token_12345';

window.AuthService.saveAuthData(userData, token);

// Verificar se foi salvo
console.log('✓ Token salvo?', localStorage.getItem('wun_token') === token);
console.log('✓ User salvo?', localStorage.getItem('wun_user') !== null);
console.log('✓ Authenticated?', window.AuthService.isAuthenticated());
```

**Esperado:**
- Todos os checks retornam `true`
- Sidebar mostra avatar com iniciais "JS"

---

## 6️⃣ Teste - SessionStorage para OAuth Novo

```javascript
// Simular user novo vindo do Google
const oauthData = {
    email: 'novo@example.com',
    name: 'Novo User',
    provider: 'google',
    token: 'google_token_abc123'
};

sessionStorage.setItem('oauth_data', JSON.stringify(oauthData));

// Agora redirecionar para signup
window.navigateTo('signup');

// Verificar se SignupPage carregou
console.log('✓ Oauth data no sessionStorage?', sessionStorage.getItem('oauth_data') !== null);
console.log('✓ Email aparece no form?', document.body.textContent.includes('novo@example.com'));
```

**Esperado:**
- SignupPage aparece
- Email e nome de "novo@example.com" aparecem no formulário

---

## 7️⃣ Teste - Signup Com Validação

Na SignupPage, preencha:
- **CPF:** 123.456.789-00
- **Senha:** senha123
- **Confirmar Senha:** senha123
- Clique em **"✅ Finalizar Cadastro"**

**Verificar Console:**

```javascript
// Se backend respondeu:
console.log('✓ User criado no backend');
localStorage.getItem('wun_token') ? console.log('✓ Token salvo') : console.log('✗ Falhou');

// Se backend não respondeu:
console.log('❌ Backend não respondeu (normal se não implementado)');
```

---

## 🚫 Teste - Email/Senha Fallback

Na LoginPage:

1. Clique em **"📧 Usar email/senha"**
2. Preencha: `seu@email.com` / `senha123`
3. Clique em **"🔓 Entrar"**

**Esperado:** 
- Tentativa de POST para `/api/auth/login`
- Se backend não existe: Erro esperado

---

## 🧹 Cleanup - Limpar Dados

Se algo errar, limpe os dados:

```javascript
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

---

## 📊 Matriz de Teste

| Teste | Resultado Esperado | Status |
|-------|-------------------|--------|
| navigateTo existe | ✓ function | [ ] Pass |
| AuthService existe | ✓ object | [ ] Pass |
| Botão "Começar Agora" redireciona | LoginPage | [ ] Pass |
| LoginPage mostra botões | Google + Apple + Email | [ ] Pass |
| AuthService.validateGoogleToken POST | Network request | [ ] Pass |
| saveAuthData atualiza localStorage | token + user | [ ] Pass |
| SignupPage recebe oauth_data | email pré-preenchido | [ ] Pass |
| Signup POST para /api/auth/signup | Network request | [ ] Pass |
| Usuário autenticado mostra no Sidebar | Avatar + nome | [ ] Pass |

---

## 🔧 Debug - Se Algo Não Funcionar

### Problema: navigateTo não funciona

```javascript
// Verifique se function existe
typeof window.navigateTo === 'function' ? console.log('Existe') : console.log('Não existe');

// Verifique se setCurrentViewGlobal foi atribuído pelo React
window.setCurrentViewGlobal ? console.log('React inicializou') : console.log('React não inicializou');

// Teste manual
if (window.setCurrentViewGlobal) {
    window.setCurrentViewGlobal('login');
} else {
    console.log('setCurrentViewGlobal não foi definido pelo React');
}
```

### Problema: LoginPage não renderiza

```javascript
// Verifique o HTML
console.log(document.body.innerHTML.includes('Continuar com Google'));

// Verifique se há erros no React
// Abra DevTools > Console > Procure por erros vermelhos
```

### Problema: Backend não responde

```javascript
// Teste diretamente com fetch
fetch('http://localhost:8080/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'test' })
})
.then(r => r.json())
.then(data => console.log('✓ Backend respondeu:', data))
.catch(e => console.log('❌ Backend offline:', e.message));
```

---

## 📝 Próximos Passos Após Teste

1. **✅ Teste local passa** → Implementar Google OAuth completo
2. **✅ Google OAuth funciona** → Implementar backend Java
3. **✅ Backend Java pronto** → Integrar com banco de dados
4. **✅ Banco de dados pronto** → Testar fluxo end-to-end

---

## 📞 Errors Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `navigateTo is not defined` | Função não foi criada | Recarregar página ou verificar script |
| `Failed to fetch /api/auth/google` | Backend offline | Iniciar servidor Java |
| `CORS error` | Backend sem CORS configured | Adicionar `@CrossOrigin` no controller |
| `User not found` | Email não existe no DB | Criar user no banco antes de testar |

---

### 🎯 Resumo do Fluxo Esperado

```
Home
  ↓
[Clica "Começar Agora"]
  ↓
LoginPage
  ↓
[Clica "Google"]
  ↓
Backend validate /api/auth/google
  ├─ User existe → Login automático
  └─ User novo → SignupPage
  ↓
[Preenche CPF e Senha]
  ↓
Backend create /api/auth/signup
  ↓
Token salvo em localStorage
  ↓
Sidebar mostra "Olá, João!"
```

---

**Pronto para testar!** 🚀
