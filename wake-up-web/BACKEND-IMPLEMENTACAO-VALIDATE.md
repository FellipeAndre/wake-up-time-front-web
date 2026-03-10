# 🔧 Implementação Backend - Endpoint GET /auth/validate

Este arquivo mostra como implementar o endpoint **GET /auth/validate** no backend (Spring Boot).

---

## 📋 Requisitos

- [[x] Token JWT válido em Authorization header (Bearer token)
- [ ] Validar token com secret
- [ ] Retornar { valid: true } se válido
- [ ] Retornar 401 se inválido/expirado

---

## 🛠️ Implementação Spring Boot

### 1. Controller (AuthController.java)

```java
package com.wakeupnow.controller;

import com.wakeupnow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  /**
   * GET /auth/validate
   * 
   * Valida se o JWT token é válido
   * Esperado: Authorization: Bearer eyJhbGc...
   * 
   * Response (200):
   * { "valid": true }
   * 
   * Response (401):
   * { "message": "Token inválido ou expirado" }
   */
  @GetMapping("/validate")
  @PreAuthorize("isAuthenticated()")  // Spring Security verifica o token
  public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String bearerToken) {
    try {
      // Extrair token sem "Bearer " prefix
      String token = bearerToken.replace("Bearer ", "");
      
      // Validar token
      if (jwtTokenProvider.validateToken(token)) {
        return ResponseEntity.ok(new ValidateResponse(true));
      } else {
        return ResponseEntity.status(401)
          .body(new ErrorResponse("Token inválido ou expirado"));
      }
      
    } catch (Exception e) {
      return ResponseEntity.status(401)
        .body(new ErrorResponse("Erro ao validar token: " + e.getMessage()));
    }
  }

  // Classes helper
  public static class ValidateResponse {
    public boolean valid;
    
    public ValidateResponse(boolean valid) {
      this.valid = valid;
    }
  }

  public static class ErrorResponse {
    public String message;
    
    public ErrorResponse(String message) {
      this.message = message;
    }
  }
}
```

---

### 2. Service (JwtTokenProvider.java)

Se você já tem um `JwtTokenProvider` ou `JwtUtils`, adicione este método:

```java
package com.wakeupnow.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtTokenProvider {

  private String jwtSecret = "sua-chave-secreta-super-segura"; // Use variável de ambiente
  private long jwtExpirationMs = 86400000; // 24 horas em ms

  /**
   * Validar JWT token
   * 
   * @param token JWT token string
   * @return true se válido, false se inválido/expirado
   */
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
        .setSigningKey(jwtSecret.getBytes())
        .build()
        .parseClaimsJws(token);
      
      return true; // Token válido
      
    } catch (SecurityException e) {
      System.err.println("Token JWT inválido: " + e.getMessage());
      return false;
    } catch (MalformedJwtException e) {
      System.err.println("Token JWT inválido: " + e.getMessage());
      return false;
    } catch (ExpiredJwtException e) {
      System.err.println("Token JWT expirado: " + e.getMessage());
      return false;
    } catch (UnsupportedJwtException e) {
      System.err.println("Token JWT não suportado: " + e.getMessage());
      return false;
    } catch (IllegalArgumentException e) {
      System.err.println("Claims JWT vazio: " + e.getMessage());
      return false;
    }
  }

  /**
   * Extrair email do token
   */
  public String getEmailFromToken(String token) {
    return Jwts.parserBuilder()
      .setSigningKey(jwtSecret.getBytes())
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }
}
```

---

### 3. Security Configuration (SecurityConfig.java)

Certifique-se que sua Spring Security config valida tokens JWT:

```java
package com.wakeupnow.config;

import com.wakeupnow.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Autowired
  private JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors()
      .and()
      .csrf().disable()
      .exceptionHandling().and()
      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .authorizeRequests()
        // Rotas públicas
        .antMatchers("/api/auth/login", "/api/auth/register", "/api/users").permitAll()
        // GET /auth/validate requer autenticação
        .antMatchers("/api/auth/validate").authenticated()
        // Outras rotas
        .antMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      .and()
      // Adicionar JWT filter
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
```

---

### 4. JWT Filter (JwtAuthenticationFilter.java)

```java
package com.wakeupnow.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtTokenProvider tokenProvider;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    
    try {
      String jwt = getJwtFromRequest(request);
      
      if (jwt != null && tokenProvider.validateToken(jwt)) {
        String email = tokenProvider.getEmailFromToken(jwt);
        
        // Criar autenticação
        UsernamePasswordAuthenticationToken auth = 
          new UsernamePasswordAuthenticationToken(
            email, null, null // null roles, use seus roles reais
          );
        
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (Exception ex) {
      System.err.println("Erro ao processar JWT: " + ex.getMessage());
    }
    
    filterChain.doFilter(request, response);
  }

  /**
   * Extrair JWT do header Authorization
   */
  private String getJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7); // Remove "Bearer "
    }
    
    return null;
  }
}
```

---

## 🧪 Teste com cURL

```bash
# 1. Login para obter token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": 1, "email": "user@example.com", ... }
# }

# 2. Validar token obtido
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response (200):
# { "valid": true }

# 3. Validar token inválido
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer invalid-token"

# Response (401):
# { "message": "Token inválido ou expirado" }

# 4. Sem token
curl -X GET http://localhost:8080/api/auth/validate

# Response (401):
# { "message": "Unauthorized" }
```

---

## 📦 Dependências (pom.xml)

Certifique-se de ter:

```xml
<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.11.5</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.11.5</version>
  <scope>runtime</scope>
</dependency>

<!-- Spring Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## 🔐 Variáveis de Ambiente (.env ou application.properties)

```properties
# JWT Configuration
JWT_SECRET=sua-chave-secreta-super-segura-de-pelo-menos-32-caracteres
JWT_EXPIRATION_MS=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
SERVER_PORT=8080
```

---

## 📝 Resumo

| Componente | Responsabilidade |
|-----------|------------------|
| AuthController | Expõe endpoint GET /auth/validate |
| JwtTokenProvider | Valida JWT token com secret |
| SecurityConfig | Configura Spring Security |
| JwtAuthenticationFilter | Extrai e valida token de requisições |

---

## ✅ Checklist

- [ ] AuthController implementado com GET /auth/validate
- [ ] JwtTokenProvider com método validateToken()
- [ ] SecurityConfig configured  
- [ ] JwtAuthenticationFilter criado
- [ ] Dependências JWT no pom.xml
- [ ] Variáveis de ambiente configuradas
- [ ] Testado com cURL
- [ ] Frontend conecta e valida o token

---

## 🎯 Fluxo Final

```
Frontend (React)
  ↓
Login.jsx chama POST /auth/login
  ↓
Backend retorna { token, user }
  ↓
Login.jsx chama GET /auth/validate (Bearer token)
  ↓
JwtAuthenticationFilter valida token
  ↓
AuthController.validateToken retorna { valid: true }
  ↓
Frontend salva token e redireciona para home
  ✅ SUCESSO!
```

---

**Versão:** 1.0.0  
**Data:** 09/03/2026  
**Status:** Exemplo de Implementação
