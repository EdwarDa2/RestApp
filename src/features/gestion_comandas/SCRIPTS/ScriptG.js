// ScriptG.js

let filaSeleccionada = null;

// Espera que el documento cargue
document.addEventListener('DOMContentLoaded', () => {
  const filas = document.querySelectorAll('.comandas-tabla tbody tr');
  const btnCancelar = document.querySelector('.btn-cancelar');

  filas.forEach(fila => {
    fila.addEventListener('click', () => {
      // Deselecciona otras filas
      filas.forEach(f => f.classList.remove('seleccionada'));
      fila.classList.add('seleccionada');
      filaSeleccionada = fila;
    });
  });

  btnCancelar.addEventListener('click', () => {
    if (!filaSeleccionada) return;

    const datos = filaSeleccionada.querySelector('td').innerHTML.split('<br>');
    const numero = datos[0].trim();
    const nombre = datos[1].trim();

    mostrarConfirmacion(numero, nombre);
  });
});

function mostrarConfirmacion(numero, nombre) {
  const modal = document.createElement('div');
  modal.classList.add('modal-confirmacion');
  modal.innerHTML = `
    <div class="modal-contenido">
      <p>¿Desea cancelar la comanda <strong>${numero}</strong> de <strong>${nombre}</strong>?</p>
      <div class="botones">
        <button class="btn-si">Sí</button>
        <button class="btn-no">No</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.btn-si').addEventListener('click', () => {
    if (filaSeleccionada) {
      filaSeleccionada.remove();
      filaSeleccionada = null;
    }
    modal.remove();
  });

  modal.querySelector('.btn-no').addEventListener('click', () => {
    modal.remove();
  });
}

