document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector(".tabla_usuarios tbody");
  let filaSeleccionada = null;
  let idSeleccionado = null;

  function seleccionarFila(fila) {
    if (filaSeleccionada) filaSeleccionada.classList.remove("seleccionada");
    filaSeleccionada = fila;
    filaSeleccionada.classList.add("seleccionada");
    idSeleccionado = fila.dataset.id;
  }

  document.querySelector(".btn-agregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "flex";
  });

  document.getElementById("cerrarAgregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "none";
  });

  document.querySelector(".btn").addEventListener("click", () => {
    if (idSeleccionado) {
      document.getElementById("mensajeEliminar").textContent = "¿Desea eliminar al usuario seleccionado?";
      document.getElementById("modalEliminar").style.display = "flex";
    } else {
      alert("Selecciona un usuario para eliminar.");
    }
  });

  document.getElementById("cancelarEliminar").addEventListener("click", () => {
    document.getElementById("modalEliminar").style.display = "none";
  });

  document.getElementById("confirmarEliminar").addEventListener("click", async () => {
    if (!idSeleccionado) {
      alert("No hay usuario seleccionado");
      return;
    }

    try {
      const id_usuario = parseInt(idSeleccionado);
      const id_mesero = await obtenerIdMeseroPorUsuario(id_usuario);

      if (id_mesero) {
        const deleteMesero = await fetch(`http://3.214.208.156:7000/meseros/${id_mesero}`, {
          method: "DELETE"
        });
        if (!deleteMesero.ok) throw new Error("No se pudo eliminar el mesero");
      }

      const deleteUsuario = await fetch(`http://3.214.208.156:7000/Usuarios/${id_usuario}`, {
        method: "DELETE"
      });
      if (!deleteUsuario.ok) throw new Error("No se pudo eliminar el usuario");

      alert("✅ Usuario eliminado correctamente");
      document.getElementById("modalEliminar").style.display = "none";
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar el usuario: " + error.message);
    }
  });

  document.getElementById("guardarUsuario").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const apellidoP = document.getElementById("apellidoP").value.trim();
    const apellidoM = document.getElementById("apellidoM").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!nombre || !apellidoP || !apellidoM || !clave) {
      alert("Por favor, llena todos los campos.");
      return;
    }

    const nuevoMesero = {
      nombre,
      apellido_p: apellidoP,
      apellido_m: apellidoM,
      rol: 2,
      clave
    };

    try {
      const response = await fetch("http://3.214.208.156:7000/meseros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoMesero)
      });

      if (response.status === 201 || response.status === 200) {
        alert("✅ Mesero agregado correctamente");
        document.getElementById("modalAgregar").style.display = "none";
        document.getElementById("nombre").value = "";
        document.getElementById("apellidoP").value = "";
        document.getElementById("apellidoM").value = "";
        document.getElementById("clave").value = "";
        cargarUsuarios();
      } else {
        alert("❌ Error: la respuesta del servidor no fue exitosa.");
      }
    } catch (error) {
      console.error("Error atrapado:", error);
      alert("❌ Ocurrió un error inesperado.");
    }
  });

    // ACTUALIZAR MESERO
  document.querySelector(".btn-actualizar").addEventListener("click", async () => {
    if (!idSeleccionado) {
      alert("Selecciona un usuario para actualizar.");
      return;
    }

    // Obtener la fila seleccionada
    const fila = filaSeleccionada;
    const celdas = fila.querySelectorAll("td");

    // Llenar el modal con los datos actuales
    document.getElementById("nombre").value = celdas[1].textContent;
    document.getElementById("apellidoP").value = celdas[2].textContent;
    document.getElementById("apellidoM").value = celdas[3].textContent;
    document.getElementById("clave").value = celdas[4].textContent;

    // Cambiar el botón de Guardar a Actualizar
    const botonGuardar = document.getElementById("guardarUsuario");
    botonGuardar.textContent = "Actualizar Usuario";

    // Mostrar el modal
    document.getElementById("modalAgregar").style.display = "flex";

    // Remover cualquier listener anterior
    const nuevoBoton = botonGuardar.cloneNode(true);
    botonGuardar.parentNode.replaceChild(nuevoBoton, botonGuardar);

    nuevoBoton.addEventListener("click", async () => {
      const nombre = document.getElementById("nombre").value.trim();
      const apellidoP = document.getElementById("apellidoP").value.trim();
      const apellidoM = document.getElementById("apellidoM").value.trim();
      const clave = document.getElementById("clave").value.trim();

      if (!nombre || !apellidoP || !apellidoM || !clave) {
        alert("Por favor, llena todos los campos.");
        return;
      }

      try {
        const id_usuario = parseInt(idSeleccionado);
        const id_mesero = await obtenerIdMeseroPorUsuario(id_usuario);

        // Actualizar usuario
        await fetch(`http://3.214.208.156:7000/Usuarios/${id_usuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario,
            nombre,
            apellido_p: apellidoP,
            apellido_m: apellidoM,
            rol: 2
          })
        });

        // Actualizar mesero
        if (id_mesero) {
          await fetch(`http://3.214.208.156:7000/meseros/${id_mesero}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clave })
          });
        }

        alert("✅ Usuario actualizado correctamente");
        document.getElementById("modalAgregar").style.display = "none";
        cargarUsuarios();

        // Restaurar texto del botón
        nuevoBoton.textContent = "Guardar Usuario";
      } catch (error) {
        console.error("Error al actualizar:", error);
        alert("❌ Error al actualizar el usuario.");
      }
    });
  });
  
document.getElementById("cerrarAgregar").addEventListener("click", () => {
  document.getElementById("modalAgregar").style.display = "none";
  document.getElementById("guardarUsuario").textContent = "Guardar Usuario";
  document.getElementById("nombre").value = "";
  document.getElementById("apellidoP").value = "";
  document.getElementById("apellidoM").value = "";
  document.getElementById("clave").value = "";
});


  async function cargarUsuarios() {
    try {
      const usuariosResponse = await fetch('http://3.214.208.156:7000/Usuarios');
      if (!usuariosResponse.ok) throw new Error("Error al obtener usuarios");
      const usuarios = await usuariosResponse.json();

      const meserosResponse = await fetch('http://3.214.208.156:7000/meseros');
      if (!meserosResponse.ok) throw new Error("Error al obtener meseros");
      const meseros = await meserosResponse.json();

      tabla.innerHTML = "";

      usuarios.forEach(usuario => {
        const tr = document.createElement("tr");
        tr.dataset.id = usuario.id_usuario;

        let clave = "";
        if (usuario.rol === 2) {
          const meseroInfo = meseros.find(m => m.id_usuario === usuario.id_usuario);
          clave = meseroInfo ? meseroInfo.clave : "No encontrada";
        }

        const rolTexto = usuario.rol === 2 ? "Mesero" : usuario.rol;

        tr.innerHTML = `
          <td>${usuario.id_usuario}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.apellido_p}</td>
          <td>${usuario.apellido_m}</td>
          <td>${clave}</td>
          <td>${rolTexto}</td>
        `;

        tr.addEventListener("click", () => seleccionarFila(tr));
        tabla.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("No se pudieron cargar los usuarios.");
    }
  }

  async function obtenerIdMeseroPorUsuario(id_usuario) {
    try {
      const response = await fetch('http://3.214.208.156:7000/meseros');
      const meseros = await response.json();
      const mesero = meseros.find(m => m.id_usuario === id_usuario);
      return mesero ? mesero.id_mesero : null;
    } catch (e) {
      console.error("Error al obtener meseros:", e);
      return null;
    }
  }

  cargarUsuarios();
});
