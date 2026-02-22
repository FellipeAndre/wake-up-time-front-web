# Wake Up Now · AI Agent Instructions

## Project Overview

**Wake Up Now** is a modern online video learning platform with TWO frontend implementations:

1. **Legacy**: Vanilla JavaScript SPA in `wakeupnow/` (reference, being phased out)
2. **Current**: React + Vite in `react-app/` (active development)

**Use `react-app/` for all new work.**

## Project Architecture — React Version

**Wake Up Now** is a **React SPA** (Single Page Application built with Vite) for an online video learning platform with multiple feature modules.

### Core Structure

**React App Location**: `react-app/`

- **Root**: `src/App.jsx` — Central navigation, page routing
- **Pages** (`src/pages/`): 5 feature modules as React components:
  - `Home.jsx` — Landing/hero with integrated LoginModal
  - `Cadastro.jsx` — Registration and login (pt-BR: "cadastro" = registration)
  - `Videos.jsx` — Video library with filtering
  - `Upload.jsx` — Admin area for video uploads
  - `Pagamento.jsx` — Payment plans (Starter/Pro/Elite)
  
- **Components** (`src/components/`):
  - `Sidebar.jsx` / `Topbar.jsx` / `Layout.jsx` — UI shell
  - `LoginModal.jsx` — **NEW**: Email/Password + OAuth (Google, Apple/iCloud) in modal
  
- **Context** (`src/context/AuthContext.jsx`):
  - Global auth state: `user`, `token`, `login()`, `logout()`
  - localStorage persistence: `wun_token`, `wun_user`

- **Services** (`src/services/api.js`):
  - Axios instance with Bearer token interceptor
  - Endpoints: `/auth/register`, `/auth/login`, `/auth/google`, `/auth/apple`, `/videos/*`, `/payment/*`

- **Design**: `src/styles/global.css` — CSS tokens (same metallic silver theme as original)

## Critical Patterns & Conventions

### 1. **Design System (CSS Tokens)**
All styling centralizes in `src/styles/global.css` using CSS custom properties:
- **Color Palette**: Metallic silver on dark charcoal (`--silver`, `--charcoal`, `--ink`)
- **Key Tokens**: `--bg-page`, `--text-primary`, `--border`, `--radius`, `--sidebar-w` (260px)
- **Fonts**: Rajdhani (display), Exo 2 (body) — imported from Google Fonts
- **Shadows**: `--shadow-md`, `--glow-silver` for metallic depth effect

**When adding UI**: Always use CSS tokens from `src/styles/global.css`. Do not hardcode colors/sizes. Reference lines 1-100 for token definitions.

**CSS ComAuthentication & LoginModal**
- **Location**: `src/components/LoginModal.jsx`
- **New**: Unified auth modal with OAuth support
  - **Email/Password**: Local form validation → POST to `/api/auth/login` or `/api/auth/register`
  - **Google OAuth**: Uses `@react-oauth/google` → credential to `/api/auth/google`
  - **Apple/iCloud**: Uses Apple Sign In SDK → token to `/api/auth/apple`
- **Expected backend response**:
  ```json
  { "user": { "id", "name", "email", "role" }, "token": "jwt_token" }
  ```
- **State flow**: Backend returns → `AuthContext.login(userData, token)` → token stored in localStorage

### 3. **Form Validation & User Feedback**
- **4. **State Management**
- **Global Auth**: `AuthContext` in `src/context/AuthContext.jsx`
  - Uses React Context API (no Redux)
  - Exposes: `user`, `token`, `login(userData, token)`, `logout()`
- **Local Module State**: Each page component uses `useState()` for form state, filters, etc.
- **localStorage**: Persist auth tokens (`wun_token`, `wun_user`)
  - Automatically restored on app load by AuthContext
- **Toast Notifications**: Will be implemented as custom hook (not yet in LoginModalcript section)
- **Validation Pattern** (e.g., `cadastro.js`):
  - Collect form values → validate locally → return error message
  - Show error in DOM: `document.getElementById('cadastro-error').textContent = error`
  - Disable buttons during async operations
- **Input Masking**: CPF (`maskCPF`), Card number (`maskCard`), Expiry (`maskExpiry`)

### 3. **State Management**
- **Local State Objects**: Each module declares `*State` objects (e.g., `UploadState`, `PayState`)
- **localStorage**: Persist user data (e.g., `JSON.parse(localStorage.getItem('wun_uploads'))`)
- **No global framework state**: Keep state within module scope

### 5. **File Upload & Media Handling** (to implement in `Upload.jsx`)
- **Drag & Drop**: Listen on dropzone for `dragover`/`dragleave`/`drop` events
- **Blob URLs**: `URL.createObjectURL(file)` for preview
- **Metadata Display**: Extract file size, format, name for user feedback
- **Multipart Upload**: Use FormData with `axios.post()` from `src/services/api.js`

### 6. **Video Library** (`Videos.jsx` — to implement)
- **Nested Structure**: Themes → Modules → Videos (collapsible/expandable)
- **Access Control**: `.locked` class indicates paywall-restricted content
- **Modal Playback**: Modal with embedded video player (URL from API)
- **Search/Filter**: Filter functions by query and theme ID

### 7. **Payment Module** (`Pagamento.jsx` — to implement)
- **Plan Selection**: State tracks selected plan and price
- **Multi-method Checkout**: Card / PIX / Boleto payment tabs
- **Form Masking**: CPF, Card number, Expiry date
- **Currency Format**: Utility function `fmt()` for BRL formatting

## API Integration (Backend: Spring)

**API Base**: Configured in `.env` as `REACT_APP_API_URL` (default: `http://localhost:8080/api`)

All requests include Bearer token from `src/services/api.js` interceptor.

### Auth Endpoints
- `POST /auth/register` — Email/password registration
  - Body: `{ name, email, password }`
  - Response: `{ user: {...}, token: "jwt" }`
  
- `POST /auth/login` — Email/password login
  - Body: `{ email, password }`
### Setup
```bash
cd react-app
npm install
cp .env.example .env          # Configure OAuth credentials
npm run dev                    # Start dev server on http://localhost:3000
```

### Build
```bash
npm run build                  # Creates dist/ folder
npm run preview               # Preview production build locally
```

### Structure
- **Hot reload**: Changes in JSX/CSS automatically refresh browser
- **Dev tools**: Use React DevTools extension to inspect component state
- **Network**: All API calls visible in browser DevTools Network tab
- **Auth**: localStorage (`wun_token`, `wun_user`) persists across refreshes
  - Response: `{ user: {...}, token: "jwt" }`
  
- `POST /auth/apple` — Apple/iCloud OAuth validation
  - Body: `{ token: "apple_identity_token" }`
  - Response: `{ user: {...}, token: "jwt" }`

### Video Endpoints (to implement)
- `GET /videos/list` — Fetch all videos/themes/modules
- `GET /videos/{id}` — Get single video details
- `Best Practices for AI Agents

### Component Development
1. **Always use CSS tokens** from `src/styles/global.css` — never hardcode colors
2. **Leverage existing components** — import and compose from `src/components/`
3. **Handle loading & errors** — disable buttons, show spinners, display error messages
4. **Use AuthContext** — don't create separate auth logic
5. **Follow pt-BR localization** — all user-facing text in Portuguese

### API Integration
1. **Use apiService functions** — don't create raw fetch() calls
2. **Handle errors with try/catch** — show error feedback to user
3. **Disable UI during requests** — button `loading` state
4. **Store auth token** — automatic via AuthContext & localStorage

### Example: Add New Feature
```jsx
// 1. Use context
const { user, token } = useContext(AuthContext);

// 2. Use service
const data = await videoService.getVideos();

// 3. Use CSS tokens and components
<button className="btn btn-primary">Ação</button>
<div className="card">
  <h3 style={{ color: 'var(--text-primary)' }}>Título</h3>
</div>
```
```
wakeupnow/
├── index.html          # Central router + layout shell
├── style.css           # Design system tokens
├── [module]/
│   ├── [module].html   # View markup
│   ├── [module].css    # Module-scoped styles
│   └── [module].js     # Module logic + init functions
```

**New features**: Create new folder `feature-name/` with all three files.

---

**For AI agents**: When modifying or adding features, reference this document to maintain consistency. Focus on the ~20 pages of modular code as isolated units—changes in one module rarely affect others except through the central router.
