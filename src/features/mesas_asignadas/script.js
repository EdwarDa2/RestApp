// Script para mostrar las mesas asignadas a un mesero.
//
// Esta vista se encarga de consultar al backend todas las mesas
// disponibles y filtrar únicamente aquellas que pertenecen al mesero
// autenticado y que están ocupadas (es decir, ya fueron aperturadas).
// Cada mesa se representa como un cuadro con el número y un icono.
// Al hacer clic sobre una mesa se redirige a la vista de comanda para
// poder continuar agregando productos o revisar el detalle.

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('grid-mesas');
  if (!grid) return;
  grid.innerHTML = '';

  // Obtener el identificador del mesero.  En la aplicación existen
  // dos posibles claves en localStorage: `id_mesero` (configurado al
  // iniciar sesión) y `meseroId` (ingresado manualmente al usar la
  // opción "Mis mesas").  Se intenta usar primero `id_mesero` por
  // coherencia con el resto de la app; si no existe, se usa
  // `meseroId`.
  const meseroIdStr = localStorage.getItem('id_mesero') || localStorage.getItem('meseroId');
  const meseroId = parseInt(meseroIdStr, 10);
  if (!meseroId) {
    grid.innerHTML = '<p>No se encontró el identificador de mesero.</p>';
    return;
  }

  try {
    const res = await fetch('http://localhost:7000/mesas');
    const mesas = await res.json();
    if (!Array.isArray(mesas)) {
      grid.innerHTML = '<p>No se pudieron obtener las mesas.</p>';
      return;
    }
    // Filtrar mesas asignadas al mesero y que estén ocupadas (status=false)
    const asignadas = mesas.filter(m => parseInt(m.id_mesero, 10) === meseroId && m.status === false);
    if (asignadas.length === 0) {
      grid.innerHTML = '<p>No tienes mesas asignadas en este momento.</p>';
      return;
    }
    asignadas.forEach(mesa => {
      const div = document.createElement('div');
      div.className = 'mesa';
      div.innerHTML = `
        <span class="numero">${mesa.num_mesa}</span>
        <div class="icono"></div>
      `;
      // Guardar en localStorage para mantener coherencia al abrir la
      // comanda y redirigir a la vista de comandas.
      div.addEventListener('click', () => {
        localStorage.setItem('mesa_id', mesa.id_mesa);
        localStorage.setItem('mesa_numero', mesa.num_mesa);
        // Eliminamos el identificador de comanda previa para que la
        // siguiente operación cree una nueva si es necesario; el flujo
        // de actualización de comandas se encargará de mantener
        // continuidad cuando se abra desde Comandas.html.
        // Nota: si se desea mantener la comanda actual, no se debería
        // limpiar esta clave.
        // localStorage.removeItem('id_comanda');
        window.location.href = `/src/features/vista_comandas/Comandas.html?mesa=${mesa.num_mesa}&id=${mesa.id_mesa}`;
      });
      grid.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar mesas asignadas:', error);
    grid.innerHTML = '<p>Error al cargar mesas asignadas.</p>';
  }
});