function redireccionar() {
      const usuario = document.getElementById('usuario').value;
      const contraseña = document.getElementById('contraseña').value;

      if (!usuario || usuario === "Selecciona tu usuario") {
        alert("Por favor selecciona un tipo de usuario.");
        return;
      }

      if (!contraseña) {
        alert("Por favor ingresa la contraseña.");
        return;
      }

      if (usuario === "Mesero") {
        window.location.href = "/src/features/panel_mesa/panelMesaMesero.html";
      } else if (usuario === "Administrador") {
        window.location.href = "/src/features/menu_admin/index.html";
      }
    }