
document.addEventListener('DOMContentLoaded', function() {
      // Recuperamos el número de mesa desde la URL.  Si no existe
      // (p. ej. debido a que el usuario recargó la página y perdió los
      // parámetros) usamos localStorage como respaldo.  Esto garantiza que
      // el número de mesa siempre se muestre en la vista de apertura.
      const params = new URLSearchParams(window.location.search);
      const numeroMesa = params.get('mesa') || localStorage.getItem('mesa_numero');

      const displayMesaElement = document.getElementById('mesa-seleccionada-numero');
      if (displayMesaElement) {
        displayMesaElement.textContent = numeroMesa || '';
      }

      const minusBtn = document.querySelector('.btn.minus');
      const plusBtn = document.querySelector('.btn.plus');
      const countSpan = document.getElementById('num-personas-display');

      let currentCount = parseInt(countSpan.textContent);

      minusBtn.addEventListener('click', () => {
        if (currentCount > 0) {
          currentCount--;
          countSpan.textContent = currentCount;
        }
      });

      plusBtn.addEventListener('click', () => {
        currentCount++;
        countSpan.textContent = currentCount;
      });


      function abrirModal(idModal) {
        document.getElementById(idModal).style.display = 'flex';
      }

      function cerrarModal(idModal) {
        document.getElementById(idModal).style.display = 'none';
      }

      document.getElementById('open-guardar-modal').addEventListener('click', () => {
        abrirModal('modal-confirmar-guardar-apertura');
      });

      document.getElementById('confirmarGuardarApertura').addEventListener('click', async () => {
        /*
         * Al confirmar la apertura de la mesa por parte de un mesero,
         * actualizamos el estado de la mesa en el servidor de forma
         * análoga al comportamiento de administrador.  Utilizamos
         * localStorage para recuperar el id de mesa, su número, el id de
         * usuario y el número de personas seleccionado.  Luego hacemos
         * un PUT al endpoint correspondiente y redirigimos al listado de
         * comandas.
         */
        /*
         * Recuperamos los identificadores de la mesa desde localStorage o,
         * en su defecto, desde los parámetros de consulta de la URL.  En
         * panel_mesa_mesero ahora almacenamos id y número en localStorage
         * cuando el usuario selecciona una mesa, pero aun así soportamos
         * la obtención desde los parámetros por si se accede vía enlace
         * directo (por ejemplo escribiendo la URL a mano o recargando la
         * página).  Esto evita que la actualización falle si no existe
         * información previa en el almacenamiento local.
         */
        const paramsURL = new URLSearchParams(window.location.search);
        const idFromParam = paramsURL.get('id');
        const numeroFromParam = paramsURL.get('mesa');
        const mesaId = localStorage.getItem('mesa_id') || idFromParam;
        const mesaNumero = localStorage.getItem('mesa_numero') || numeroFromParam;
        // Para mesas abiertas por un mesero debemos usar su id_mesero, si
        // existe.  Solo en caso extremo donde no esté definido recurrimos
        // a id_usuario (p. ej. para administrador).  Esto asegura que la
        // mesa quede asociada correctamente al mesero en panel_mesa.
        const idUsuario = parseInt(localStorage.getItem('id_mesero') || localStorage.getItem('id_usuario') || '0', 10) || 1;
        const numPersonas = currentCount;
        if (mesaId && mesaNumero) {
          const payload = {
            id_mesa: parseInt(mesaId, 10),
            id_mesero: idUsuario,
            id_cuenta: null,
            num_personas: numPersonas,
            num_mesa: parseInt(mesaNumero, 10),
            status: false
          };
          try {
            await fetch(`http://3.214.208.156:7000/mesas/${mesaId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (err) {
            console.error('Error al actualizar mesa:', err);
          }
        }
        // Guardamos el número de personas en localStorage para poder
        // recuperarlo posteriormente al consultar la cuenta.  De este
        // modo, la vista de cuentas puede mostrar cuántas personas se
        // registraron en la apertura de la mesa sin necesidad de
        // consultar nuevamente al servidor.
        try {
          localStorage.setItem('mesa_num_personas', numPersonas.toString());
        } catch (storageErr) {
          console.warn('No se pudo guardar el número de personas en localStorage:', storageErr);
        }
        // Redirigimos a comandas con los parámetros para la mesa abierta
        const query = mesaNumero && mesaId ? `?mesa=${mesaNumero}&id=${mesaId}` : '';
        window.location.href = `/src/features/vista_comandas/Comandas.html${query}`;
        cerrarModal('modal-confirmar-guardar-apertura');
      });

      document.getElementById('open-cancelar-modal').addEventListener('click', () => {
        abrirModal('modal-confirmar-cancelar-apertura');
      });

      document.getElementById('confirmarCancelarApertura').addEventListener('click', () => {
        window.location.href = '/src/features/panel_mesa/PanelMesaMesero.html';
        cerrarModal('modal-confirmar-cancelar-apertura');
      });

      window.cerrarModal = cerrarModal;
    });