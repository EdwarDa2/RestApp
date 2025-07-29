let mesa_id = null;
let mesa_numero = null;

document.addEventListener('DOMContentLoaded', async () => {
    mesa_id = parseInt(localStorage.getItem("mesa_id"));
    mesa_numero = localStorage.getItem("mesa_numero");

    // Mostrar el nombre del usuario y el número de mesa en la barra de tareas
    const nombreUsuario = localStorage.getItem('usuario_nombre') || '';
    const usuarioSpan = document.querySelector('.barra-de-tareas .usuario');
    if (usuarioSpan) {
        if (nombreUsuario && mesa_numero) {
            usuarioSpan.textContent = `${nombreUsuario} | Mesa ${mesa_numero}`;
        } else if (nombreUsuario) {
            usuarioSpan.textContent = nombreUsuario;
        }
    }

    if (!mesa_id || !mesa_numero) {
        alert("⚠ No se seleccionó ninguna mesa. Redirigiendo...");
        const rol = localStorage.getItem('user_role');
        if (rol === 'Mesero') {
            return window.location.href = "/src/features/panel_mesa/panelMesaMesero.html";
        }
        return window.location.href = "/src/features/panel_mesa/PanelMesa.html";
    }

    console.log(`🟢 Comanda para Mesa #${mesa_numero} (ID: ${mesa_id})`);
    // Aquí podrías mostrar el número de mesa en pantalla si quieres
});

function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
}

// 🟢 Definir productos global
let productos = [];
let productosSeleccionados = [];

document.addEventListener('DOMContentLoaded', async () => {
    const guardarBtn = document.querySelector('.guardar-boton');
    const contador = document.getElementById('contador');
    const tbodyDerecha = document.getElementById('tabla-derecha-body');
    let productoSeleccionado = null;

    // 🔵 Cargar productos desde la API
    try {
        const response = await fetch('http://localhost:7000/productos');
        productos = await response.json();
        console.log('✅ Productos cargados:', productos);
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
    }

    if (guardarBtn) {
        guardarBtn.addEventListener('click', () => {
            if (!productoSeleccionado) {
                return alert('Selecciona un producto primero.');
            }

            const cantidad = parseInt(contador.textContent);
            const nuevaFila = document.createElement('tr');

            productosSeleccionados.push({
                id: productoSeleccionado.id,
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                cantidad: cantidad
            });
            console.log("🟢 Productos seleccionados:", productosSeleccionados);


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
        // Redirigir a la vista de panel de mesas según el rol del usuario
        const rol = localStorage.getItem('user_role');
        if (rol === 'Mesero') {
            window.location.href = "/src/features/panel_mesa/panelMesaMesero.html";
        } else {
            window.location.href = "/src/features/panel_mesa/PanelMesa.html";
        }
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
        const encontrado = productos.find(p => p.nombre === nombre && p.precio === precio);
       productoSeleccionado = { 
        id: encontrado?.id_producto,
        nombre, 
        precio  
        };
    });

    const btnEnviar = document.querySelector('.bot');
    btnEnviar?.addEventListener('click', async (e) => {
        e.preventDefault();

    const comentario = document.getElementById("comentario").value.trim;
    const idMesa = mesa_id;

// Validación
if (productosSeleccionados.length === 0) {
  return alert("Agrega al menos un producto.");
}

// Armar productos con ID real y comentario
const listaProductos = productosSeleccionados.map(prod => ({
  id_producto: prod.id,  // ya debe venir con id
  cantidad: prod.cantidad,
  comentario: prod.comentario || ""
}));

const comanda = {
  id_mesa: idMesa,
  fecha_hora: new Date().toISOString(),
  listaProductos
};

console.log("🟢 Comanda que se enviará:", comanda);

try {
  const response = await fetch("http://localhost:7000/comandas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comanda)
  });
  if (!response.ok) {
  const errorText = await response.text();
  console.error("❌ Error del backend:", errorText);
  throw new Error(errorText);
}

// ✅ Si sí pasó el response.ok, ahora sí accedemos al JSON:
const data = await response.json();
localStorage.setItem("id_comanda", data.id_comanda);
window.location.href = "/src/features/cuentas/cuentas.html";

  
  alert("Comanda enviada con éxito ✅");
  // Aquí podrías limpiar tablas, inputs, etc.

} catch (error) {
  console.error("❌ Error al enviar comanda:", error.message);
  alert("Error al enviar la comanda ❌");
}

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

// 🔸 Generación del PDF al presionar el botón
document.getElementById('btn-enviar').addEventListener('click', function (e) {
    e.preventDefault();

    const productos = [];
    const rows = document.querySelectorAll('#tabla-derecha-body tr');
    rows.forEach(row => {
        const cantidad = row.querySelector('td:nth-child(1)').textContent;
        const nombre = row.querySelector('td:nth-child(2)').textContent;
        productos.push({ cantidad, nombre });
    });

    const comentario = document.getElementById('comentario').value || '';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        unit: 'mm',
        format: [58, 80]
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);

    doc.setFontSize(8);
    doc.text('RESTAPP', 10, 10);

    const columnWidth = 18;
    const startX = 10;
    let yPosition = 18;

    doc.text('Cantidad', startX, yPosition);
    doc.text('Producto', startX + columnWidth + 2, yPosition);
    yPosition += 5;

    productos.forEach(producto => {
        doc.text(producto.cantidad, startX, yPosition);
        const maxWidth = 35;
        const nombreDividido = doc.splitTextToSize(producto.nombre, maxWidth);
        doc.text(nombreDividido, startX + columnWidth + 2, yPosition);
        yPosition += (nombreDividido.length * 5);
    });

    if (comentario) {
        yPosition += 4;
        doc.text('Comentario:', startX, yPosition);
        yPosition += 5;
        doc.text(comentario, startX, yPosition);
    }

    doc.save('comanda.pdf');
});
