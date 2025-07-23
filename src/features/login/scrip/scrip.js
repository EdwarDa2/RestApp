// y redirigir al usuario según su rol (admin o mesero).

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');

  if (!form || !passwordInput) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const clave = passwordInput.value.trim();
    
    if (!clave) {
      alert('Por favor ingrese su clave');
      return;
    }

    // Considera usar una variable de configuración para la URL
    const API_URL = 'http://localhost:7000/login';
    
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clave: clave }),
    })
      .then((response) => {
        // Manejo más específico de errores HTTP
        if (response.status === 401) {
          throw new Error('Clave incorrecta');
        }
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const rol = data.rol;
        
        // Rutas consistentes y posiblemente diferentes archivos por rol
        if (rol === 'admin') {
          window.location.href = '/src/features/panel_mesa/panelMesa.html';
        } else if (rol === 'mesero') {
          window.location.href = '/src/features/panel_mesa/panelMesaMesero.html';
        } else {
          alert('Rol no reconocido');
        }
      })
      .catch((error) => {
        alert(error.message || 'Error al iniciar sesión');
      });
  });
});