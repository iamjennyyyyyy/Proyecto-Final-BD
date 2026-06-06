  document.addEventListener('DOMContentLoaded', async () => {
  
  if (typeof checkAuth !== 'function') {
      console.error('checkAuth no está definida. ¿auth.js se cargó correctamente?');
      return;
  }
  
  const autenticado = await checkAuth();
  
  if (!autenticado) {
      console.log('Usuario no autenticado, mostrando login');
      const loginScreen = document.getElementById('loginScreen');
      const appLayout = document.getElementById('appLayout');
      if (loginScreen) {
          loginScreen.classList.remove('hidden');
          loginScreen.style.display = 'flex';
      }
      if (appLayout) {
          appLayout.classList.add('hidden');
      }
  } else {
      console.log('Usuario autenticado');
  }
});