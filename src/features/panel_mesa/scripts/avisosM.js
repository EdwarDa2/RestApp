let contadorMesas = 2; 
const modal = document.getElementById("modalMesero");
const modalAvisos = document.getElementById('modalAvisos');
const listaAvisos = document.getElementById('listaAvisos');
const fechaAvisos = document.getElementById('fechaAvisos');

document.getElementById("boton-agregar-aviso").addEventListener("click", function (event) {
  event.preventDefault(); 
  modal.style.display = "flex";
});

function cerrarModal() {
  modal.style.display = "none";
}

function guardarCodigo() {
  const codigo = document.getElementById("codigoMesero").value;
  if (codigo.trim() === "") {
    alert("Por favor ingrese un código");
    return;
  }

  window.location.href = "/src/features/mesas_asignadas/index.html";
}


function inicializarMesaEvents(mesaElement) {
    const numeroMesa = mesaElement.querySelector('.numero').textContent;
    mesaElement.href = `/src/features/apertura_mesa/vista.html?mesa=${numeroMesa}`;

    const eliminar = mesaElement.querySelector('.icono-eliminar');
    if (eliminar) {
        eliminar.addEventListener('click', (e) => {
            e.preventDefault(); 
            mesaElement.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mesaInicial = document.querySelector('.mesa');
    if (mesaInicial) {
        inicializarMesaEvents(mesaInicial);
    }

    document.getElementById('btn-agregar-mesa').addEventListener('click', () => {
        const contenedor = document.querySelector('.contenedor');

        const nuevaMesa = document.createElement('a');
        const numeroActual = contadorMesas.toString().padStart(2, '0'); 

        nuevaMesa.className = "mesa libre";
        nuevaMesa.innerHTML = `
            <span class="numero">${numeroActual}</span>
            <img src="/src/assets/icono.png" class="icono" alt="Mesa" />
            <span class="estado">Libre</span>
            <div class="icono-eliminar">
                <img src="/src/assets/eliminar.png" alt="Eliminar">
            </div>
        `;

        inicializarMesaEvents(nuevaMesa);

        contenedor.appendChild(nuevaMesa);
        contadorMesas++; 
    });

    
});

async function cargarAvisos() {

  try {
    const response = await fetch('http://localhost:7000/avisos'); 
    if (!response.ok) throw new Error('Error al obtener avisos');


            const data = await response.json();
            listaAvisos.innerHTML = "";

            data.forEach(aviso => {
                let hora = "Sin hora";
                if (aviso.fecha && Array.isArray(aviso.fecha)) {
                    const year = aviso.fecha[0];
                    const month = aviso.fecha[1] - 1; 
                    const day = aviso.fecha[2];
                    const hours = aviso.fecha[3] || 0;
                    const minutes = aviso.fecha[4] || 0;
                    const seconds = aviso.fecha[5] || 0; 

                    const fecha = new Date(year, month, day, hours, minutes, seconds);

                    if (!isNaN(fecha.getTime())) {
                        hora = fecha.toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false 
                        });
                    } else {
                        console.warn("Fecha inválida después de construirla con array:", aviso.fecha);
                    }
                }

                const li = document.createElement("li");
                li.textContent = `[${hora}] ${aviso.contenido || "Sin contenido"}`;
                listaAvisos.appendChild(li);
            });

            const hoy = new Date();
            fechaAvisos.textContent = hoy.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

        } catch (error) {
            console.error("Error cargando avisos:", error);
            listaAvisos.innerHTML = "<li>Error al cargar los avisos.</li>";
        }
    }

    document.getElementById('btnCampana').addEventListener('click', async () => {
        await cargarAvisos();
        modalAvisos.style.display = "flex";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modalAvisos) cerrarModalAvisos();
    });

    function cerrarModalAvisos() {
        modalAvisos.style.display = "none";
    }

    setInterval(() => {
        if (modalAvisos.style.display === "flex") {
            cargarAvisos();
        }
    }, 30000); 


