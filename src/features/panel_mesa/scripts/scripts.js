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
    id_mesero: 1,
    id_cuenta: null,
    num_personas: 0,
    num_mesa: siguienteNumMesa++,
    status: true
  };

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaMesa)
  })
    .then(res => {
      if (res.ok) {
        cargarMesas();
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
      contenedorMesas.innerHTML = "";
      mesas.forEach(mesa => {
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");

        if (mesa.status) {
          // 🟢 Mesa libre → Redirigir a apertura
          enlaceMesa.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("mesa_id", mesa.id_mesa);
            localStorage.setItem("mesa_numero", mesa.num_mesa);
            window.location.href = `/src/features/apertura_mesa/vista.html`;
          });
        } else {
          // 🔴 Mesa ocupada → Redirigir a comandas
          enlaceMesa.addEventListener("click", (e) => {
            e.preventDefault(); // ⛔ evitar que redireccione automáticamente
            localStorage.setItem("mesa_id", mesa.id_mesa);
            localStorage.setItem("mesa_numero", mesa.num_mesa);
            window.location.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
          });
        }

        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
          <img src="/src/assets/eliminar.png" class="icono-eliminar" data-id="${mesa.id_mesa}" />
        `;

        const iconoEliminar = enlaceMesa.querySelector('.icono-eliminar');
        iconoEliminar.style.textAlign = 'center';

        iconoEliminar.addEventListener("click", (event) => {
          event.preventDefault();
          const idMesa = mesa.id_mesa;
          eliminarMesa(idMesa);
        });

        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}

function eliminarMesa(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        cargarMesas();
      } else {
        console.error("Error al eliminar la mesa");
      }
    })
    .catch(err => console.error("Error al eliminar la mesa:", err));
}
