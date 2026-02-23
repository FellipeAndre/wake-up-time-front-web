# 🚀 Como Rodar o Projeto — Guia Rápido

**Problema resolvido:** Estrutura do React Router corrigida ✅

---

## ⚡ Passo a Passo (5 minutos)

### 1️⃣ Abra o Terminal

```bash
# Windows PowerShell ou Cmd
cd c:\Users\felip\Projeto\wake-up-time-front-web\wake-up-web
```

### 2️⃣ Instale as dependências (primeira vez apenas)

```bash
npm install
```

Isso vai baixar todas as bibliotecas (React, Vite, axios, etc).

### 3️⃣ Inicie o servidor de desenvolvimento

```bash
npm run dev
```

**Resultado esperado:**
```
➜  Local:   http://localhost:3000
➜  press h to show help
```

### 4️⃣ Abra no navegador

- Clique no link: `http://localhost:3000`
- Ou copie/cole na barra de endereço do seu navegador
- **O navegador abre automaticamente**

---

## ✅ Você deveria ver:

- ✅ **Fundo preto/escuro** (não mais branco!)
- ✅ **Sidebar à direita** com logo "Wake Up Now"
- ✅ **Menu com opções:** Home, Vídeos, Upload, Pagamento
- ✅ **Topbar (barra superior)** com título
- ✅ **Conteúdo da página** na central

Se vir tudo isso → **Está funcionando!** 🎉

---

## 🔧 Se ainda estiver branco:

### ❌ Problema 1: "Cannot find module"

**Erro:** `Cannot find module './routes/router'`

**Solução:**
```bash
# Cancele o servidor (Ctrl + C)
# Remova a pasta node_modules
rm -r node_modules

# Reinstale
npm install

# Inicie de novo
npm run dev
```

---

### ❌ Problema 2: "CORS error" ou "Failed to fetch"

**Mensagem:** `GET http://localhost:8080/api/... (CORS error)`

**Solução:**
- Seu backend Spring Boot precisa estar rodando
- Execute em outro terminal:
  ```bash
  # Navue até seu projeto Backend
  cd [seu-projeto-backend]
  # Inicie Spring Boot (ex: Maven)
  mvn spring-boot:run
  ```

**Ou desative a chamada de dados:**
- Abra `src/pages/Home.jsx`
- Comente as linhas que chamam `homeService`
- Deixe somente o layout aparecer por enquanto

---

### ❌ Problema 3: "Cannot find './style.css'"

**Solução:**
- Verifique se `src/style.css` existe
- Se não existir, copie de `wake-up-web/src/style.css`

---

### ❌ Problema 4: Porta 3000 já está em uso

**Erro:** `EADDRINUSE: address already in use :::3000`

**Solução:**
```bash
# Mude a porta no vite.config.js
# Abra o arquivo e altere:
# port: 3001  (ao invés de 3000)

# Ou mate o processo:
# Windows
netstat -ano | findstr :3000
taskkill /PID [numero] /F

# macOS/Linux
lsof -i :3000
kill -9 [PID]
```

---

## 📱 Testando a Página

Depois que carregar:

### 1. Teste o Menu (Sidebar)
- Clique em "Home" → deve ir para Home
- Clique em "Videos" → deve ir para Vídeos (em branco por enquanto)
- Clique em "Sair" → deve deslogar

### 2. Abra o DevTools (F12)
- **Console:** Vê mensagens de erro?
- **Network:** As requisições HTTP estão passando?
- **React DevTools:** Consegue ver a estrutura de componentes?

### 3. Verifique os Estilos
- Sidebar tem fundo escuro?
- Texto está legível (cor clara)?
- Cores estão corretas (magenta/roxo)?

---

## 🎯 Próximos Passos

Depois que estiver rodando:

1. **Visualizar o código:**
   - Abra `src/pages/Home.jsx`
   - Abra `src/components/layout/Layout.jsx`
   - Veja a estrutura de componentes

2. **Testar navegação:**
   - Clique em "Ir para Cadastro" (no hero)
   - Veja as rotas mudarem na URL

3. **Personalizar:**
   - Mude cores em `src/style.css`
   - Mude texto em `src/components/layout/Layout.jsx`
   - Veja mudanças em tempo real (hot reload)

---

## 🚨 Comandos Úteis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot reload |
| `npm run build` | Cria versão otimizada para produção (pasta `dist/`) |
| `npm run preview` | Visualiza a versão de produção localmente |
| `npm install` | Instala dependências do `package.json` |
| `npm update` | Atualiza pacotes para versões mais novas |

---

## 🎨 Customizações Rápidas

### Mudar a cor principal (magenta → outra cor)
Abra `src/style.css` e mude:
```css
--acento: #ff006d;  /* Mude este valor */
```

### Mudar o nome do app
Abra `src/components/layout/Layout.jsx` e mude:
```jsx
<h1>Wake Up Now</h1>  {/* Mude para seu nome */}
```

### Mudar tamanho da sidebar
Abra `src/style.css` e mude:
```css
--sidebar-width: 260px;  /* Mude para outro tamanho */
```

---

## 📊 Seu Ambiente

```
projeto/
├── wake-up-web/          ← Seu projeto React
│   ├── src/              ← Código-fonte
│   │   ├── pages/        ← Páginas (Home, Login, etc)
│   │   ├── components/   ← Componentes reutilizáveis
│   │   ├── services/     ← Lógica HTTP
│   │   ├── routes/       ← Navegação
│   │   └── style.css     ← Estilos globais
│   ├── index.html        ← Entry point HTML
│   ├── package.json      ← Dependências
│   └── vite.config.js    ← Configuração Vite
│
└── Backend/              ← Seu Spring Boot (em outro local)
```

---

## 💡 Dica: Hot Reload

Enquanto `npm run dev` está rodando:

1. Mude qualquer arquivo `.jsx` ou `.css`
2. Salve (Ctrl + S)
3. **Navegador atualiza automaticamente em ~100ms** ✨
4. Seu estado não é perdido (hot module reload)

Isso é **muito mais rápido** que o setup antigo!

---

## ✅ Checklist de Sucesso

- [ ] Terminal aberto na pasta `wake-up-web`
- [ ] Ran `npm install` (completou sem erros)
- [ ] Ran `npm run dev` (servidor iniciou)
- [ ] Navegador abriu em `http://localhost:3000`
- [ ] Página carregou (não está branca!)
- [ ] Vejo Sidebar, Topbar e conteúdo
- [ ] Menu funciona (cliques navegam)
- [ ] DevTools abre sem erro no console

Se todo o checklist ✅, **está perfeito!**

---

## 📞 Se falhar algo:

1. **Verifique o terminal** — qual erro exato aparece?
2. **Leia o console do navegador** (F12) — qual erro?
3. **Copie o erro** e procure neste guia ou no GUIA-VITE-REACT.md

---

**Boa sorte! 🚀✨**

Se ficar com dúvidas, abra `GUIA-VITE-REACT.md` (troubleshooting completo!)
