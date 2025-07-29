const apiUrl = "http://3.214.208.156:7000/mesas";
const contenedorMesas = document.getElementById("contenedor-mesas");
const btnAgregar = document.getElementById("btn-agregar-mesa");

let meseroId = parseInt(localStorage.getItem('id_mesero') || '1', 10);

// ⏫ Igual que en administrador: calcular número de mesa basado en BD
async function calcularSiguienteNumeroMesa() {
  const res = await fetch(apiUrl);
  const mesas = await res.json();
  const maxNum = mesas.reduce((max, m) => Math.max(max, m.num_mesa), 0);
  return maxNum + 1;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarMesas();
});

// Agregar mesa (solo el mesero actual puede hacerlo)
btnAgregar.addEventListener("click", async () => {
  const siguiente = await calcularSiguienteNumeroMesa();

  const nuevaMesa = {
    id_mesero: meseroId,
    id_cuenta: null,
    num_personas: 0,
    num_mesa: siguiente,
    status: true
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaMesa)
    });
    if (res.ok) cargarMesas();
    else console.error("Error al crear mesa");
  } catch (err) {
    console.error("Error:", err);
  }
});

// Cargar las mesas
function cargarMesas() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(mesas => {
      contenedorMesas.innerHTML = "";
      mesas.forEach(mesa => {
        const enlaceMesa = document.createElement("a");
        enlaceMesa.className = "aviso mesa " + (mesa.status ? "libre" : "ocupada");

        if (mesa.status) {
          enlaceMesa.href = `/src/features/apertura_mesa/vistaMesero.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
          enlaceMesa.addEventListener('click', () => {
            localStorage.setItem('mesa_id', mesa.id_mesa);
            localStorage.setItem('mesa_numero', mesa.num_mesa);
          });
        } else if (mesa.id_mesero === meseroId) {
          enlaceMesa.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
          enlaceMesa.addEventListener('click', () => {
            localStorage.setItem('mesa_id', mesa.id_mesa);
            localStorage.setItem('mesa_numero', mesa.num_mesa);
          });
        } else {
          enlaceMesa.href = '#';
          enlaceMesa.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Esta mesa está asignada a otro mesero.');
          });
        }

        enlaceMesa.innerHTML = `
          <div class="aviso-contenido">
            <span class="numero">${mesa.num_mesa}</span>
            <img src="${mesa.status ? '/src/assets/icono.png' : '/src/assets/ocupado.png'}" class="icono" alt="Mesa" />
            <span class="estado">${mesa.status ? "Libre" : "Ocupada"}</span>
          </div>
        `;

        contenedorMesas.appendChild(enlaceMesa);
      });
    })
    .catch(err => console.error("Error al cargar mesas", err));
}
