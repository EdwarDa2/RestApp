document.addEventListener("DOMContentLoaded", () => {
  /**
   * Cargar la cuenta mostrando todos los productos de todas las
   * comandas asociadas a la mesa actual.  En lugar de depender del
   * identificador de una única comanda almacenada en localStorage,
   * esta función obtiene la lista de todas las comandas del backend,
   * filtra las que correspondan a la mesa seleccionada y agrega
   * cada producto a la tabla de la cuenta.  De este modo, cuando se
   * envíen comandas adicionales para la misma mesa, sus productos
   * aparecerán automáticamente en la cuenta.
   */
  async function cargarCuenta() {
    const mesaIdStr = localStorage.getItem('mesa_id');
    const mesaId = parseInt(mesaIdStr, 10);
    if (!mesaId) {
      console.error('❌ No se encontró mesa_id en localStorage');
      return;
    }
    const tbody = document.querySelector('.receipt-table tbody');
    tbody.innerHTML = '';
    // Mapa para agregar las cantidades por producto.  La clave es el
    // nombre del producto y el valor contiene la cantidad total y el
    // precio unitario.
    const agregados = {};
    let subtotal = 0;
    try {
      // Obtener todas las comandas
      const res = await fetch('http://3.214.208.156:7000/comandas');
      const allComandas = await res.json();
      if (!Array.isArray(allComandas)) {
        console.error('❌ La respuesta de comandas no es un arreglo');
        return;
      }
      // Filtrar las comandas de la mesa actual
      const comandasMesa = allComandas.filter(c => parseInt(c.id_mesa, 10) === mesaId);
      for (const com of comandasMesa) {
        try {
          const detRes = await fetch(`http://3.214.208.156:7000/comandas/${com.id_comanda}`);
          const detData = await detRes.json();
          const detalle = Array.isArray(detData) ? detData[0] : detData;
          if (detalle && Array.isArray(detalle.listaProductos)) {
            detalle.listaProductos.forEach(det => {
              const nombre = det.nombreProducto;
              const precioUnitario = parseFloat(det.precio) || 0;
              // Acumular cantidad y precio unitario para cada producto
              if (!agregados[nombre]) {
                agregados[nombre] = { cantidad: 0, precioUnitario };
              }
              agregados[nombre].cantidad += 1;
              // En caso de que el precio unitario cambie entre comandas,
              // actualizamos al último valor recibido.
              agregados[nombre].precioUnitario = precioUnitario;
            });
          }
        } catch (detalleError) {
          console.error('❌ Error al obtener detalles de comanda:', detalleError);
        }
      }
      // Generar filas a partir del mapa de agregados
      Object.keys(agregados).forEach(nombre => {
        const { cantidad, precioUnitario } = agregados[nombre];
        const precioTotal = precioUnitario * cantidad;
        subtotal += precioTotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${cantidad > 1 ? cantidad + ' x ' : ''}${nombre}</td>
          <td>$${precioTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
      const iva = subtotal * 0.16;
      const total = subtotal + iva;
      document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`;
      document.getElementById('iva').innerText = `$${iva.toFixed(2)}`;
      document.getElementById('total').innerText = `$${total.toFixed(2)}`;
    } catch (error) {
      console.error('❌ Error al cargar la cuenta:', error);
    }
  }

  cargarCuenta();

  // Mostrar el nombre del usuario y el número de mesa en la barra de tareas
  const nombreUsuario = localStorage.getItem('usuario_nombre') || '';
  const mesaNumero = localStorage.getItem('mesa_numero') || '';
  const usuarioSpan = document.querySelector('.barra-de-tareas .usuario');
  if (usuarioSpan) {
    if (nombreUsuario && mesaNumero) {
      usuarioSpan.textContent = `${nombreUsuario} | Mesa ${mesaNumero}`;
    } else if (nombreUsuario) {
      usuarioSpan.textContent = nombreUsuario;
    }
  }
  // Rellenamos el número de mesa en el panel izquierdo si existe un elemento con id table-number.
  const mesaNumberElem = document.getElementById('table-number');
  if (mesaNumberElem) {
    mesaNumberElem.textContent = mesaNumero || '';
  }
  // Rellenamos el número de personas seleccionado durante la apertura de la mesa.  Si no existe
  // la clave en localStorage no se muestra nada.  Esto permite a la vista de cuentas
  // mostrar cuántos comensales hay asociados a la cuenta.
  const numPersonasElem = document.getElementById('num-personas');
  const numPersonasStored = localStorage.getItem('mesa_num_personas');
  if (numPersonasElem && numPersonasStored) {
    numPersonasElem.textContent = numPersonasStored;
  }
  // Configurar redirección del enlace Mesas según el rol
  const linkMesas = document.getElementById('linkMesas');
  if (linkMesas) {
    linkMesas.addEventListener('click', (e) => {
      e.preventDefault();
      const rol = localStorage.getItem('user_role');
      if (rol === 'Mesero') {
        window.location.href = '/src/features/panel_mesa/panelMesaMesero.html';
      } else {
        window.location.href = '/src/features/panel_mesa/PanelMesa.html';
      }
    });
  }
});

document.getElementById('btnImprimir').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    unit: 'mm',
    format: [58, 200], // ancho 58mm, alto extendido para evitar corte
  });

  doc.setFontSize(10);
  doc.text("Restapp", 29, 8, { align: "center" });

  doc.setFontSize(7);
  doc.text("Suchiapa, CHIS", 29, 13, { align: "center" });

  // Línea divisoria
  doc.setLineWidth(0.2);
  doc.line(2, 16, 56, 16);

  let y = 20;

  doc.setFont(undefined, 'bold');
  doc.text("Item", 2, y);
  doc.text("Precio", 47, y, { align: 'right' });
  doc.setFont(undefined, 'normal');
  y += 4;

  const filas = document.querySelectorAll('#tablaCuenta tr');

  filas.forEach(fila => {
    const columnas = fila.querySelectorAll('td');
    const item = columnas[0]?.innerText || '';
    const precio = columnas[1]?.innerText || '';

    const itemLines = doc.splitTextToSize(item, 44); // 44mm disponibles para "Item"
    doc.text(itemLines, 2, y);
    doc.text(precio, 47, y, { align: 'right' });

    y += itemLines.length * 4;
  });

  y += 3;
  doc.setFont(undefined, 'bold');
  doc.text("Subtotal:", 2, y);
  doc.text(document.getElementById('subtotal').innerText, 47, y, { align: 'right' });
  y += 4;
  doc.text("IVA:", 2, y);
  doc.text(document.getElementById('iva').innerText, 47, y, { align: 'right' });
  y += 4;
  doc.text("Total:", 2, y);
  doc.text(document.getElementById('total').innerText, 47, y, { align: 'right' });

  doc.save("cuenta_restapp.pdf");
});


// Maneja el cierre de la cuenta.  Este botón permite liberar la mesa y
// actualizar su estado en el servidor.  También redirige al panel de
// mesas correspondiente según el rol del usuario (administrador o mesero).
const cerrarBtn = document.getElementById('btnCerrarCuenta');
if (cerrarBtn) {
  cerrarBtn.addEventListener('click', async () => {
    const mesaId = localStorage.getItem('mesa_id');
    const mesaNumero = localStorage.getItem('mesa_numero');
    // Para liberar la mesa utilizamos el id del mesero si existe; en caso
    // contrario el id del usuario (administrador).  Esto asegura que la
    // relación id_mesero quede coherente cuando se abre y se cierra una mesa.
    const idUsuario = parseInt(localStorage.getItem('id_mesero') || localStorage.getItem('id_usuario') || '0', 10) || 1;
    // Si no existe información de la mesa en localStorage, no hacemos nada
    if (!mesaId || !mesaNumero) {
      console.error('No se pudo obtener la información de la mesa para cerrar la cuenta');
      return;
    }
    const payload = {
      id_mesa: parseInt(mesaId, 10),
      id_mesero: idUsuario,
      id_cuenta: null,
      num_personas: 0,
      num_mesa: parseInt(mesaNumero, 10),
      status: true
    };
    try {
      await fetch(`http://3.214.208.156:7000/mesas/${mesaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error al cerrar la mesa:', err);
    }
    // Limpiamos información relacionada con la comanda
    localStorage.removeItem('id_comanda');
    // También eliminamos el número de personas almacenado para la mesa.
    localStorage.removeItem('mesa_num_personas');
    // Redirigimos según el rol del usuario
    const rol = localStorage.getItem('user_role');
    if (rol === 'Administrador') {
      window.location.href = '/src/features/panel_mesa/PanelMesa.html';
    } else if (rol === 'Mesero') {
      window.location.href = '/src/features/panel_mesa/panelMesaMesero.html';
    } else {
      // Si no hay rol definido, regresamos al login
      window.location.href = '/src/features/login/login.html';
    }
  });
}