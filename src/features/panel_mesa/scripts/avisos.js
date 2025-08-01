document.addEventListener('DOMContentLoaded', () => {
    const modalContainer = document.getElementById('modal-container');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.close-btn');

    const subirBtn = document.getElementById("subirBtn");
    const modalAvisos = document.getElementById('modalAvisos');
    const listaAvisos = document.getElementById('listaAvisos');
    const fechaAvisos = document.getElementById('fechaAvisos');
    const btnAgregar = document.getElementById("btn-agregar-mesa");
    const contenedor = document.getElementById("contenedor-mesas");
    let contador = contenedor.querySelectorAll(".mesa").length;

    openModalBtn.addEventListener('click', () => {
        modalContainer.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });

    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });

    subirBtn.addEventListener("click", (event) => {
        event.preventDefault();
        let contenido = document.getElementById("contenido").value;

        fetch('http://3.214.208.156:7000/avisos', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "contenido": contenido,
                "id_admin": 1
            })
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al crear aviso");
            return response.text();
        })
        .then(data => {
            alert("✅ Aviso creado con éxito. ID: " + data);
            modalContainer.style.display = 'none';
            document.getElementById("contenido").value = "";
            if (modalAvisos.style.display === "flex") {
                cargarAvisos();
            }
        })
        .catch(err => alert("❌ " + err.message));
    });

   
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
});