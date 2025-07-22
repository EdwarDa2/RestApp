// Selección de elementos
const tablaBody = document.querySelector(".tabla_usuarios tbody");
const btnAgregar = document.querySelector(".btn-agregar");
const btnEliminar = document.querySelector(".btn");
let filaSeleccionada = null;

// Crear modal de agregar
const modalAgregar = document.createElement("div");
modalAgregar.innerHTML = `
  <div class="modal">
    <div class="modal-content">
      <span class="cerrar">&times;</span>
      <h2>Ingrese el Nombre del producto:</h2>
      <input type="text" id="nombre" placeholder="Nombre del producto">

      <h2>Ingrese el Precio:</h2>
      <input type="number" id="precio" placeholder="Ej. 12.50" step="0.01">

      <div class="selects">
        <select id="categoria">
          <option value="" disabled selected>Selecciona la categoría</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Comida">Comida</option>
        </select>

        <select id="subcategoria">
          <option value="" disabled selected>Selecciona la subcategoría</option>
          <option value="Refrescos">Refrescos</option>
          <option value="Postres">Postres</option>
        </select>
      </div>

      <button class="guardar">Guardar Producto</button>
    </div>
  </div>
`;
document.body.appendChild(modalAgregar);

// Mostrar modal agregar
btnAgregar.addEventListener("click", () => {
  modalAgregar.querySelector(".modal").style.display = "flex";
});

// Cerrar modal
modalAgregar.querySelector(".cerrar").addEventListener("click", () => {
  modalAgregar.querySelector(".modal").style.display = "none";
});

// Guardar producto
modalAgregar.querySelector(".guardar").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const categoria = document.getElementById("categoria").value;
  const subcategoria = document.getElementById("subcategoria").value;

  if (nombre && precio && categoria && subcategoria) {
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${nombre}</td>
      <td>$${parseFloat(precio).toFixed(2)}</td>
      <td>${categoria}</td>
      <td>${subcategoria}</td>
    `;
    tablaBody.appendChild(nuevaFila);
    modalAgregar.querySelector(".modal").style.display = "none";
    limpiarCampos();
  }
});

function limpiarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("subcategoria").value = "";
}

// Selección de fila
tablaBody.addEventListener("click", (e) => {
  const fila = e.target.closest("tr");
  if (!fila) return;

  if (filaSeleccionada) {
    filaSeleccionada.classList.remove("seleccionada");
  }

  filaSeleccionada = fila;
  filaSeleccionada.classList.add("seleccionada");
});

// Modal eliminar
const modalEliminar = document.createElement("div");
modalEliminar.innerHTML = `
  <div class="modal">
    <div class="modal-content confirm">
      <p class="mensaje">¿Desea eliminar el producto?</p>
      <div class="botones">
        <button class="si">Sí</button>
        <button class="no">No</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

// Eliminar
btnEliminar.addEventListener("click", () => {
  if (!filaSeleccionada) return;

  const nombre = filaSeleccionada.querySelector("td").textContent;
  modalEliminar.querySelector(".mensaje").textContent = `¿Desea eliminar al producto "${nombre}"?`;
  modalEliminar.querySelector(".modal").style.display = "flex";
});

// Confirmación de eliminación
modalEliminar.querySelector(".si").addEventListener("click", () => {
  if (filaSeleccionada) {
    filaSeleccionada.remove();
    filaSeleccionada = null;
  }
  modalEliminar.querySelector(".modal").style.display = "none";
});

modalEliminar.querySelector(".no").addEventListener("click", () => {
  modalEliminar.querySelector(".modal").style.display = "none";
});
