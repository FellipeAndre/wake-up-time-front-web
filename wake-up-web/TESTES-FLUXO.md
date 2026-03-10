# 🧪 Plano de Testes - Fluxo de Autenticação

**Data:** 09/03/2026  
**URL:** http://localhost:3000  
**Status:** Em Testes

---

## ✅ TESTE 1: Cadastro → Login

### Passos:
1. Abra http://localhost:3000
2. Clique em "Criar Conta"
3. Preencha:
   - Email: `teste@example.com`
   - Nome: `João Silva`
   - Senha: `senha123`
4. Clique "Cadastrar"

### Resultados Esperados:
- ✅ Redireciona para `/login`
- ✅ Mensagem: "Cadastro realizado com sucesso!"
- ✅ Email pré-preenchido: `teste@example.com`
- ✅ localStorage.wun_token existe

### DevTools:
```javascript
// Console do navegador (F12)
localStorage.getItem('wun_token')  // → deve ter valor JWT
```

**Status:** ⏳ Pendente

---

## ✅ TESTE 2: Login com Validação de Token

### Passos:
1. Já em `/login` (do teste anterior)
2. Preencha Senha: `senha123`
3. Abra DevTools → Network (F12)
4. Clique "Entrar"

### Resultados Esperados:
- ✅ POST /api/auth/login → 200 OK
- ✅ GET /api/auth/validate → 200 OK (⭐ NOVO!)
- ✅ Redireciona para `/` (home)
- ✅ localStorage.wun_token atualizado

### Network esperado:
```
1. POST /api/auth/login
   Response: { "token": "eyJ...", "user": {...} }

2. GET /api/auth/validate
   Request Headers: Authorization: Bearer eyJ...
   Response: { "valid": true }
```

**Status:** ⏳ Pendente

---

## ✅ TESTE 3: ProtectedRoute - SEM Token

### Passos:
1. Abra DevTools (F12)
2. Vá em: Application → localStorage
3. Delete: `wun_token`
4. Navegue para: http://localhost:3000/upload

### Resultados Esperados:
- ✅ Redireciona para `/login` (automaticamente)
- ✅ NÃO carrega conteúdo da página Upload
- ✅ ProtectedRoute funcionando ✔️

**Status:** ⏳ Pendente

---

## ✅ TESTE 4: ProtectedRoute - COM Token

### Passos:
1. Faça login novamente (Teste 2)
2. Navegue para: http://localhost:3000/upload
3. Verifique se carrega normalmente

### Resultados Esperados:
- ✅ Página Upload.jsx carrega
- ✅ Sem redirecionamento
- ✅ Componente renderizado

**Status:** ⏳ Pendente

---

## ✅ TESTE 5: Token Persistência

### Passos:
1. Faça login (Teste 2)
2. Acesse http://localhost:3000/upload
3. Pressione F5 (recarregar página)

### Resultados Esperados:
- ✅ Página continua carregada (não redireciona)
- ✅ token no localStorage persiste
- ✅ AuthContext restaura o token

**Status:** ⏳ Pendente

---

## ⚠️ TESTE 6: Erro - Token Inválido

### Passos:
1. DevTools → Application → localStorage
2. `wun_token` → editar valor: adicionar letras aleatórias
3. Tente fazer login com credenciais válidas

### Resultados Esperados:
- ✅ GET /auth/validate retorna 401
- ✅ Login.jsx mostra erro: "Token inválido"
- ✅ Usuário pode tentar novamente

**Status:** ⏳ Dependente (backend precisa estar retornando 401)

---

## 📊 Resumo de Testes

| # | Teste | Status | Notas |
|---|-------|--------|-------|
| 1 | Cadastro → Login | ⏳ | Deve redirecionar |
| 2 | Login com validação | ⏳ | Valida token |
| 3 | ProtectedRoute (sem token) | ⏳ | Redireciona login |
| 4 | ProtectedRoute (com token) | ⏳ | Acessa normalmente |
| 5 | Persistência token | ⏳ | Recarregar F5 |
| 6 | Token inválido | ⏳ | Dependente backend |

---

## 🔧 Troubleshooting

### Erro 1: "POST /api/auth/login 404"
- [ ] Backend não está rodando?
- [ ] URL da API está correta? (verificar `src/services/api.js`)
- [ ] Backend Porta: 8080?

### Erro 2: "GET /api/auth/validate 404"
- [ ] Endpoint não existe no backend
- [ ] Veja: BACKEND-IMPLEMENTACAO-VALIDATE.md

### Erro 3: "Não redireciona after cadastro"
- [ ] Não está salvando em localStorage?
- [ ] Console tem erro de JavaScript?
- [ ] Verificar em DevTools → Console

### Erro 4: "ProtectedRoute não bloqueia"
- [ ] AuthContext.token é null?
- [ ] localStorage.wun_token existe?
- [ ] Verificar: React DevTools → Providers

---

## 📱 Dados de Teste

### Usuário Válido (após cadastro):
```
Email: teste@example.com
Senha: senha123
```

### Usuário Teste 2 (criar novo):
```
Email: usuario2@example.com
Senha: senha456
Nome: Maria
```

---

## 📹 Passos Rápidos

```bash
# 1. Abra http://localhost:3000
# 2. Clique "Criar Conta"
# 3. Preencha dados e clique "Cadastrar"
# 4. ✅ Deve ir para /login com mensagem
# 5. Preencha senha e clique "Entrar"
# 6. ✅ Deve ir para home
# 7. Acesse /upload
# 8. ✅ Deve carregar sem erro
```

---

## 🎯 Critério de Sucesso

✅ **Todos os 5 testes passam** → Sistema está funcionando!

---

**Próxima Ação:** Comece pelo TESTE 1

*Atualize este arquivo com status enquanto testa*
