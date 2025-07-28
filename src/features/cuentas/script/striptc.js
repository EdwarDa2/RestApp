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