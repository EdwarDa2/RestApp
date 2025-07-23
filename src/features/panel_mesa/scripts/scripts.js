const apiUrl = "http://localhost:7000/mesas";
const contenedorMesas = document.getElementById("contenedor-mesas");
const btnAgregar = document.getElementById("btn-agregar-mesa");

document.addEventListener("DOMContentLoaded", () => {
  cargarMesas();  // Cargar mesas al inicio
});

let siguienteNumMesa = 1;

// Función para agregar una nueva mesa
btnAgregar.addEventListener("click", () => {
  const nuevaMesa = {
    id_mesero: 1, // Asegúrate de obtener el ID del mesero de alguna parte del sistema
    id_cuenta: null, // Aquí también deberías verificar si esta mesa está asociada a alguna cuenta
    num_personas: 0,
    num_mesa: siguienteNumMesa++,  // Se incrementa automáticamente
    status: true
  };

  // Enviar la solicitud POST al backend para agregar la mesa
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaMesa)
  })
    .then(res => {
      if (res.ok) {
        cargarMesas();  // Recargar las mesas después de agregar
      } else {
        console.error("Error al agregar la mesa");
      }
    })
    .catch(err => console.error("Error en la solicitud:", err));
});

function cargarMesas() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(mesas => {
      contenedorMesas.innerHTML = "";  // Limpiar contenedor antes de cargar
      mesas.forEach(mesa => {
        // Crear el enlace de la mesa. Dependiendo del estado, la mesa se redirige a apertura (libre) o a comandas (ocupada)
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");
        // Incluir el id de la mesa en la URL para poder actualizarla posteriormente
        if (mesa.status) {
          // Mesa libre: enviar a la vista de apertura. Pasamos también el id de la mesa
          enlaceMesa.href = `/src/features/apertura_mesa/vista.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
        } else {
          // Mesa ocupada: enviar directamente a la vista de comandas
          enlaceMesa.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
        }
        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
          <img src="/src/assets/eliminar.png" class="icono-eliminar" data-id="${mesa.id_mesa}" />
        `;

        // Asegurarnos de que el icono de eliminar esté centrado y dentro de la mesa
        const iconoEliminar = enlaceMesa.querySelector('.icono-eliminar');
        iconoEliminar.style.textAlign = 'center';

        // Agregar el evento de clic para eliminar la mesa
        iconoEliminar.addEventListener("click", (event) => {
          event.preventDefault();  // Evitar la redirección al hacer clic en el ícono
          const idMesa = mesa.id_mesa;
          eliminarMesa(idMesa);  // Llamar a la función eliminarMesa pasando el id
        });

        // Añadir la mesa al contenedorr
        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}

// Función para eliminar una mesa
function eliminarMesa(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        cargarMesas();  // Recargar mesas después de eliminar
      } else {
        console.error("Error al eliminar la mesa");
      }
    })
    .catch(err => console.error("Error al eliminar la mesa:", err));
}