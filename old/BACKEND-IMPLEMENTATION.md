# 🚀 Backend Implementation Guide · OAuth Flow

## Endpoints a Implementar (Spring Boot)

### 1. **POST /api/auth/google** — Validar Google OAuth Token

```java
@PostMapping("/google")
public ResponseEntity<?> googleAuth(@RequestBody GoogleAuthRequest request) {
    try {
        // 1️⃣ Valida token com Google
        String email = validateGoogleToken(request.getToken());
        
        if (email == null) {
            return ResponseEntity.status(401)
                .body(new AuthResponse(false, "Token Google inválido"));
        }
        
        // 2️⃣ Busca usuário por email
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        // 3️⃣ Email EXISTE → Faz login
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            String jwtToken = jwtTokenProvider.generateToken(user.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true,          // success
                false,         // isNewUser = false (email existe)
                user,
                jwtToken
            ));
        }
        
        // 4️⃣ Email NÃO EXISTE → Prepara para cadastro
        Map<String, String> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("name", extractNameFromToken(request.getToken()));
        
        return ResponseEntity.ok(new SignupInitResponse(
            true,          // success
            true,          // isNewUser = true
            userData
        ));
        
    } catch (Exception e) {
        log.error("Google auth error: ", e);
        return ResponseEntity.status(400)
            .body(new ErrorResponse("Erro ao validar Google OAuth"));
    }
}

// Helper: Validar token Google
private String validateGoogleToken(String tokenString) {
    try {
        // Opção 1: Usar Google API Client Library
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            JacksonFactory.getDefaultInstance()
        )
            .setAudience(Collections.singletonList(googleClientId))
            .build();
        
        GoogleIdToken idToken = verifier.verify(tokenString);
        
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            return (String) payload.get("email");
        }
        
        // Opção 2: Se usar apenas JWT decode (MENOS SEGURO - só para dev)
        // DecodedJWT decodedToken = JWT.decode(tokenString);
        // return decodedToken.getClaim("email").asString();
        
        return null;
    } catch (Exception e) {
        log.error("Failed to verify Google token: ", e);
        return null;
    }
}
```

---

### 2. **POST /api/auth/apple** — Validar Apple OAuth Token

```java
@PostMapping("/apple")
public ResponseEntity<?> appleAuth(@RequestBody AppleAuthRequest request) {
    try {
        // 1️⃣ Valida token com Apple
        String email = validateAppleToken(request.getToken());
        
        if (email == null) {
            return ResponseEntity.status(401)
                .body(new AuthResponse(false, "Token Apple inválido"));
        }
        
        // 2️⃣ Busca usuário por email
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        // 3️⃣ Email EXISTE → Faz login
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            String jwtToken = jwtTokenProvider.generateToken(user.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true,
                false,  // isNewUser = false
                user,
                jwtToken
            ));
        }
        
        // 4️⃣ Email NÃO EXISTE → Prepara para cadastro
        Map<String, String> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("name", extractNameFromAppleToken(request.getToken()));
        
        return ResponseEntity.ok(new SignupInitResponse(
            true,
            true,  // isNewUser = true
            userData
        ));
        
    } catch (Exception e) {
        log.error("Apple auth error: ", e);
        return ResponseEntity.status(400)
            .body(new ErrorResponse("Erro ao validar Apple OAuth"));
    }
}

// Helper: Validar token Apple
private String validateAppleToken(String tokenString) {
    try {
        // Apple retorna um JWT que pode ser decodificado
        DecodedJWT decodedJWT = JWT.decode(tokenString);
        
        // Verificar assinatura com public keys do Apple
        // GET https://appleid.apple.com/auth/keys
        
        String email = decodedJWT.getClaim("email").asString();
        String emailVerified = decodedJWT.getClaim("email_verified").asString();
        
        // Só aceitar se email foi verificado por Apple
        if ("true".equals(emailVerified)) {
            return email;
        }
        
        return null;
    } catch (Exception e) {
        log.error("Failed to verify Apple token: ", e);
        return null;
    }
}
```

---

### 3. **POST /api/auth/signup** — Completar Cadastro após OAuth

```java
@PostMapping("/signup")
public ResponseEntity<?> completeOAuthSignup(@RequestBody SignupRequest request) {
    try {
        // 1️⃣ Validar dados de entrada
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Email e senha são obrigatórios"));
        }
        
        // 2️⃣ Verificar se email JÁ EXISTE
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409)  // Conflict
                .body(new ErrorResponse("Email já cadastrado"));
        }
        
        // 3️⃣ Validar CPF (formato + dígitos verificadores)
        if (!isValidCPF(request.getCpf())) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("CPF inválido"));
        }
        
        // 4️⃣ IMPORTANTE: Validar token novamente (segurança!)
        String emailFromToken = null;
        if ("google".equals(request.getProvider())) {
            emailFromToken = validateGoogleToken(request.getToken());
        } else if ("apple".equals(request.getProvider())) {
            emailFromToken = validateAppleToken(request.getToken());
        }
        
        // 5️⃣ Garantir que o email do token BATE com o email da requisição
        if (!emailFromToken.equals(request.getEmail())) {
            return ResponseEntity.status(403)
                .body(new ErrorResponse("Token não corresponde ao email fornecido"));
        }
        
        // 6️⃣ Criar novo usuário
        User newUser = new User();
        newUser.setId(UUID.randomUUID().toString());
        newUser.setEmail(request.getEmail());
        newUser.setName(request.getName());
        newUser.setCpf(request.getCpf());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));  // HASH!
        newUser.setOauthProvider(request.getProvider());  // 'google' ou 'apple'
        newUser.setRole("student");
        newUser.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(newUser);
        
        // 7️⃣ Gerar JWT token
        String jwtToken = jwtTokenProvider.generateToken(savedUser.getId());
        
        return ResponseEntity.status(201)  // Created
            .body(new AuthResponse(
                true,
                savedUser,
                jwtToken
            ));
        
    } catch (Exception e) {
        log.error("Signup error: ", e);
        return ResponseEntity.status(500)
            .body(new ErrorResponse("Erro ao criar conta"));
    }
}

// Helper: Validar CPF
private boolean isValidCPF(String cpf) {
    // Remove non-digits
    cpf = cpf.replaceAll("\\D", "");
    
    // Validação básica
    if (cpf.length() != 11) return false;
    if (cpf.matches("(\\d)\\1{10}")) return false;  // Todos dígitos iguais
    
    // Validar dígitos verificadores (cálculo matemático)
    int sum = 0;
    for (int i = 0; i < 9; i++) {
        sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
    }
    int firstDigit = 11 - (sum % 11);
    if (firstDigit > 9) firstDigit = 0;
    
    if (Character.getNumericValue(cpf.charAt(9)) != firstDigit) return false;
    
    // Validar segundo dígito
    sum = 0;
    for (int i = 0; i < 10; i++) {
        sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
    }
    int secondDigit = 11 - (sum % 11);
    if (secondDigit > 9) secondDigit = 0;
    
    return Character.getNumericValue(cpf.charAt(10)) == secondDigit;
}
```

---

### 4. **POST /api/auth/login** — Email/Senha Login

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        // 1️⃣ Buscar usuário por email
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Email ou senha inválidos"));
        }
        
        User user = userOpt.get();
        
        // 2️⃣ Validar senha
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                .body(new ErrorResponse("Email ou senha inválidos"));
        }
        
        // 3️⃣ Gerar JWT token
        String jwtToken = jwtTokenProvider.generateToken(user.getId());
        
        return ResponseEntity.ok(new AuthResponse(
            true,
            user,
            jwtToken
        ));
        
    } catch (Exception e) {
        log.error("Login error: ", e);
        return ResponseEntity.status(500)
            .body(new ErrorResponse("Erro ao fazer login"));
    }
}
```

---

## 📦 Request/Response DTOs

```java
// Request
@Data
public class GoogleAuthRequest {
    private String token;  // Google ID Token
}

@Data
public class AppleAuthRequest {
    private String token;  // Apple Identity Token
}

@Data
public class SignupRequest {
    private String email;
    private String name;
    private String cpf;
    private String password;
    private String provider;  // 'google' ou 'apple'
    private String token;     // OAuth token (para validação)
}

@Data
public class LoginRequest {
    private String email;
    private String password;
}

// Responses
@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private boolean isNewUser;  // null para login comum
    private UserDTO user;
    private String token;
}

@Data
@AllArgsConstructor
public class SignupInitResponse {
    private boolean success;
    private boolean isNewUser;  // sempre true
    private Map<String, String> userData;  // {email, name}
}

@Data
@AllArgsConstructor
public class ErrorResponse {
    private boolean success = false;
    private String message;
}

@Data
public class UserDTO {
    private String id;
    private String email;
    private String name;
    private String role;
}
```

---

## 🔐 Maven Dependencies

```xml
<!-- JWT -->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>4.4.0</version>
</dependency>

<!-- Google OAuth -->
<dependency>
    <groupId>com.google.auth</groupId>
    <artifactId>google-auth-library-oauth2-http</artifactId>
    <version>1.11.0</version>
</dependency>

<!-- Password Encoding -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <version>6.0.0</version>
</dependency>

<!-- Lombok (opcional, para @Data) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

---

## 📋 Configuração (application.yml)

```yaml
spring:
  application:
    name: wake-up-now-api
  
  # Database
  datasource:
    url: jdbc:postgresql://localhost:5432/wake_up_now
    username: postgres
    password: sua_senha
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

# OAuth Credentials
oauth:
  google:
    client-id: sua-google-client-id.apps.googleusercontent.com
  apple:
    team-id: seu-apple-team-id
    bundle-id: com.wakeupnow.ios

# JWT
jwt:
  secret: sua-chave-secreta-muito-comprida-e-aleatoria-min-256-bits
  expiration: 86400000  # 24 horas em ms

server:
  port: 8080
  error:
    include-message: always
```

---

## ✅ Fluxo Testável com Postman

### 1. Testar Google OAuth
```
POST http://localhost:8080/api/auth/google
Content-Type: application/json

{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4OWE4ZTExYTkwMTY..."
}
```

**Resposta (Email EXISTE):**
```json
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "user-123",
    "email": "joao@email.com",
    "name": "João Silva",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (Email NÃO EXISTE):**
```json
{
  "success": true,
  "isNewUser": true,
  "userData": {
    "email": "novo@email.com",
    "name": "Novo Usuário"
  }
}
```

### 2. Testar Signup Completo
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "email": "novo@email.com",
  "name": "Novo Usuário",
  "cpf": "12345678901",
  "password": "SenhaSegura123!",
  "provider": "google",
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4OWE4ZTExYTkwMTY..."
}
```

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": "user-456",
    "email": "novo@email.com",
    "name": "Novo Usuário",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

## 🎯 Resumo

| Endpoint | Quando | Verifica | Resposta |
|----------|--------|----------|----------|
| `/auth/google` | Click "Google" | Email existe? | `isNewUser: true/false` |
| `/auth/apple` | Click "Apple" | Email existe? | `isNewUser: true/false` |
| `/auth/signup` | Submit cadastro | Valida dados | User + JWT |
| `/auth/login` | Email/senha | Valida credenciais | User + JWT |

