document.getElementById('btnImprimir').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Restapp", 20, 20);
  doc.setFontSize(12);
  doc.text("Suchiapa, CHIS", 20, 28);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  let y = 40;

  // Agrega los items de la tabla
  const filas = document.querySelectorAll('#tablaCuenta tr');
  doc.setFont(undefined, 'bold');
  doc.text("Item", 20, y);
  doc.text("Precio", 160, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  filas.forEach(fila => {
    const columnas = fila.querySelectorAll('td');
    const item = columnas[0]?.innerText || '';
    const precio = columnas[1]?.innerText || '';
    doc.text(item, 20, y);
    doc.text(precio, 160, y);
    y += 10;
  });

  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text("Subtotal:", 130, y);
  doc.text(document.getElementById('subtotal').innerText, 160, y);
  y += 10;
  doc.text("IVA:", 130, y);
  doc.text(document.getElementById('iva').innerText, 160, y);
  y += 10;
  doc.text("Total:", 130, y);
  doc.text(document.getElementById('total').innerText, 160, y);

  // Guarda el PDF
  doc.save("cuenta_restapp.pdf");
});
