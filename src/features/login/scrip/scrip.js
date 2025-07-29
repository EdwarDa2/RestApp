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
        const rol = data.tipoRol;
        /*
         * Guardamos información relevante del usuario en localStorage para
         * reutilizarla en las distintas vistas de la aplicación.  Esta
         * información incluye el id del usuario (idUsuario) y su rol.  De
         * esta forma, al momento de aperturar una mesa o cerrar una cuenta
         * podremos asociar la operación al usuario autenticado.
         */
        if (data && typeof data.idUsuario !== 'undefined') {
          localStorage.setItem('id_usuario', data.idUsuario);
        }
        // Guardar nombre completo del usuario para mostrarlo en distintas vistas
        if (data && data.nombre) {
          const nombreCompleto = [data.nombre, data.apellidoP, data.apellidoM]
            .filter(Boolean)
            .join(' ');
          localStorage.setItem('usuario_nombre', nombreCompleto);
        }
        if (rol) {
          localStorage.setItem('user_role', rol);
        }

        if (rol === "Administrador") {
          window.location.href = '/src/features/menu_admin/index.html';
        } else if (rol === "Mesero") {
          /*
           * Para los usuarios con rol Mesero obtenemos el identificador de
           * mesero asociado al usuario.  Este id se usa para asignar mesas
           * correctamente y evitar que otro mesero entre a una mesa
           * ocupada por quien la aperturó.  Esperamos la respuesta antes
           * de redirigir al panel de mesas correspondiente.
           */
          const idUsuarioActual = data.idUsuario;
          fetch('http://localhost:7000/meseros')
            .then(res => res.json())
            .then(meseros => {
              const encontrado = Array.isArray(meseros)
                ? meseros.find(m => m.id_usuario === idUsuarioActual)
                : null;
              if (encontrado && typeof encontrado.id_mesero !== 'undefined') {
                localStorage.setItem('id_mesero', encontrado.id_mesero);
              }
            })
            .catch(err => {
              console.error('Error al obtener meseros:', err);
            })
            .finally(() => {
              window.location.href = '/src/features/panel_mesa/panelMesaMesero.html';
            });
        } else {
          alert('Rol no reconocido');
        }
      })
      .catch((error) => {
        alert(error.message || 'Error al iniciar sesión');
      });
  });
});