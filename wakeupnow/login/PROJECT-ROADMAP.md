# 🗺️ PROJECT ROADMAP - WAKE UP NOW Frontend

## Fases de Desenvolvimento

```
FASE 0: Login ✅ COMPLETA
├─ Autenticação básica (email+senha)
├─ Cadastro de usuário
├─ Validações frontend
├─ localStorage de token
└─ API integration layer

        ↓↓↓

FASE 1: Refatoração (Próxima) ⏳ IN PROGRESS
├─ Refatorar cadastro/ com padrão login
├─ Refatorar upload/ com nomeclatura clara
├─ Refatorar videos/ com nomenclatura
└─ Refatorar pagamento/ com nomenclatura

        ↓↓↓

FASE 2: Features Adicionais (Depois)
├─ Logout funcional
├─ "Esqueceu a senha?" flow
├─ Social login (Google, Apple)
├─ 2FA (autenticação de 2 fatores)
└─ Account settings page

        ↓↓↓

FASE 3: React Migration (Opcional)
├─ Migrar componentes complexos para React
├─ Context API para estado global
├─ Testes automatizados
└─ Performance otimizações

        ↓↓↓

FASE 4: Produção
├─ Deploy na Vercel/Netlify
├─ DNS e domínio custom
├─ HTTPS obrigatório
├─ Monitoramento e analytics
└─ Feedback de usuários
```

---

## Timeline Sugerida

| Fase | Tempo | Prioridade | Status |
|------|:---:|:---:|:---:|
| **0. Login** | 1-2 semanas | 🔴 CRÍTICO | ✅ Completa |
| **1. Refatoração** | 2-3 semanas | 🔴 CRÍTICO | ⏳ Pronta para iniciar |
| **2. Features extras** | 2-4 semanas | 🟡 Alto | 📋 Roadmap pronto |
| **3. React Migration** | 3-4 semanas | 🟢 Médio | 📋 Opcional |
| **4. Produção** | 1-2 semanas | 🔴 CRÍTICO | 📋 Depois de 1 e 2 |

---

## FASE 1: Refatoração Detalhada (PRÓXIMO PASSO)

### Objetivo Geral
Aplicar os MESMOS padrões do módulo `login/` nos outros módulos:
- ✅ Nomenclatura clara de variáveis
- ✅ Organização em seções lógicas
- ✅ Comentários em português
- ✅ Separação de responsabilidades
- ✅ Integração com api-service.js

### Módulo: `cadastro/` 

**Situação Atual**:
```javascript
// ❌ Variáveis pobres
let nome = '', email = '', cpf = '', senha = '';
function validar() { ... }
function enviar() { ... }
```

**Depois da Refatoração**:
```javascript
// ✅ Estados claros
const RegistrationState = {
  userFirstName: '',
  userLastName: '',
  userEmail: '',
  userCPF: '',
  userPassword: '',
  isProcessing: false
};

// ✅ Validações nomeadas
function isValidFirstName(firstName) { ... }
function validateRegistrationForm() { ... }

// ✅ Handlers claros
function handleRegisterSubmit() { ... }
function displayRegistrationError(message) { ... }
```

**Duração**: 2-3 horas

### Módulo: `upload/`

**Situação Atual**:
```javascript
// ❌ Nomes genéricos
let dz = new Dropzone();
let file = ...;
function upload() { ... }
```

**Depois da Refatoração**:
```javascript
// ✅ Descritivos
const videoUploadZone = new Dropzone();
const selectedVideoFile = ...;

// ✅ Funções específicas
function initializeVideoDropzone() { ... }
function handleVideoUpload(videoFile) { ... }
function applyVideoMetadataDisplay(file) { ... }
```

**Duração**: 2-3 horas

### Módulo: `videos/`

**Situação Atual**:
```javascript
// ❌ Estrutura confusa
const videos = [...];
function filter(q) { ... }
function search(t) { ... }
```

**Depois da Refatoração**:
```javascript
// ✅ Organização clara
const VideoLibraryState = {
  allVideos: [...],
  filteredVideos: [...],
  currentThemeFilter: null,
  searchQuery: ''
};

// ✅ Operações específicas
function filterVideosByTheme(themeId) { ... }
function searchVideosByTitle(query) { ... }
function displayVideoLibrary() { ... }
```

**Duração**: 3-4 horas

### Módulo: `pagamento/`

**Situação Atual**:
```javascript
// ❌ Estrutura confusa
let plano = null;
let metodo = 'card';
function pagar() { ... }
```

**Depois da Refatoração**:
```javascript
// ✅ Estado claro
const PaymentState = {
  selectedPlan: null,
  selectedPaymentMethod: 'creditCard',
  formData: { ... },
  isProcessing: false
};

// ✅ Funções nomeadas
function selectPaymentPlan(planId) { ... }
function handlePaymentMethodChange(method) { ... }
function submitPaymentRequest() { ... }
function displayPaymentSuccess(orderId) { ... }
```

**Duração**: 3-4 horas

---

## Checklist de Refatoração

Aplicável a CADA módulo:

```
[ ] 1. Renomear variáveis (de `v` → `loginEmailValue`)
[ ] 2. Criar objeto State (como `AuthenticationState`)
[ ] 3. Organizar em seções (Validação, Handlers, API, etc)
[ ] 4. Adicionar JSDoc comments (português)
[ ] 5. Extrair APIs para api-service.js
[ ] 6. Testar funcionalmente
[ ] 7. Atualizar style.css se necessário (usar tokens)
[ ] 8. Testar responsividade mobile
[ ] 9. Fazer commit com mensagem clara
[ ] 10. Code review (ou auto-review)
```

---

## FASE 2: Features Extras

### Feature 1: Logout Funcional

**Arquivo afetado**: `home/` (novo botão) + `login/` (função)

```javascript
// No home.js ou menu
function handleLogout() {
  // 1. Limpar localStorage
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  
  // 2. Limpar estado da aplicação
  AuthContext.clear();
  
  // 3. Redirecionar para login
  navigateTo('login');
}
```

**Tempo**: 30 minutos

---

### Feature 2: Password Reset Flow

**Arquivos novos**:
- `login/forgot-password.html` - Formulário
- `login/forgot-password.css` - Estilos
- `login/forgot-password.js` - Lógica

**Fluxo**:
```
Usuário clica "Esqueceu senha?"
    ↓
Preenche email
    ↓
Backend envia email com link (com token)
    ↓
Usuário clica link no email
    ↓
Abre formulário de reset (valida token)
    ↓
Cria nova senha
    ↓
Login com nova senha
```

**Endpoints necessários**:
- `POST /api/auth/forgot-password` (envia email)
- `POST /api/auth/reset-password` (altera senha)

**Tempo**: 4-6 horas

---

### Feature 3: Social Login

**Bibliotecas necessárias**:
```bash
npm install @react-oauth/google @react-apple-id
```

**Arquivos a atualizar**:
- `Login.jsx` ou `login.js` - Adicionar botões
- `api-service.js` - Funções `loginWithGoogle()`, `loginWithApple()`

**Endpoints necessários**:
- `POST /api/auth/google` (valida token Google)
- `POST /api/auth/apple` (valida token Apple)

**Configurações**:
- Google OAuth: ID de projeto em console.cloud.google.com
- Apple: ID de App em developer.apple.com

**Tempo**: 6-8 horas

---

### Feature 4: 2FA (Two-Factor Authentication)

**Fluxo**:
```
Login padrão (email + senha) OK
    ↓
Backend envia código por SMS ou email
    ↓
Usuário vê tela "Digite o código"
    ↓
Usuário digita código de 6 dígitos
    ↓
Backend valida código
    ↓
Retorna token JWT
```

**Tempo**: 8-10 horas

---

## FASE 3: React Migration (Se decidir)

**Decisão**: Migrar de HTML/CSS/JS vanilla para **React full**

### Benefícios
✅ Melhor performance  
✅ Mais fácil adicionar features  
✅ Reutilização de componentes  
✅ Estado global com Context  

### Desvantagens
❌ +40KB no bundle  
❌ Precisa build step  
❌ Curva de aprendizado se equipe é backend  

### Componentes a Migrar (por prioridade)

| # | Módulo | Complexidade | Benefício |
|---|--------|:---:|:---:|
| 1 | login | 🟡 Média | ⭐⭐⭐ |
| 2 | videos | 🟡 Média | ⭐⭐⭐ |
| 3 | pagamento | 🔴 Alta | ⭐⭐⭐ |
| 4 | upload | 🟡 Média | ⭐⭐ |
| 5 | home | 🟢 Simples | ⭐ |
| 6 | cadastro | 🟢 Simples | ⭐ |

---

## FASE 4: Produção

### Checklist Pré-Deploy

- [ ] Backend rodando em servidor
- [ ] Frontend build otimizado (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS ativado
- [ ] CORS configurado corretamente
- [ ] Testes manuais completos
- [ ] Performance otimizada (Lighthouse score >90)
- [ ] SEO configurado (meta tags, og:image)
- [ ] Monitoramento ativado (Sentry, LogRocket)
- [ ] Backup de dados configurado
- [ ] Plano de disaster recovery
- [ ] Documentação atualizada

### Deploy Recomendado

**Frontend Hosting**: Vercel ou Netlify (gratuito para começar)
```bash
npm run build
# Deploy automático em cada push para main
```

**Backend Hosting**: AWS, Azure, ou DigitalOcean
```bash
docker build .
docker push registry/wake-up-now:latest
# Deploy em container
```

**Database**: Cloud (MongoDB Atlas, Amazon RDS, etc.)

**Email Service**: SendGrid, Mailgun (para password reset)

**Storage**: S3 ou similiar (para vídeos e uploads)

---

## Arquitetura Final (APÓS TODAS AS FASES)

```
┌─────────────────────────────────────┐
│  WAKE UP NOW - Arquitetura Final    │
├─────────────────────────────────────┤
│                                     │
│  Frontend (React + Vite)            │
│  ├─ Home (Simples)                  │
│  ├─ Login (Complex, Refatorado) ✅ │
│  ├─ Cadastro (Refatorado) ⏳        │
│  ├─ Videos (React Component) ⏳     │
│  ├─ Upload (React Component) ⏳     │
│  ├─ Pagamento (React Component) ⏳  │
│  └─ Context API (Auth + State)      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Backend (Spring Boot)              │
│  ├─ /api/auth/*                     │
│  ├─ /api/videos/*                   │
│  ├─ /api/payment/*                  │
│  ├─ /api/user/*                     │
│  └─ JWT Auth                        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Database                           │
│  ├─ Users                           │
│  ├─ Videos                          │
│  ├─ Orders                          │
│  └─ Transactions                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Infra                              │
│  ├─ Vercel/Netlify (Frontend)       │
│  ├─ AWS/Azure/DO (Backend)          │
│  ├─ MongoDB/PostgreSQL (Database)   │
│  └─ SendGrid (Email)                │
│                                     │
└─────────────────────────────────────┘
```

---

## Métricas de Sucesso

### Performance
- ✅ Lighthouse score > 85
- ✅ Tempo de carregamento < 2s
- ✅ FCP (First Contentful Paint) < 1.5s

### Segurança
- ✅ HTTPS obrigatório
- ✅ CORS configurado
- ✅ Sanitização de inputs
- ✅ Rate limiting no backend

### UX
- ✅ Responsivo em mobile/tablet/desktop
- ✅ Acessibilidade WCAG AA
- ✅ Tempo de interação < 100ms

### Escalabilidade
- ✅ Suportar 10k+ usuários simultâneos
- ✅ API response time < 200ms
- ✅ Database queries otimizadas

---

## Orçamento Estimado

| Item | Custo | Notas |
|------|:---:|---|
| **Desenvolvimento** | $$$$ | 4-6 semanas |
| **Testing** | $$$ | Testes manual + automatizados |
| **Deployment** | $ | Vercel free, AWS minimal |
| **Domínio** | $ | ~$12/ano |
| **Email Service** | $ | SendGrid free até 100/dia |
| **Analytics** | $ | Google Analytics free |
| **Monitoramento** | $$ | Sentry basic |
| **Total primeiro mês** | $500-1500 | Muito variável |

---

## Conclusão

Este roadmap é **flexível**:
- Pode pular Fase 3 se não precisar React
- Pode focar em cores específicas (ex: apenas pagamento)
- Pode acelerar/desacelerar conforme budget
- Pode paralelizar algumas tarefas

**Recomendação**: 
1. ✅ **Hoje**: Login pronto (Fase 0)
2. ⏳ **Esta semana**: Refatorar cadastro (Fase 1)
3. ⏳ **Próxima semana**: Refatorar upload, videos, pagamento (Fase 1)
4. ⏳ **Semana 3**: Adicionar features (Fase 2)
5. ⏳ **Semana 4-5**: Deploy em produção (Fase 4)

**Total**: 4-5 semanas para MVP em produção.

---

**Criado por**: AI Agent  
**Data**: 2025  
**Status**: 📋 Roadmap confirmado  
**Versão**: 1.0
