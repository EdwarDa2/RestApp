let filaSeleccionada = null;
let idComandaSeleccionada = null;

document.addEventListener('DOMContentLoaded', () => {
  const tablaComandas = document.getElementById('tablaComandas').getElementsByTagName('tbody')[0];
  const btnCancelar = document.querySelector('.btn-cancelar');

  async function obtenerComandas() {
    try {
      const response = await fetch('http://localhost:7000/comandas');
      const data = await response.json();
      tablaComandas.innerHTML = '';

      data.forEach(comanda => {
        const row = tablaComandas.insertRow();
        row.dataset.idComanda = comanda.id_comanda;
        row.innerHTML = `
          <td>${comanda.id_comanda}</td>
          <td>${comanda.id_mesa}</td>
          <td>${comanda.fecha_hora}</td>
        `;

        row.addEventListener('click', () => {
          document.querySelectorAll('.comandas-tabla tbody tr')
            .forEach(fila => fila.classList.remove('seleccionada'));
          row.classList.add('seleccionada');
          filaSeleccionada = row;
          idComandaSeleccionada = comanda.id_comanda;
        });
      });
    } catch (error) {
      console.error('Error al obtener las comandas:', error);
    }
  }

  btnCancelar.addEventListener('click', () => {
    if (!filaSeleccionada || !idComandaSeleccionada) {
      alert("Selecciona una comanda para cancelar.");
      return;
    }

    mostrarConfirmacion(idComandaSeleccionada);
  });

  async function eliminarComanda(id) {
    try {
      const response = await fetch(`http://localhost:7000/comandas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Comanda cancelada correctamente');
        obtenerComandas();
        filaSeleccionada = null;
        idComandaSeleccionada = null;
      } else {
        throw new Error('No se pudo cancelar la comanda');
      }
    } catch (error) {
      console.error('Error al eliminar comanda:', error);
      alert('❌ Error al cancelar la comanda.');
    }
  }

  function mostrarConfirmacion(idComanda) {
    const modal = document.createElement('div');
    modal.classList.add('modal-confirmacion');
    modal.innerHTML = `
      <div class="modal-contenido">
        <p>¿Desea cancelar la comanda <strong>#${idComanda}</strong>?</p>
        <div class="botones">
          <button class="btn-si">Sí</button>
          <button class="btn-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.btn-si').addEventListener('click', () => {
      eliminarComanda(idComanda);
      modal.remove();
    });

    modal.querySelector('.btn-no').addEventListener('click', () => {
      modal.remove();
    });
  }

  obtenerComandas();
});
