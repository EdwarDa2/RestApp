document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector(".tabla_usuarios tbody");
  let filaSeleccionada = null;
  let idSeleccionado = null;
  
  // Seleccionar fila
  function seleccionarFila(fila) {
    if (filaSeleccionada) filaSeleccionada.classList.remove("seleccionada");
    filaSeleccionada = fila;
    filaSeleccionada.classList.add("seleccionada");
    idSeleccionado = fila.dataset.id;
  }

  // Mostrar modal agregar
  document.querySelector(".btn-agregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "flex";
  });

  // Cerrar modal agregar
  document.getElementById("cerrarAgregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "none";
  });

  
  // Mostrar modal eliminar
  document.querySelector(".btn").addEventListener("click", () => {
    if (idSeleccionado) {
      document.getElementById("mensajeEliminar").textContent =
        "¿Desea eliminar al usuario seleccionado?";
      document.getElementById("modalEliminar").style.display = "flex";
    } else {
      alert("Selecciona un usuario para eliminar.");
    }
  });

  // Cancelar eliminación
  document.getElementById("cancelarEliminar").addEventListener("click", () => {
    document.getElementById("modalEliminar").style.display = "none";
  });

  async function cargarUsuarios() {
  try {
    const response = await fetch('http://localhost:7000/Usuarios');
    if (!response.ok) throw new Error("No se pudo obtener los usuarios");

    const usuarios = await response.json();

    const tabla = document.querySelector(".tabla_usuarios tbody");
    tabla.innerHTML = ""; // Limpiar tabla antes de llenar

    usuarios.forEach(usuario => {
      console.log(usuario);
      const tr = document.createElement("tr");
      tr.dataset.id = usuario.id_usuario;

      // Opcional: traducir el número de rol a texto
      const rolTexto = usuario.rol === 2 ? "Mesero" : usuario.rol;

      tr.innerHTML = `
        <td>${usuario.id_usuario}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.apellido_p}</td>
        <td>${usuario.apellido_m}</td>
        <td>${usuario.clave}</td>
        <td>${rolTexto}</td>
      `;

      tr.addEventListener("click", () => seleccionarFila(tr));
      tabla.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("Error al cargar los datos de los usuarios.");
  }
}

  cargarUsuarios();
});
