document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector(".tabla_usuarios tbody");
  let filaSeleccionada = null;
  let idSeleccionado = null;

  // Función para cargar los usuarios
  async function cargarUsuarios() {
    try {
      const response = await fetch('http://localhost:7000/usuarios');
      const usuarios = await response.json();

      // Llenar la tabla con los datos obtenidos
      usuarios.forEach(usuario => {
        const tr = document.createElement("tr");
        tr.dataset.id = usuario.id_usuario;  // Usamos el id del usuario para eliminarlo más tarde
        tr.innerHTML = `
          <th>${usuario.nombre}</th>
          <th>${usuario.apellido_paterno}</th>
          <th>${usuario.apellido_materno}</th>
          <th>${usuario.clave}</th>
          <th>${usuario.rol}</th>
        `;
        tr.addEventListener("click", () => seleccionarFila(tr));
        tabla.appendChild(tr);
      });
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  // Llama a la función para cargar los usuarios
  cargarUsuarios();

  // Mostrar modal agregar
  document.querySelector(".btn-agregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "flex";
  });

  // Cerrar modal agregar
  document.getElementById("cerrarAgregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "none";
  });

  // Guardar nuevo usuario
  document.getElementById("guardarUsuario").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value;
    const apellidoP = document.getElementById("apellidoP").value;
    const apellidoM = document.getElementById("apellidoM").value;
    const clave = document.getElementById("clave").value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (nombre && apellidoP && apellidoM && clave) {
      // Crear el usuario a través de la API
      try {
        const nuevoUsuario = {
          nombre,
          apellido_paterno: apellidoP,
          apellido_materno: apellidoM,
          clave,
          rol: tipo
        };

        const response = await fetch('http://localhost:7000/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoUsuario)
        });

        if (response.ok) {
          const usuarioCreado = await response.json();
          
          // Agregar el usuario creado a la tabla
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <th>${usuarioCreado.nombre}</th>
            <th>${usuarioCreado.apellido_paterno}</th>
            <th>${usuarioCreado.apellido_materno}</th>
            <th>${usuarioCreado.clave}</th>
            <th>${usuarioCreado.rol}</th>
          `;
          tr.addEventListener("click", () => seleccionarFila(tr));
          tabla.appendChild(tr);

          // Cerrar el modal
          document.getElementById("modalAgregar").style.display = "none";

          // Limpiar los campos del formulario
          document.getElementById("nombre").value = "";
          document.getElementById("apellidoP").value = "";
          document.getElementById("apellidoM").value = "";
          document.getElementById("clave").value = "";
        } else {
          alert("Hubo un error al guardar el usuario.");
        }
      } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("Hubo un error al crear el usuario.");
      }
    } else {
      alert("Completa todos los campos.");
    }
  });

  // Seleccionar fila
  function seleccionarFila(fila) {
    if (filaSeleccionada) filaSeleccionada.classList.remove("seleccionada");
    filaSeleccionada = fila;
    filaSeleccionada.classList.add("seleccionada");

    // Obtener el id del usuario seleccionado
    idSeleccionado = fila.dataset.id;
  }

  // Botón eliminar
  document.querySelector(".btn").addEventListener("click", () => {
    if (idSeleccionado) {
      document.getElementById("mensajeEliminar").textContent =
        "¿Desea eliminar al usuario seleccionado?";
      document.getElementById("modalEliminar").style.display = "flex";
    } else {
      alert("Selecciona un usuario para eliminar.");
    }
  });

  // Confirmar eliminación
  document.getElementById("confirmarEliminar").addEventListener("click", async () => {
    if (idSeleccionado) {
      try {
        // Realizar la solicitud DELETE a la API
        const response = await fetch(`http://localhost:7000/usuarios/${idSeleccionado}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Eliminar la fila de la tabla
          filaSeleccionada.remove();
          filaSeleccionada = null;
          idSeleccionado = null;
          document.getElementById("modalEliminar").style.display = "none";
        } else {
          alert("Hubo un error al eliminar al usuario.");
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Hubo un error al eliminar al usuario.");
      }
    }
  });

  // Cancelar eliminación
  document.getElementById("cancelarEliminar").addEventListener("click", () => {
    document.getElementById("modalEliminar").style.display = "none";
  });

  // Agregar funcionalidad de selección a filas ya existentes
  document.querySelectorAll(".tabla_usuarios tbody tr").forEach((tr) => {
    tr.addEventListener("click", () => seleccionarFila(tr));
  });
});
