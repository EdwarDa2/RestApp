function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}

let productosSeleccionados = [];

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

            productosSeleccionados.push({
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                cantidad: cantidad
            });


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

        const comentario = document.getElementById('comentario').value || '';

        const listaProductos = productosSeleccionados.map((prod, index) => ({
            id_detalle: index + 1,
            id_comanda: 1,
            id_producto: 1, // necesitas esta función o un mapa
            cantidad: prod.cantidad,
            nombreProducto: prod.nombre,
            comentario: comentario
        }));

        const comanda = {
            id_comanda: 1,
            id_mesa: 1,
            fecha_hora: obtenerFechaHoraActual(),
            listaProductos: listaProductos
        };

        console.log('Comanda enviada:', comanda);

        fetch('http://localhost:7000/comandas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comanda)
        })
         
  .then(response => {
  if (!response.ok) throw new Error('Error al guardar comanda');
  return response.text();
 })
.then(data => {
    console.log('Comanda guardada con éxito:', data); 
    abrirModal('modal-confirmar-guardar');
})
.catch(error => {
    console.error('Error al enviar comanda:', error);
    alert('Error al enviar la comanda.');
});
    });

    function obtenerFechaHoraActual() {
        return new Date().toISOString().slice(0, 19); // "2025-07-23T23:19:48"
    }


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
