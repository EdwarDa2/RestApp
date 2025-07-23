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
        // Crear el enlace de la mesa
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");  // Usar clases para el diseño de avisos
        enlaceMesa.href = `/src/features/apertura_mesa/vistaMesero.html?mesa=${mesa.num_mesa}`; // Redirigir al hacer clic
        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
          <div class="icono-eliminar" data-id="${mesa.id_mesa}"></div> <!-- Ícono de eliminar -->
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

        // Añadir la mesa al contenedor
        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}



