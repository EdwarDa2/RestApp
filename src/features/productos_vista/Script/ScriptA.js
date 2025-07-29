// Selección de elementos
const btnAgregar = document.querySelector(".btn-agregar");
const btnEliminar = document.querySelector(".btn");
let filaSeleccionada = null;

// Referencia al modal y su contenido
const modalAgregar = document.getElementById("modal-agregar");
const cerrarModal = modalAgregar.querySelector(".cerrar");

// Crear modal de agregar

// Nota: la apertura y cierre del modal se manejan dentro de DOMContentLoaded.

// Guardar producto
document.addEventListener('DOMContentLoaded', () => {
  const nombreInput = document.getElementById('nombre');
  const precioInput = document.getElementById('precio');
  const categoriaSelect = document.getElementById('categoria');
  const subcategoriaSelect = document.getElementById('subcategoria');
  const guardarBtn = document.getElementById('guardarProducto');
  const tablaBody = document.getElementById('tabla-productos-body');

  // Mapas para resolver nombres por ID
  const categoriasMap = {};
  const subcategoriasMap = {};
  // Objeto para almacenar subcategorías por categoría (utilizado en selects)
  const subcategoriasPorCategoria = {};

  // Función para habilitar o deshabilitar el botón de guardar
  function checkFormValidity() {
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const categoria = categoriaSelect.value;
    const subcategoria = subcategoriaSelect.value;
    guardarBtn.disabled = !(nombre && precio && categoria && subcategoria);
  }

  // Listeners de validación en campos del formulario
  nombreInput.addEventListener('input', checkFormValidity);
  precioInput.addEventListener('input', checkFormValidity);
  categoriaSelect.addEventListener('change', checkFormValidity);
  subcategoriaSelect.addEventListener('change', checkFormValidity);

  // Función para limpiar los campos del formulario y resetear el botón
  function limpiarCampos() {
    nombreInput.value = '';
    precioInput.value = '';
    categoriaSelect.value = '';
    subcategoriaSelect.value = '';
    checkFormValidity();
  }

  // Cargar categorías y sus subcategorías. Construye mapas y llena el select de categorías.
  function cargarCategoriasYSubcategorias() {
    return fetch('http://3.214.208.156:7000/categorias')
      .then(response => response.json())
      .then(categorias => {
        // Llenar mapa de categorías y select de categorías
        categorias.forEach(cat => {
          categoriasMap[cat.id_categoria] = cat.nombre_categoria;
          const option = document.createElement('option');
          option.value = cat.id_categoria;
          option.textContent = cat.nombre_categoria;
          categoriaSelect.appendChild(option);
        });
        // Para cada categoría, obtener sus subcategorías usando la ruta de categorías
        const promesasSubcats = categorias.map(cat => {
          return fetch(`http://3.214.208.156:7000/subcategorias/${cat.id_categoria}`)
            .then(res => {
              // Algunas implementaciones devuelven 404 si no existen subcategorías. Manejarlo silenciosamente.
              if (!res.ok) return [];
              return res.json();
            })
            .then(subs => {
              // subs podría ser undefined si la respuesta no tiene cuerpo
              if (!subs || !Array.isArray(subs)) return;
              subcategoriasPorCategoria[cat.id_categoria] = subs;
              subs.forEach(sub => {
                subcategoriasMap[sub.id_subcategoria] = {
                  nombre: sub.nombre_subcategoria,
                  id_categoria: cat.id_categoria
                };
              });
            })
            .catch(error => {
              console.error('Error al cargar subcategorías para categoría', cat.id_categoria, error);
            });
        });
        return Promise.all(promesasSubcats);
      })
      .catch(error => console.error('Error al cargar las categorías y subcategorías:', error));
  }

  // Cargar productos existentes y mostrarlos en la tabla
  function cargarProductos() {
    return fetch('http://3.214.208.156:7000/productos')
      .then(response => response.json())
      .then(productos => {
        // Limpiar la tabla
        tablaBody.innerHTML = '';
        productos.forEach(prod => {
          // Extraer los IDs correctamente. Los campos expuestos por la API son id_producto y subcategoriaId.
          const idProducto = prod.id_producto;
          const subcategoriaId = prod.subcategoriaId;
          const subcat = subcategoriasMap[subcategoriaId];
          let categoriaNombre = '';
          let subcategoriaNombre = '';
          if (subcat) {
            subcategoriaNombre = subcat.nombre;
            categoriaNombre = categoriasMap[subcat.id_categoria] || '';
          }
          const fila = document.createElement('tr');
          fila.setAttribute('data-id', idProducto);
          fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>$${parseFloat(prod.precio).toFixed(2)}</td>
            <td>${categoriaNombre}</td>
            <td>${subcategoriaNombre}</td>
          `;
          tablaBody.appendChild(fila);
        });
      })
      .catch(error => console.error('Error al cargar los productos:', error));
  }

  // Inicializar: cargar categorías, subcategorías y después los productos
  cargarCategoriasYSubcategorias()
    .then(() => {
      // Configurar el comportamiento del select de subcategorías cuando cambia la categoría
      categoriaSelect.addEventListener('change', (event) => {
        const categoriaId = event.target.value;
        // Resetear select de subcategorías
        subcategoriaSelect.innerHTML = '<option value="" disabled selected>Selecciona la subcategoría</option>';
        if (subcategoriasPorCategoria[categoriaId]) {
          subcategoriasPorCategoria[categoriaId].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id_subcategoria;
            option.textContent = sub.nombre_subcategoria;
            subcategoriaSelect.appendChild(option);
          });
        }
        checkFormValidity();
      });
      // Cargar productos existentes
      cargarProductos();
    });

  // Guardar producto al hacer clic en el botón
  guardarBtn.addEventListener('click', () => {
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const categoriaId = categoriaSelect.value;
    const subcategoriaId = subcategoriaSelect.value;

    if (!nombre || !precio || !categoriaId || !subcategoriaId) {
      console.error('Error: Todos los campos deben ser completados.');
      return;
    }
    const producto = {
      nombre: nombre,
      precio: parseFloat(precio),
      categoriaId: categoriaId,
      subcategoriaId: subcategoriaId
    };
    console.log('Producto a enviar:', producto);
    fetch('http://3.214.208.156:7000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    })
      .then(response => response.json())
      .then(data => {
        if (data.producto) {
          // Crear una fila con el producto recién creado
          const nuevaFila = document.createElement('tr');
          // Usar el id del producto retornado
          nuevaFila.setAttribute('data-id', data.producto.id_producto);
          nuevaFila.innerHTML = `
            <td>${data.producto.nombre}</td>
            <td>$${parseFloat(data.producto.precio).toFixed(2)}</td>
            <td>${data.categoriaNombre}</td>
            <td>${data.subcategoriaNombre}</td>
          `;
          tablaBody.appendChild(nuevaFila);
          modalAgregar.style.display = 'none';
          limpiarCampos();
        } else {
          console.error('Error: Producto no creado correctamente.');
        }
      })
      .catch(error => {
        console.error('Error al guardar el producto:', error);
      });
  });

  // Eventos para abrir y cerrar el modal
  btnAgregar.addEventListener('click', () => {
    modalAgregar.style.display = 'flex';
  });
  cerrarModal.addEventListener('click', () => {
    modalAgregar.style.display = 'none';
  });
});
// Eliminar Prodcutos
 

// Selección de la tabla y el botón de eliminar
const tablaBody = document.getElementById('tabla-productos-body');
const btnEliminarSeleccionado = document.getElementById('btnEliminarSeleccionado');

// Evento de clic en la tabla para seleccionar una fila
tablaBody.addEventListener('click', (event) => {
  // Obtener la fila más cercana al lugar donde se hizo clic (usamos closest para asegurarnos de que es un <tr>)
  const fila = event.target.closest('tr');
  
  // Asegúrate de que se ha hecho clic en una fila, no en una celda
  if (fila) {
    // Si ya había una fila seleccionada, la desmarcamos
    if (filaSeleccionada) {
      filaSeleccionada.classList.remove('seleccionada');
    }

    // Marcar la fila seleccionada
    filaSeleccionada = fila;
    filaSeleccionada.classList.add('seleccionada');  // Agregar la clase de selección
  }
});

// Evento para eliminar el producto seleccionado
btnEliminarSeleccionado.addEventListener('click', () => {
  if (filaSeleccionada) {
    const productoId = filaSeleccionada.getAttribute('data-id');  // Obtener el ID del producto desde el atributo data-id

    // Confirmar si realmente desea eliminar el producto
    if (confirm(`¿Seguro que deseas eliminar el producto con ID ${productoId}?`)) {
  fetch(`http://3.214.208.156:7000/productos/${productoId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(texto => { throw new Error(texto); });
    }
    alert("✅ Producto eliminado correctamente");
    location.reload();
  })
  .catch(error => {
    alert("❌ No se puede eliminar: " + error.message);
  });
}
  } else {
    alert("Por favor, selecciona un producto para eliminar.");
  }
});



