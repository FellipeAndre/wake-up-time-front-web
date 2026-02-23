# 🔵 Integração Google OAuth - Wake Up Now

## 📋 Sumário

Guia completo para configurar Google OAuth no frontend e implementar validação no backend Java.

---

## 🎯 Fluxo de Autenticação

```
1. User clica "Começar Agora" na Home
   ↓
2. Redireciona para LoginPage
   ↓
3. User clica "🔵 Google"
   ↓
4. Google OAuth abre dialog
   ↓
5. User autoriza acesso
   ↓
6. Frontend recebe ID Token
   ↓
7. Frontend envia token para backend
   POST /api/auth/google { token: "..." }
   ↓
8. Backend valida token no Google API
   ↓
9. Backend procura user na DB:
   ├─ EXISTE: retorna { success: true, user, token, isNewUser: false }
   └─ NÃO: retorna { success: true, isNewUser: true, userData }
   ↓
10. Frontend:
    ├─ Se isNewUser=false: salva token JWT, redireciona para Videos
    └─ Se isNewUser=true: redireciona para SignupPage
```

---

## ⚙️ Parte 1: Frontend - Configurar Google OAuth

### Opção A: Usar `@react-oauth/google` (RECOMENDADO)

É a forma mais simples. Pero como o projeto está usando React via CDN (não Vite/NPM), usaremos a Google SDK diretamente.

### Opção B: Google SDK Carregado via CDN (ATUAL)

No `index.html`, adicione a biblioteca Google antes dos scripts React:

```html
<head>
    ...
    <!-- Google OAuth Library -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
```

---

## 🔧 Implementação Frontend (JavaScript)

### 1. Carregar Google SDK

Adicione isto no `index.html` *antes* do script React Babel:

```html
<!-- ✦ GOOGLE OAUTH SDK -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 2. Inicializar Google Button

No script Babel (dentro do LoginPage), após a função LoginPage, adicione o inicializador:

```javascript
// Depois que LoginPage está definida...

// Inicializar Google Button quando o DOM estiver pronto
React.useEffect(() => {
    if (window.google && window.google.accounts) {
        google.accounts.id.initialize({
            client_id: 'SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleCallback
        });
        
        // Renderizar o botão Google (opcional, já temos um custom)
        // google.accounts.id.renderButton(document.getElementById('google-button'), {
        //     theme: 'outline',
        //     size: 'large'
        // });
    }
}, []);
```

### 3. Handler do Google Callback

Modifique a função `handleGoogleClick` dentro de LoginPage:

```javascript
const handleGoogleClick = async () => {
    setIsLoading(true);
    setError('');
    try {
        // Abre o Google Sign-In Dialog
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Se prompt falhar, trigger manual
                google.accounts.id.renderButton(
                    document.getElementById('google-button-container')
                );
            }
        });
    } catch (err) {
        setError('❌ Erro ao iniciar Google: ' + err.message);
        setIsLoading(false);
    }
};

// Callback quando user autoriza
function handleGoogleCallback(response) {
    const googleToken = response.credential; // Este é o ID Token
    
    // Enviar para backend
    window.AuthService.validateGoogleToken(googleToken)
        .then(result => {
            if (result.success && !result.isNewUser) {
                // User existe - Login automático
                window.AuthService.saveAuthData(result.user, result.token);
                window.location.reload();
            } else if (result.isNewUser) {
                // User novo - Ir para signup
                sessionStorage.setItem('oauth_data', JSON.stringify({
                    email: result.userData.email,
                    name: result.userData.name,
                    provider: 'google',
                    token: googleToken
                }));
                window.setCurrentViewGlobal('signup');
            }
        })
        .catch(err => {
            document.querySelector('[data-error-element]').textContent = 
                '❌ Erro: ' + err.message;
        });
}

// Registrar callback global
window.handleGoogleCallback = handleGoogleCallback;
```

### 4. HTML do Botão Google

Seu LoginPage já tem um botão custom. Pode manter esse design:

```jsx
<button onClick={handleGoogleClick} disabled={isLoading} className="btn btn-primary" style={{width:'100%'}}>
    🔵 Continuar com Google
</button>
```

Ou usar o botão oficial do Google:

```html
<div id="google-button-container"></div>
```

### 5. Variáveis de Ambiente

Crie um `.env` ou `.env.local` na raiz do projeto:

```bash
REACT_APP_GOOGLE_CLIENT_ID=SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:8080/api
```

Carregue no script:

```javascript
const GOOGLE_CLIENT_ID = 'SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Hardcode ou usar variável
```

---

## 🖥️ Parte 2: Backend Java - Validar Token

### Dependências (Maven)

```xml
<!-- Google Auth Library -->
<dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.11.0</version>
</dependency>

<!-- JWT para backend token -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### Controller Java

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/google")
    public ResponseEntity<?> validateGoogleToken(@RequestBody GoogleTokenRequest request) {
        try {
            // 1. Validar token com Google API
            GoogleIdToken idToken = GoogleIdToken.verify(
                new com.google.auth.oauth2.GoogleCredentials.Builder()
                    .build()
                    .getIdTokenVerifier(),
                request.getToken()
            );
            
            if (idToken == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Token inválido"));
            }
            
            GoogleIdToken.Payload payload = idToken.getPayload();
            
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            
            // 2. Procurar user na DB
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user != null) {
                // User EXISTE - fazer login
                String backendToken = jwtTokenProvider.generateToken(user.getId());
                
                return ResponseEntity.ok(new AuthResponse(
                    true,
                    false, // isNewUser = false
                    user,
                    backendToken
                ));
            } else {
                // User NOVO - retornar dados pra signup
                return ResponseEntity.ok(new AuthResponse(
                    true,
                    true, // isNewUser = true
                    new UserData(email, name)
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                new ErrorResponse("Erro ao validar Google token: " + e.getMessage())
            );
        }
    }
    
    @PostMapping("/apple")
    public ResponseEntity<?> validateAppleToken(@RequestBody AppleTokenRequest request) {
        // Similar ao Google, mas validando token da Apple
        // Implementar conforme Apple Sign In docs
        
        try {
            // 1. Validar token com Apple API
            // ... código de validação ...
            
            // 2. Procurar user na DB (mesmo fluxo)
            
            return ResponseEntity.ok(new AuthResponse(...));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                new ErrorResponse("Erro ao validar Apple token")
            );
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> completeSignup(@RequestBody SignupRequest request) {
        try {
            // 1. Validar CPF
            if (!validateCPF(request.getCpf())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("CPF inválido"));
            }
            
            // 2. Verificar se email já existe
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email já cadastrado"));
            }
            
            // 3. Criar novo user
            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setName(request.getName());
            newUser.setCpf(request.getCpf());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setProvider(request.getProvider()); // "google", "apple", "email"
            newUser.setRole("user");
            newUser.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(newUser);
            
            // 4. Gerar token JWT backend
            String backendToken = jwtTokenProvider.generateToken(newUser.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true,
                newUser,
                backendToken
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Erro ao criar conta: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginEmail(@RequestBody LoginRequest request) {
        try {
            // 1. Procurar user por email
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("Email ou senha incorretos"));
            
            // 2. Validar password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new Exception("Email ou senha incorretos");
            }
            
            // 3. Gerar JWT
            String token = jwtTokenProvider.generateToken(user.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true,
                user,
                token
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Email ou senha incorretos"));
        }
    }
    
    // Validar CPF
    private boolean validateCPF(String cpf) {
        cpf = cpf.replaceAll("\\D", "");
        
        if (cpf.length() != 11) return false;
        
        // Check digit algorithm (modulo 11)
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }
        int digit1 = 11 - (sum % 11);
        digit1 = digit1 >= 10 ? 0 : digit1;
        
        if (digit1 != Character.getNumericValue(cpf.charAt(9))) return false;
        
        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }
        int digit2 = 11 - (sum % 11);
        digit2 = digit2 >= 10 ? 0 : digit2;
        
        return digit2 == Character.getNumericValue(cpf.charAt(10));
    }
}
```

### Modelos Java

```java
// Entidade User
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String cpf;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String provider; // "google", "apple", "email"
    
    @Column(nullable = false)
    private String role; // "user", "admin"
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Getters and Setters...
}

// Request DTOs
public class GoogleTokenRequest {
    private String token; // ID Token do Google
    // Getter/Setter
}

public class SignupRequest {
    private String email;
    private String name;
    private String cpf;
    private String password;
    private String provider; // "google", "apple"
    private String token; // OAuth token original
    // Getters/Setters
}

public class LoginRequest {
    private String email;
    private String password;
    // Getters/Setters
}

// Response DTOs
public class AuthResponse {
    private boolean success;
    private boolean isNewUser;
    private UserData userData;
    private User user;
    private String token;
    
    // Construtores...
    public AuthResponse(boolean success, boolean isNewUser, UserData userData) {
        this.success = success;
        this.isNewUser = isNewUser;
        this.userData = userData;
    }
    
    public AuthResponse(boolean success, User user, String token) {
        this.success = success;
        this.isNewUser = false;
        this.user = user;
        this.token = token;
    }
}

public class UserData {
    private String email;
    private String name;
    // Getters/Setters
}

public class ErrorResponse {
    private boolean success = false;
    private String message;
    // Getters/Setters
}
```

### JWT Token Provider (Java)

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    
    public String generateToken(String userId) {
        return Jwts.builder()
            .subject(userId)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

### application.properties

```properties
# JWT Configuration
jwt.secret=sua_chave_secreta_muito_longa_e_segura_aqui
jwt.expiration=86400000

# Google OAuth
google.client-id=seu_google_client_id.apps.googleusercontent.com

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/wake_up_now
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update

# CORS
server.servlet.context-path=/api
```

### application.yml (alternativa)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wake_up_now
    username: root
    password:
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.dialect.MySQL8Dialect

jwt:
  secret: sua_chave_secretta_muito_longa
  expiration: 86400000

google:
  client-id: seu_google_client_id.apps.googleusercontent.com
```

---

## 🔐 Obter Google Client ID

1. Vá para [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto: "Wake Up Now"
3. Ative a API: **Google+ API**
4. Vá em **Credenciais** → **Criar Credencial** → **ID do Cliente OAuth 2.0**
5. Tipo: **Aplicação Web**
6. URIs autorizados:
   - Origens JavaScript:
     - `http://localhost:3000`
     - `http://localhost:5173` (se Vite)
     - `https://seudominio.com`
   - URIs de redirecionamento autorizados:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://seudominio.com/api/auth/google/callback`
7. Copie o **Client ID**

---

## 🧪 Testar Frontend

### 1. Abra o navegador console (F12)

```javascript
// Verifica se Google SDK foi carregado
window.google ? console.log('✓ Google SDK carregado') : console.log('✗ Falhou');

// Verifica se AuthService existe
window.AuthService ? console.log('✓ AuthService pronto') : console.log('✗ Falhou');
```

### 2. Clique em "Começar Agora"

Você deve ver:
- Página redirecionar para LoginPage
- Botão "🔵 Continuar com Google" visível
- Sem erros no console

### 3. Teste o POST ao backend

```bash
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"fake_token_test"}'
```

Esperado:
```json
{
  "success": false,
  "message": "Token inválido"
}
```

---

## 🐛 Troubleshooting

### Problema: "Google SDK não carregou"
- Verifique internet
- Limpe cache do navegador
- Chrome > Settings > Clear Browsing Data

### Problema: Clica em Google mas nada acontece
- Abra console (F12)
- Procure por erros
- Verificar se `window.google` existe
- Verificar CORS do backend

### Problema: Token é validado mas retorna erro
- Confirmar que tokens fake funcionam primeiro
- Debug token no [jwt.io](https://jwt.io)
- Verificar clock skew (diferença horária servidor/cliente)

### Problema: User novo mas não redireciona para signup
- Verificar sessionStorage: `sessionStorage.getItem('oauth_data')`
- Verificar se `window.setCurrentViewGlobal` está definido
- Abrir console e procurar erros

---

## ✅ Checklist de Implementação

### Frontend
- [ ] Google SDK adicionado em `index.html`
- [ ] Botão "Começar Agora" redireciona para LoginPage
- [ ] LoginPage mostra botão Google
- [ ] Clique no Google abre dialog de autorização
- [ ] Frontend envia token para `/api/auth/google`
- [ ] Resposta de usuário novo mostra SignupPage
- [ ] Resposta de usuário existente faz login automático

### Backend
- [ ] Rota POST `/api/auth/google` implementada
- [ ] Validação de Google token funcionando
- [ ] Procura user na DB por email
- [ ] Retorna resposta JSON correta
- [ ] JWT sendo gerado para users existentes
- [ ] CORS configured para frontend

### Database
- [ ] Tabela `users` criada
- [ ] Índice em `email` único
- [ ] Campo `provider` armazenando OAuth source
- [ ] Campo `cpf` único para users

---

## 📚 Próximos Passos

1. **Implementar Apple OAuth** (similar ao Google)
2. **Adicionar Refresh Token** (expiração mais curta de JWT)
3. **Implementar Middleware de Autenticação** (validar JWT em rotas protegidas)
4. **Adicionar Password Reset** (email com link de reset)
5. **Implementar Rate Limiting** (proteger login contra brute force)

---

## 🔗 Links Úteis

- [Google Sign-In Docs](https://developers.google.com/identity/sign-in/web/sign-in)
- [JWT.io - Debugar tokens](https://jwt.io)
- [Spring Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [Apple Sign In Guide](https://developer.apple.com/sign-in-with-apple/)

---

**Status: PRONTO PARA IMPLEMENTAR** ✅
