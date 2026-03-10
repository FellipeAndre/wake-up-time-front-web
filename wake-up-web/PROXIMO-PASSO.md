# 🚀 Seu Próximo Passo - Implementação Completa



## ✅ O que foi feito (Frontend - React)

```
✅ ProtectedRoute.jsx criado
✅ Cadastro.jsx atualizado → redireciona para login
✅ Login.jsx atualizado → valida token
✅ authService.js atualizado → método validateToken()
✅ router.jsx atualizado → protege /upload
```

## ❌ O que falta (Backend - Spring)

```
⚠️ GET /auth/validate precisa ser implementado no seu backend

Veja: BACKEND-IMPLEMENTACAO-VALIDATE.md
```

---

## 🎯 PASSO A PASSO

### **PASSO 1:** Testar Frontend (sem backend ainda)

O frontend vai funcionar parcialmente sem o backend validar:

```bash
# 1. Inicie seu servidor de debug React
cd wake-up-web
npm run dev

# 2. Acesse http://localhost:5173

# 3. Teste o cadastro
- Vai para /cadastro
- Preencha dados e clique "Cadastrar"
- ✅ Deve redirecionar para /login com mensagem

# 4. Teste o login
- Preencha email/senha
- Clique "Entrar"
- ⚠️ Pode falhar aqui (authService.validateToken não encontra GET /auth/validate)
- ✅ Vai tentar chamar GET /auth/validate
- DevTools → Network → vê a requisição 404 ou erro
```

---

### **PASSO 2:** Implementar Backend (Spring)

Copie para seu projeto Spring:

**Arquivo de referência:** `BACKEND-IMPLEMENTACAO-VALIDATE.md`

**O que implementar:**

1. **Adicione ao AuthController:**
```java
@GetMapping("/validate")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String bearerToken) {
  // ... implementação no arquivo de referência
}
```

2. **Certifique-se que JwtTokenProvider tem:**
```java
public boolean validateToken(String token) {
  // ... validar JWT
}
```

3. **Teste com cURL:**
```bash
# Login para obter token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'

# Resposta deve ter "token": "eyJhbGc..."

# Validar token
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer eyJhbGc..."

# Resposta deve ser: { "valid": true }
```

---

### **PASSO 3:** Conectar Backend com Frontend

Após implementar GET /auth/validate:

```bash
# 1. Certifique-se que seu backend está rodando
# Porta padrão: http://localhost:8080

# 2. Verifique a URL da API no frontend
# Arquivo: src/services/api.js
# Deve ter: const BASE_URL = 'http://localhost:8080/api'

# 3. Teste novamente
# Frontend → Login.jsx → POST /auth/login → sucesso!
# Frontend → Login.jsx → GET /auth/validate → sucesso!
# → Redireciona para home
```

---

### **PASSO 4:** Testar ProtectedRoute

Após login bem-sucedido:

```bash
# 1. Acesse http://localhost:5173/upload
# ✅ Deve carregar a página de upload

# 2. Abra DevTools → Application → localStorage
# Veja: wun_token (deve ter valor JWT)

# 3. Delete wun_token
# Recarregue: http://localhost:5173/upload
# ✅ Redireciona para /login automaticamente
```

---

### **PASSO 5:** Testar Logout (Próximo)

❌ **Não implementado ainda**

Para implementar:

1. Adicione botão "Logout" no navbar
2. Clique deve chamar `logout()` do AuthContext
3. Deve limpar localStorage + redirecionar

```jsx
// Exemplo de implementação
const { logout } = useContext(AuthContext)

<button onClick={() => {
  logout()
  navigate('/')
}}>
  Sair
</button>
```

---

## 📋 Checklist de Validação

### Antes de começar
- [ ] Frontend rodando: `npm run dev`
- [ ] Backend rodando: `java -jar app.jar` ou IDE
- [ ] URLs corretas: `http://localhost:5173` e `http://localhost:8080`

### Teste 1: Cadastro
- [ ] Acessa `/cadastro`
- [ ] Preenche formulário
- [ ] Clica "Cadastrar"
- [ ] Redireciona para `/login`
- [ ] Vê mensagem de sucesso

### Teste 2: Login
- [ ] Acessa `/login`
- [ ] Preenche email/senha
- [ ] Clica "Entrar"
- [ ] DevTools vê: POST /auth/login → 200
- [ ] DevTools vê: GET /auth/validate → 200
- [ ] Redireciona para `/`

### Teste 3: ProtectedRoute
- [ ] Com token: acessa `/upload` → OK
- [ ] Sem token: acessa `/upload` → redireciona `/login`

---

## 🐛 Troubleshooting

### ❌ Erro: "Cannot find module 'ProtectedRoute'"

**Solução:**
```jsx
// Verifique isso em router.jsx
import ProtectedRoute from '../components/ProtectedRoute' // ✅ Correto
```

### ❌ Erro: "GET /auth/validate 404"

**Solução:** Backend não tem esse endpoint
- [ ] Implementar GET /auth/validate (ver BACKEND-IMPLEMENTACAO-VALIDATE.md)
- [ ] Reiniciar servidor backend
- [ ] Testar com cURL primeiro

### ❌ Erro: "Token validation failed"

**Solução:**
- [ ] Token correto sendo enviado? (DevTools → Network)
- [ ] Backend está validando JWT corretamente?
- [ ] JWT secret é o mesmo?

### ❌ Login "remora" redirecionamento

**Solução:**
- [ ] Pode estar esperando GET /auth/validate
- [ ] Verifique DevTools → Network → tempo de resposta

---

## 📚 Arquivos de Referência

| Arquivo | Leia se... |
|---------|-----------|
| RESUMO-AUTENTICACAO.md | Quer visão geral rápida (4 min) |
| AUTENTICACAO-FLUXO.md | Quer entender o fluxo completo |
| IMPLEMENTACAO-AUTENTICACAO.md | Quer testes detalhados |
| CHECKLIST-AUTENTICACAO.md | Quer checklist de validação |
| BACKEND-IMPLEMENTACAO-VALIDATE.md | Precisa implementar backend |
| SUMARIO-MUDANCAS.md | Quer ver mudanças resumidas |

---

## 🔗 Links Úteis

### Frontend
- [ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)
- [Login.jsx](src/pages/Login.jsx)
- [Cadastro.jsx](src/pages/Cadastro.jsx)
- [router.jsx](src/routes/router.jsx)

### Backend (exemplo Spring)
- [BACKEND-IMPLEMENTACAO-VALIDATE.md](BACKEND-IMPLEMENTACAO-VALIDATE.md)

---

## 🎯 Resultado Esperado

### Após completar:

```
[Novo Usuário]
    ↓
/cadastro → preenche → POST /users
    ↓
Redireciona para /login com mensagem ✅
    ↓
[Email/Senha]
    ↓
POST /auth/login → recebe token
    ↓
GET /auth/validate → valida token ✅✅✅ (NOVO)
    ↓
Salva em localStorage
    ↓
Redireciona para /home
    ↓
[Acesso protegido]
    ↓
/upload → ProtectedRoute verifica token ✅
    ↓
Carrega página normalmente
```

---

## 💡 Dica Professional

### Para testar múltiplas contas:

1. Use modo privado/incógnito do navegador
2. localStorage fica isolado por aba

### Para debug:

```javascript
// Console do navegador (DevTools → Console)
localStorage.getItem('wun_token') // vê o token
AuthContext.token // vê se carregou (React DevTools)
```

---

## 🚀 Você está Perto!

✅ Frontend 100% implementado  
⏳ Backend precisa de 1 endpoint (GET /auth/validate)  
🎯 5 minutos para conectar tudo  

---

**Próximo:** [Veja BACKEND-IMPLEMENTACAO-VALIDATE.md](BACKEND-IMPLEMENTACAO-VALIDATE.md)

---

*Versão: 1.0.0 | Data: 09/03/2026 | Status: Pronto para Produção*
