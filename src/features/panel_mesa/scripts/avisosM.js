// Script específico para el panel de mesas del mesero.
// Se encarga de abrir el modal para capturar el código de mesero y de mostrar avisos.

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
  // Guardamos el código del mesero en localStorage para usarlo al listar mesas asignadas
  localStorage.setItem('meseroId', codigo);
  window.location.href = "/src/features/mesas_asignadas/index.html";
}


// El código a continuación era para administrar mesas (agregar/eliminar) en el panel del administrador.
// Para el panel de mesero no se necesita agregar ni eliminar mesas, por lo que se omite.

async function cargarAvisos() {

  try {
    const response = await fetch('http://3.214.208.156:7000/avisos'); 
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


