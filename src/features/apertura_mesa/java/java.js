
document.addEventListener('DOMContentLoaded', function() {
      const params = new URLSearchParams(window.location.search);
      const numeroMesa = params.get('mesa');

      const displayMesaElement = document.getElementById('mesa-seleccionada-numero');
      if (displayMesaElement && numeroMesa) {
        displayMesaElement.textContent = numeroMesa;
      } else if (displayMesaElement) {
        displayMesaElement.textContent = '';
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

      document.getElementById('confirmarGuardarApertura').addEventListener('click', () => {
        window.location.href = '/src/features/vista_comandas/Comandas.html';
        cerrarModal('modal-confirmar-guardar-apertura');
      });

      document.getElementById('open-cancelar-modal').addEventListener('click', () => {
        abrirModal('modal-confirmar-cancelar-apertura');
      });

      document.getElementById('confirmarCancelarApertura').addEventListener('click', () => {
        window.location.href = '/src/features/panel_mesa/PanelMesa.html';
        cerrarModal('modal-confirmar-cancelar-apertura');
      });

      window.cerrarModal = cerrarModal;
    });