document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector(".tabla_usuarios tbody");
  let filaSeleccionada = null;

  // Mostrar modal agregar
  document.querySelector(".btn-agregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "flex";
  });

  // Cerrar modal agregar
  document.getElementById("cerrarAgregar").addEventListener("click", () => {
    document.getElementById("modalAgregar").style.display = "none";
  });

  // Guardar nuevo usuario
 document.getElementById("guardarUsuario").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const apellidoP = document.getElementById("apellidoP").value;
  const apellidoM = document.getElementById("apellidoM").value;
  const clave = document.getElementById("clave").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (nombre && apellidoP && apellidoM && clave) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th>${nombre}</th>
      <th>${apellidoP}</th>
      <th>${apellidoM}</th>
      <th>${clave}</th>
      <th>${tipo}</th>
    `;
    tr.addEventListener("click", () => seleccionarFila(tr));
    tabla.appendChild(tr);

    document.getElementById("modalAgregar").style.display = "none";

    // Limpiar inputs
    document.getElementById("nombre").value = "";
    document.getElementById("apellidoP").value = "";
    document.getElementById("apellidoM").value = "";
    document.getElementById("clave").value = "";
  } else {
    alert("Completa todos los campos.");
  }
});


  // Seleccionar fila
  function seleccionarFila(fila) {
    if (filaSeleccionada) filaSeleccionada.classList.remove("seleccionada");
    filaSeleccionada = fila;
    filaSeleccionada.classList.add("seleccionada");
  }

  // Botón eliminar
  document.querySelector(".btn").addEventListener("click", () => {
    if (filaSeleccionada) {
      document.getElementById("mensajeEliminar").textContent =
        "¿Desea eliminar al usuario seleccionado?";
      document.getElementById("modalEliminar").style.display = "flex";
    } else {
      alert("Selecciona un usuario para eliminar.");
    }
  });

  // Confirmar eliminación
  document.getElementById("confirmarEliminar").addEventListener("click", () => {
    if (filaSeleccionada) {
      filaSeleccionada.remove();
      filaSeleccionada = null;
      document.getElementById("modalEliminar").style.display = "none";
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
