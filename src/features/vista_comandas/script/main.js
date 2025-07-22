
function abrirModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const guardarBtn = document.querySelector('.guardar-boton');
  const contador = document.getElementById('contador');
  const tbodyDerecha = document.getElementById('tabla-derecha-body');
  let productoSeleccionado = null;

  if (guardarBtn) {
    guardarBtn.addEventListener('click', () => {
      if (!productoSeleccionado) {
        return alert('Selecciona un producto primero.');
      }

      const cantidad = parseInt(contador.textContent);
      const nuevaFila = document.createElement('tr');

      nuevaFila.innerHTML = `
        <td>${cantidad}</td>
        <td>${productoSeleccionado.nombre}</td>
        <td>$${productoSeleccionado.precio}</td>
        <td><img src="/src/assets/Menos.jpg" class="icono-eliminar eliminar-producto" style="cursor:pointer;"></td>
      `;

      tbodyDerecha.appendChild(nuevaFila);
    });
  }

  document.querySelector('#confirmarGuardar')?.addEventListener('click', () => {
    cerrarModal('modal-confirmar-guardar');
    setTimeout(() => abrirModal('modal-comanda-guardada'), 300);
  });

  document.querySelector('#modal-comanda-guardada .modal-btn')?.addEventListener('click', () => {
    window.location.href = "/src/features/cuentas/cuentas.html";
  });

  document.getElementById('btnMesas')?.addEventListener('click', () => {
    abrirModal('modal-salir-mesas');
  });

  document.getElementById('confirmarSalir')?.addEventListener('click', () => {
    window.location.href = "/src/features/panel_mesa/PanelMesa.html";
  });

  const btnSumar = document.getElementById('btnSumar');
  const btnRestar = document.getElementById('btnRestar');

  btnSumar?.addEventListener('click', () => {
    let valor = parseInt(contador.textContent);
    contador.textContent = valor + 1;
  });

  btnRestar?.addEventListener('click', () => {
    let valor = parseInt(contador.textContent);
    if (valor > 1) contador.textContent = valor - 1;
  });

  const productos = [
    { nombre: 'Coca-Cola', precio: 20, categoria: 'Bebida', subcategoria: 'Refresco' },
    { nombre: 'Pepsi', precio: 18, categoria: 'Bebida', subcategoria: 'Refresco' },
    { nombre: 'Agua', precio: 12, categoria: 'Bebida', subcategoria: 'Natural' },
    { nombre: 'Hamburguesa', precio: 45, categoria: 'Comidas', subcategoria: 'Rápida' },
    { nombre: 'Pizza', precio: 60, categoria: 'Comidas', subcategoria: 'Rápida' },
    { nombre: 'Arroz con pollo', precio: 50, categoria: 'Comidas', subcategoria: 'Casera' },
    { nombre: 'Helado', precio: 30, categoria: 'Postres', subcategoria: 'Frío' },
    { nombre: 'Pastel', precio: 40, categoria: 'Postres', subcategoria: 'Repostería' },
    { nombre: 'Gelatina', precio: 25, categoria: 'Postres', subcategoria: 'Ligero' },
  ];

  const tablaIzquierda = document.querySelectorAll('.tabla-contenedor table tbody')[0];
  const categoriaSelect = document.querySelectorAll('select')[0];

  function mostrarProductos(filtrados) {
    tablaIzquierda.innerHTML = '';
    filtrados.forEach(prod => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${prod.nombre}</td><td>$${prod.precio}</td>`;
      tablaIzquierda.appendChild(row);
    });
  }

  categoriaSelect.addEventListener('change', () => {
    const valor = categoriaSelect.value;
    const filtrados = valor === 'Selecciona la categoría'
      ? productos
      : productos.filter(p => p.categoria === valor);
    mostrarProductos(filtrados);
  });

    const inputBuscar = document.querySelector('.buscar');

  inputBuscar.addEventListener('input', () => {
    const valor = inputBuscar.value.trim().toLowerCase();
    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().startsWith(valor)
    );
    mostrarProductos(filtrados);
  });


  const tablaScrollContainer = document.querySelectorAll('.tabla-contenedor')[0];
  const flechaArriba = document.querySelector('.flechas .flechaTop');
  const flechaAbajo = document.querySelector('.flechas .flechaBot');

  flechaAbajo?.addEventListener('click', () => {
    tablaScrollContainer.scrollBy({ top: 100, behavior: 'smooth' });
  });

  flechaArriba?.addEventListener('click', () => {
    tablaScrollContainer.scrollBy({ top: -100, behavior: 'smooth' });
  });

  tablaIzquierda.addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (!fila) return;
    [...tablaIzquierda.children].forEach(tr => tr.classList.remove('selected'));
    fila.classList.add('selected');
    const nombre = fila.cells[0].textContent;
    const precio = parseFloat(fila.cells[1].textContent.replace('$', ''));
    productoSeleccionado = { nombre, precio };
  });

  const btnEnviar = document.querySelector('.bot');
  btnEnviar?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal('modal-confirmar-guardar');
  });

  tbodyDerecha.addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminar-producto')) {
      const fila = e.target.closest('tr');
      const cantidadCelda = fila.querySelector('td');
      let cantidad = parseInt(cantidadCelda.textContent);

      if (cantidad > 1) {
        cantidadCelda.textContent = cantidad - 1;
      } else {
        fila.remove();
      }
    }
  });


  const tablaScrollDerecha = document.querySelectorAll('.tabla-contenedor')[1];
  const flechaArribaDer = document.querySelector('.flechas2 .flechaTop');
  const flechaAbajoDer = document.querySelector('.flechas2 .flechaBot');

  flechaAbajoDer?.addEventListener('click', () => {
    tablaScrollDerecha.scrollBy({ top: 100, behavior: 'smooth' });
  });

  flechaArribaDer?.addEventListener('click', () => {
    tablaScrollDerecha.scrollBy({ top: -100, behavior: 'smooth' });
  });
});