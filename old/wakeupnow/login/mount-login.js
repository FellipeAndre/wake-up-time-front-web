/**
 * MOUNT-LOGIN.JS
 * 
 * Responsabilidade:
 * - Montar o componente React LoginForm no DOM
 * - Integrar com o sistema de roteamento vanilla existente
 * - Permitir callback quando login é bem-sucedido
 * 
 * Uso:
 *   import { mountLoginComponent, unmountLoginComponent } from './login/mount-login.js'
 *   mountLoginComponent('viewLogin', handleLoginSuccess)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './Login.jsx';

let loginRoot = null;

/**
 * Monta o componente React LoginForm no elemento especificado
 * 
 * @param {string} elementId - ID do elemento onde montar o componente
 * @param {function} onLoginSuccess - Callback quando login é bem-sucedido
 */
export function mountLoginComponent(elementId, onLoginSuccess = null) {
  const container = document.getElementById(elementId);
  
  if (!container) {
    console.error(`Elemento com ID "${elementId}" não encontrado`);
    return;
  }
  
  // Limpar conteúdo anterior
  container.innerHTML = '';
  
  // Criar root React
  loginRoot = ReactDOM.createRoot(container);
  
  // Renderizar componente
  loginRoot.render(
    <React.StrictMode>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </React.StrictMode>
  );
}

/**
 * Desmonta o componente React (limpeza)
 */
export function unmountLoginComponent() {
  if (loginRoot) {
    loginRoot.unmount();
    loginRoot = null;
  }
}

/**
 * Atualiza a aba ativa do formulário de login
 * 
 * @param {string} tab - 'login' ou 'register'
 */
export function setLoginTab(tab) {
  // Dispara evento customizado para o componente reagir
  window.dispatchEvent(new CustomEvent('setLoginTab', { detail: { tab } }));
}

// Exportar para uso global (caso necessário)
window.LoginComponentAPI = {
  mount: mountLoginComponent,
  unmount: unmountLoginComponent,
  setTab: setLoginTab
};
