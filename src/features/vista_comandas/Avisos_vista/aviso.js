document.addEventListener('DOMContentLoaded', () => {

    const modalContainer = document.getElementById('modal-container');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalForm = document.querySelector('.modal-content form');

    // Función para abrir la modal
    const openModal = () => {
        modalContainer.style.display = 'flex';
    };

    // Función para cerrar la modal
    const closeModal = () => {
        modalContainer.style.display = 'none';
    };

    // Evento para abrir la modal al hacer clic en el botón principal
    openModalBtn.addEventListener('click', openModal);

    // Evento para cerrar la modal con el botón 'X'
    closeModalBtn.addEventListener('click', closeModal);

    // Evento para cerrar la modal al hacer clic fuera del contenido
    modalContainer.addEventListener('click', (event) => {
        // Si el elemento clickeado es el contenedor (el fondo) y no el contenido
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    // Evento para manejar el envío del formulario
    modalForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue

        // Recolectar datos del formulario
        const aviso = document.getElementById('aviso-texto').value;
        const dia = document.querySelector('.date-input').value;
        const mes = document.querySelector('.date-select').value;
        const anio = document.querySelector('.year-input').value;

        console.log('--- Aviso Enviado ---');
        console.log('Texto:', aviso);
        console.log('Fecha:', `${dia} de ${mes} de ${anio}`);

        alert('Aviso enviado! Revisa la consola para ver los datos.');
        closeModal(); // Cierra la modal después de enviar
    });

});
const subirBtn = document.getElementById("subirBtn");

subirBtn.addEventListener("click", () => {
    let contenido = document.getElementById("contenido").value;
    let anio = document.getElementById("año").value;
    let mes = document.getElementById("mes").value.padStart(2, '0');   
    let dia = document.getElementById("dia").value.padStart(2, '0');   
    let fecha = `${anio}-${mes}-${dia}`;

    fetch('http://localhost:7000/avisos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "contenido": contenido,
            "fecha": fecha,
            "id_usuario": 1
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la petición");
        }
        return response.text();
    })
    .then(data => {
        localStorage.setItem("id_aviso", data);
        alert("✅ Aviso creado con éxito. ID: " + data);
    })
    .catch(err => {
        alert("❌ " + err.message);
    });
});
