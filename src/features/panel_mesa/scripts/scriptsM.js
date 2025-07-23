const apiUrl = "http://localhost:7000/mesas";
const contenedorMesas = document.getElementById("contenedor-mesas");
const btnAgregar = document.getElementById("btn-agregar-mesa");

document.addEventListener("DOMContentLoaded", () => {
  cargarMesas();  // Cargar mesas al inicio
});

function cargarMesas() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(mesas => {
      contenedorMesas.innerHTML = "";  // Limpiar contenedor antes de cargar
      mesas.forEach(mesa => {
        // Crear el enlace de la mesa. Para mesas ocupadas se redirige a comandas en lugar de apertura
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");
        if (mesa.status) {
          // Mesa libre: permitir la apertura
          enlaceMesa.href = `/src/features/apertura_mesa/vistaMesero.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
        } else {
          // Mesa ocupada: redirigir a vista de comandas directamente
          enlaceMesa.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
        }
        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
        `;
        // Para mesero no incluimos opción de eliminar mesa por defecto
        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}



