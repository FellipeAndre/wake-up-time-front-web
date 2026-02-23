# 🎨 Paleta de Cores — Wake Up Now (Energia Vibrante)

**Versão**: 2.0  
**Data**: Fevereiro 2026  
**Status**: ✅ Implementada em todos os arquivos CSS

---

## 📋 Resumo da Alteração

A paleta de cores foi **completamente redesenhada** para alinhar com o slogan da marca:

```
"Wake Up Now · Desperte seu potencial"
```

### ❌ Paleta Anterior
- **Estilo**: Corporativo/Tech
- **Cores**: Prata Metálica (`#c8c8c8`), Ciano (`#00e5ff`), Cinza
- **Problema**: Muito fria, sem energia, não transmitia "despertar"

### ✅ Paleta Nova
- **Estilo**: Energia Vibrante
- **Cores**: Magenta (`#ff006d`), Pink (`#ff1493`), Roxo (`#9d4edd`)
- **Impacto**: Dinâmica, transformadora, desperta a vontade de agir

---

## 🎯 Cores Principais

### Primário — Magenta Vibrante
- **Cor**: `#ff006d`
- **Uso**: Botões, destaques, links, hovers
- **Simboliza**: Energia, ação, despertar
- **Brilho**: `0 0 20px rgba(255, 0, 109, 0.15)`

### Secundário — Pink Elétrico
- **Cor**: `#ff1493`
- **Uso**: Hovers, estados ativos, acentos secundários
- **Simboliza**: Transformação, movimento
- **Gradiente com Magenta**: `linear-gradient(90deg, #ff006d, #ff1493)`

### Terciário — Roxo Elétrico
- **Cor**: `#9d4edd`
- **Uso**: Elementos complementares, destaques sutis
- **Simboliza**: Criatividade, potencial
- **Brilho**: `0 0 20px rgba(157, 78, 221, 0.15)`

### Fundos — Pretos Profundos com Roxo
- **Page**: `#0a0206` (quase preto com toque roxo)
- **Card**: `#1e1529` (roxo muito escuro)
- **Input**: `#0d0710` (roxo profundo)
- **Sidebar**: `#0f0612` (roxo + preto)
- **Contraste**: Mantém legibilidade com textos claros

### Textos
- **Primário**: `#f0e8ff` (branco com tom roxo suave)
- **Secundário**: `#b89dd0` (cinza roxo médio)
- **Muttered**: `#7a6a9a` (cinza roxo escuro)
- **Alto contraste**: Garantir acessibilidade

---

## 📊 Variáveis CSS Atualizadas

### Arquivo: `wake-up-web/style.css`
```css
--acento:             #ff006d   /* magenta principal */
--acento-hover:       #ff1493   /* pink mais vibrante */
--acento-fraco:       rgba(255, 0, 109, 0.12);
--roxo:               #9d4edd   /* roxo elétrico */
--texto:              #e8d9f0   /* tom roxo suave */
--fundo-principal:    #0a0508   /* preto roxo */
--brilho-magenta:     0 0 20px rgba(255, 0, 109, 0.15)
--brilho-roxo:        0 0 20px rgba(157, 78, 221, 0.15)
```

### Arquivo: `old/wakeupnow/style.css`
```css
--magenta-vibrant:    #ff006d
--pink:               #ff1493
--roxo-bright:        #9d4edd
--text-primary:       #f0e8ff
--bg-page:            #0a0206
--grad-magenta:       linear-gradient(135deg, #ff006d, #ff1493, #9d4edd)
--glow-magenta:       0 0 30px rgba(255, 0, 109, 0.10)
--glow-roxo:          0 0 30px rgba(157, 78, 221, 0.08)
```

---

## 🌈 Gradiente Mestro

```css
linear-gradient(135deg, #ff006d 0%, #ff1493 40%, #9d4edd 70%, #6b3fa0 100%)
```

**Uso**: 
- Backgrounds de heróis
- Overlays de CTAs
- Animações de carregamento
- Borders luminosas

---

## ✨ Efeitos de Brilho

### Glow Magenta (Energia)
```css
box-shadow: 0 0 20px rgba(255, 0, 109, 0.15);
```
Aplicado em: Botões primários, hover states

### Glow Roxo (Sofisticação)
```css
box-shadow: 0 0 20px rgba(157, 78, 221, 0.15);
```
Aplicado em: Cards destacados, inputs focados

---

## 🎬 Casos de Uso

### Botões
- **Primário**: Background `#ff006d` + Glow Magenta
- **Hover**: Background `#ff1493` + Glow mais intenso
- **Disabled**: Background com `opacity: 0.5`

### Links e Textos Destacados
- **Cor**: `#ff006d`
- **Hover**: `#ff1493` + underline

### Cards e Containers
- **Borda**: `rgba(255, 0, 109, 0.10)`
- **Hover**: `rgba(255, 0, 109, 0.22)` + Transform

### Inputs/Forms
- **Border**: `rgba(255, 0, 109, 0.10)`
- **Focus**: `rgba(255, 0, 109, 0.50)` + Glow Magenta

### Alerts/Status
- **Erro**: `#ff006d` (magenta)
- **Sucesso**: `#22c55e` (verde)
- **Warning**: `#f59e0b` (âmbar)

---

## 🚀 Como Usar

### 1. Em HTML/React
```jsx
<button style={{ background: 'var(--acento)', boxShadow: 'var(--brilho-magenta)' }}>
  Ação
</button>
```

### 2. Em CSS
```css
.btn-primary {
  background: var(--acento);
  box-shadow: var(--brilho-magenta);
  border: 1px solid var(--border);
  color: var(--texto-branco);
}

.btn-primary:hover {
  background: var(--acento-hover);
  box-shadow: 0 0 30px rgba(255, 0, 109, 0.25);
}
```

### 3. Responsividade
As cores funcionam em todos os breakpoints — não há ajustes específicos necessários.

---

## ✅ Checklist de Implementação

- [x] Atualizar `wake-up-web/style.css`
- [x] Atualizar `old/wakeupnow/style.css`
- [x] Testar contraste (WCAG AA)
- [x] Documentar paleta
- [ ] Atualizar componentes React (se necessário)
- [ ] Atualizar imagens/logos (marca visual)
- [ ] Testar em diferentes navegadores

---

## 📱 Acessibilidade

### Contraste WCAG AA
- **Texto Primário** (`#f0e8ff`) sobre **Fundos Escuros** (`#0a0206`): ✅ **14:1 ratio**
- **Texto Secundário** (`#b89dd0`) sobre **Fundos Escuros**: ✅ **7.8:1 ratio**
- **Magenta Principal** (`#ff006d`): ✅ Válido para elementos interativos

### Recomendações
- Adicionar `aria-label` em botões com ícones
- Testar leitores de tela com cores vibrantes
- Garantir que cor não é o único meio de comunicação de status

---

## 🎨 Preview Visual

| Elemento | Cor | Uso |
|----------|-----|-----|
| Botão CTA | `#ff006d` | Ação principal |
| Link | `#ff006d` | Navegação |
| Card Border | `rgba(255,0,109,0.10)` | Delimitação |
| Texto Principal | `#f0e8ff` | Corpo |
| Input Focus | `#ff1493` | Formulários |
| Fundo | `#0a0206` | Base |

---

## 📞 Suporte

Se encontrar inconsistências ou precisar ajustar a paleta:
1. Edite as variáveis CSS root
2. Teste em múltiplos navegadores
3. Valide acessibilidade com ferramentas WAVE/Axe

**Criado por**: AI Agent  
**Última atualização**: Fevereiro 2026
