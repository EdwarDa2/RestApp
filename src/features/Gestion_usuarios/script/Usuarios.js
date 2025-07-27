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

  // Confirmar eliminación
document.getElementById("confirmarEliminar").addEventListener("click", async () => {
  if (!idSeleccionado) {
    alert("No hay usuario seleccionado");
    return;
  }

  try {
    const id_usuario = parseInt(idSeleccionado);

    // Intentar encontrar el mesero asociado
    const id_mesero = await obtenerIdMeseroPorUsuario(id_usuario);

    // Si existe, eliminar primero el mesero
    if (id_mesero) {
      const deleteMesero = await fetch(`http://localhost:7000/meseros/${id_mesero}`, {
        method: "DELETE"
      });
      if (!deleteMesero.ok) throw new Error("No se pudo eliminar el mesero");
    }

    // Ahora eliminar el usuario
    const deleteUsuario = await fetch(`http://localhost:7000/Usuarios/${id_usuario}`, {
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



  async function cargarUsuarios() {
  try {
    // Obtener usuarios
    const usuariosResponse = await fetch('http://localhost:7000/Usuarios');
    if (!usuariosResponse.ok) throw new Error("Error al obtener usuarios");
    const usuarios = await usuariosResponse.json();

    // Obtener claves de meseros
    const meserosResponse = await fetch('http://localhost:7000/meseros');
    if (!meserosResponse.ok) throw new Error("Error al obtener meseros");
    const meseros = await meserosResponse.json();

    const tabla = document.querySelector(".tabla_usuarios tbody");
    tabla.innerHTML = ""; // Limpiar tabla

    usuarios.forEach(usuario => {
      const tr = document.createElement("tr");
      tr.dataset.id = usuario.id_usuario;

      // Buscar clave del mesero si es rol 2
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
    const response = await fetch('http://localhost:7000/meseros');
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

  // Guardar nuevo mesero
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
      rol: 2, // siempre mesero
      clave
    };

    try {
  const response = await fetch("http://localhost:7000/meseros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoMesero)
  });

  console.log("Estado recibido:", response.status);

  // No intentamos leer .json() ni .text()
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
  // Mostrar error en consola para entender si es CORS, red, etc.
  alert("❌ Ocurrió un error inesperado, pero el mesero sí pudo haberse creado.");
}

  });
