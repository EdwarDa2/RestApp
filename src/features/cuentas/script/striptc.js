document.addEventListener("DOMContentLoaded", () => {
  async function cargarCuenta() {
    const idComanda = localStorage.getItem("id_comanda");
    if (!idComanda) return console.error("❌ No se encontró id_comanda en localStorage");

    try {
      console.log("✅ ID COMANDA:", idComanda);
      const res = await fetch(`http://localhost:7000/comandas/${idComanda}`);
      const data = await res.json();
      const comanda = Array.isArray(data) ? data[0] : data;

      if (comanda && Array.isArray(comanda.listaProductos)) {
        const tbody = document.querySelector(".receipt-table tbody");
        tbody.innerHTML = "";
        let subtotal = 0;

        comanda.listaProductos.forEach(det => {
          const tr = document.createElement("tr");
          const nombre = det.nombreProducto;
          const precio = parseFloat(det.precio);
          subtotal += precio;

          tr.innerHTML = `
            <td>${nombre}</td>
            <td>$${precio.toFixed(2)}</td>
          `;
          tbody.appendChild(tr);
        });

        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
        document.getElementById("iva").innerText = `$${iva.toFixed(2)}`;
        document.getElementById("total").innerText = `$${total.toFixed(2)}`;
      } else {
        console.error("❌ No se encontró listaProductos");
      }
    } catch (error) {
      console.error("❌ Error al cargar la cuenta:", error);
    }
  }

  cargarCuenta(); // ⬅️ Llama la función

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

  // Convertir 58mm a puntos (1 mm = 2.83465 puntos)
  const anchoTicket = 58 * 2.83465;
  const altoTicket = 150 * 2.83465; // Reducido el alto para ajustar más datos en el ticket

  const doc = new jsPDF({
    unit: 'mm',
    format: [anchoTicket, altoTicket]  // Establecer el tamaño de página como 58mm de ancho y alto reducido
  });

  // Encabezado ajustado al ancho de 58 mm
  doc.setFontSize(14); // Aumenta el tamaño de la fuente del encabezado
  doc.text("Restapp", 10, 10);  // Ajusta el título dentro del tamaño de 58 mm
  doc.setFontSize(8); // Tamaño de fuente más pequeño para la ciudad
  doc.text("Suchiapa, CHIS", 10, 18);  // Ajusta la ciudad debajo del título
  
  // Línea decorativa que separa la ciudad del contenido (ajustada a 58 mm)
  doc.setLineWidth(0.5); // Grosor de la línea
  doc.line(10, 19, anchoTicket - 10, 19); // Línea decorativa debajo de la ciudad

  let y = 25; // Ajusta la posición inicial para los items

  // Agrega los items de la tabla
  const filas = document.querySelectorAll('#tablaCuenta tr');
  doc.setFont(undefined, 'bold');
  doc.text("Item", 10, y); // Ajusta la posición del texto "Item"
  doc.text("Precio", 40, y); // Acomoda "Precio" a la derecha, dentro del ancho de 58 mm
  doc.setFont(undefined, 'normal');
  y += 5; // Reduce el espacio entre las filas

  filas.forEach(fila => {
    const columnas = fila.querySelectorAll('td');
    const item = columnas[0]?.innerText || '';
    const precio = columnas[1]?.innerText || '';
    doc.text(item, 10, y); // Alinea los items a la izquierda
    doc.text(precio, 40, y); // Alinea los precios a la derecha
    y += 6; // Reduce el espacio entre las filas
  });

  // Acomoda los subtotales en la columna "Item"
  y += 5; // Ajusta el espacio antes de subtotales
  doc.setFont(undefined, 'bold');
  doc.text("Subtotal:", 10, y);  // Ajusta "Subtotal" dentro de la columna "Item"
  doc.text(document.getElementById('subtotal').innerText, 40, y);  // Deja el precio a la derecha
  y += 5;
  doc.text("IVA:", 10, y);  // Ajusta "IVA" dentro de la columna "Item"
  doc.text(document.getElementById('iva').innerText, 40, y);  // Deja el precio a la derecha
  y += 5;
  doc.text("Total:", 10, y);  // Ajusta "Total" dentro de la columna "Item"
  doc.text(document.getElementById('total').innerText, 40, y);  // Deja el precio a la derecha

  // Guarda el PDF
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
      await fetch(`http://localhost:7000/mesas/${mesaId}`, {
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