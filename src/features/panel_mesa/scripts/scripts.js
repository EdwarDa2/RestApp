const apiUrl = "http://localhost:7000/mesas";
const contenedorMesas = document.getElementById("contenedor-mesas");
const btnAgregar = document.getElementById("btn-agregar-mesa");

// Determinar el ID del mesero/admin
const userRole = localStorage.getItem('user_role');
let meseroId = userRole === 'Mesero'
  ? parseInt(localStorage.getItem('id_mesero') || '1', 10)
  : 1;

document.addEventListener("DOMContentLoaded", () => {
  cargarMesas(); // al iniciar
});

// 🧠 Nueva función para calcular siguiente número de mesa basado en BD
async function calcularSiguienteNumeroMesa() {
  const res = await fetch(apiUrl);
  const mesas = await res.json();
  const maxNum = mesas.reduce((max, m) => Math.max(max, m.num_mesa), 0);
  return maxNum + 1;
}

// Crear nueva mesa
btnAgregar.addEventListener("click", async () => {
  const siguienteNumMesa = await calcularSiguienteNumeroMesa();

  const nuevaMesa = {
    id_mesero: meseroId,
    id_cuenta: null,
    num_personas: 0,
    num_mesa: siguienteNumMesa,
    status: true
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaMesa)
    });
    if (res.ok) cargarMesas();
    else console.error("Error al agregar la mesa");
  } catch (err) {
    console.error("Error en la solicitud:", err);
  }
});

// Cargar mesas existentes
function cargarMesas() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(mesas => {
      contenedorMesas.innerHTML = "";
      mesas.forEach(mesa => {
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");

        if (mesa.status) {
          enlaceMesa.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("mesa_id", mesa.id_mesa);
            localStorage.setItem("mesa_numero", mesa.num_mesa);
            window.location.href = `/src/features/apertura_mesa/vista.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
          });
        } else {
          enlaceMesa.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("mesa_id", mesa.id_mesa);
            localStorage.setItem("mesa_numero", mesa.num_mesa);
            window.location.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
          });
        }

        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="${mesa.status ? '/src/assets/icono.png' : '/src/assets/ocupado.png'}" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
          <img src="/src/assets/eliminar.png" class="icono-eliminar" data-id="${mesa.id_mesa}" />
        `;

        const iconoEliminar = enlaceMesa.querySelector('.icono-eliminar');
        iconoEliminar.style.textAlign = 'center';
        iconoEliminar.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          eliminarMesa(mesa.id_mesa);
        });

        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}

// Eliminar mesa
function eliminarMesa(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(res => res.ok ? cargarMesas() : console.error("Error al eliminar"))
    .catch(err => console.error("Error al eliminar mesa:", err));
}
