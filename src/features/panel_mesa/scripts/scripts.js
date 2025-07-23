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
        // Crear el enlace de la mesa
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");  // Usar clases para el diseño de avisos
        enlaceMesa.href = `/src/features/apertura_mesa/vista.html?mesa=${mesa.num_mesa}`; // Redirigir al hacer clic
        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
          <div class="icono-eliminar" data-id="${mesa.id_mesa}">🗑️</div> <!-- Ícono de eliminar -->
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
document.addEventListener('DOMContentLoaded', () => {
    obtenerMesas();  // Fetch the tables when the page loads
});

// Function to check the table status and redirect accordingly
const verificarEstadoMesa = async (mesaId) => {
    const response = await fetch(`http://localhost:7000/mesas/${mesaId}`);
    const mesa = await response.json();

    if (mesa.status) {
        // If it's free, allow the user to open it
        window.location.href = "/src/features/apertura_mesa/vista.html";
    } else {
        // If it's occupied, redirect to comandas
        window.location.href = "/comandas.html";
    }
};

// Function to update the table status to "ocupada" and redirect to the opening page
const actualizarEstadoMesa = async (mesaId) => {
    const response = await fetch(`http://localhost:7000/mesas/${mesaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: false })  // Occupy the table
    });

    if (response.ok) {
        // Redirect to the mesa opening page
        window.location.href = "/src/features/apertura_mesa/vista.html";
    } else {
        console.error('Error al actualizar estado de mesa');
    }
};

// Function to fetch and display all tables
const obtenerMesas = async () => {
    const response = await fetch("http://localhost:7000/mesas");
    const mesas = await response.json();

    mesas.forEach(mesa => {
        const mesaElement = document.createElement('div');
        mesaElement.innerHTML = `
            <div class="mesa ${mesa.status ? 'libre' : 'ocupada'}" 
                onclick="verificarEstadoMesa(${mesa.id_mesa})">
                Mesa ${mesa.num_mesa}
            </div>
        `;
        document.getElementById('contenedor-mesas').appendChild(mesaElement);
    });
};