document.addEventListener('DOMContentLoaded', () => {
    const catSelect = document.getElementById('categoria-select');
    const subcatSelect = document.getElementById('subcategoria-select');
    const productosContainer = document.getElementById('tabla-productos-body');

   fetch('http://3.214.208.156:7000/productos')
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById('tabla-productos-body');

    // Limpiar antes de insertar
    tbody.innerHTML = '';

    data.forEach(producto => {
      const fila = document.createElement('tr');

      const celdaNombre = document.createElement('td');
      celdaNombre.textContent = producto.nombre;

      const celdaPrecio = document.createElement('td');
      celdaPrecio.textContent = `$${producto.precio.toFixed(2)}`;

      fila.appendChild(celdaNombre);
      fila.appendChild(celdaPrecio);
      tbody.appendChild(fila);
    });
  })
  .catch(error => console.error('Error al cargar los productos:', error));

    // Cargar las categorías desde la API
    fetch('http://3.214.208.156:7000/categorias')
        .then(response => response.json())
        .then(data => {
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = categoria.nombre_categoria;
                catSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las categorías:', error));

    // Cuando se selecciona una categoría, cargar las subcategorías correspondientes
    catSelect.addEventListener('change', (event) => {
        const categoriaId = event.target.value;

        // Limpiar las subcategorías previas
        subcatSelect.innerHTML = '<option>Selecciona la subcategoría</option>';

        if (categoriaId) {
            fetch(`http://3.214.208.156:7000/subcategorias/${categoriaId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(subcategoria => {
                        const option = document.createElement('option');
                        option.value = subcategoria.id_subcategoria;
                        option.textContent = subcategoria.nombre_subcategoria;
                        subcatSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error al cargar las subcategorías:', error));
        }
    });

    // Cuando se selecciona una subcategoría, cargar los productos correspondientes
    subcatSelect.addEventListener('change', (event) => {
        const subcategoriaId = event.target.value;

        // Limpiar los productos previos
        productosContainer.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos productos

        if (subcategoriaId) {
            fetch(`http://3.214.208.156:7000/productos/subcategoria/${subcategoriaId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Productos cargados:', data); // Verifica que los productos se cargan correctamente
                    // Si no hay productos
                    if (data.length === 0) {
                        productosContainer.innerHTML = '<tr><td colspan="2">No hay productos disponibles en esta subcategoría</td></tr>';
                    } else {
                        data.forEach(producto => {
                           const row = document.createElement('tr');
                            const cellNombre = document.createElement('td');
                            cellNombre.textContent = producto.nombre;
                            const cellPrecio = document.createElement('td');
                            cellPrecio.textContent = `$${producto.precio}`;
                            row.appendChild(cellNombre);
                            row.appendChild(cellPrecio);
                            productosContainer.appendChild(row);
                        });
                    }
                })
                .catch(error => console.error('Error al cargar los productos:', error));
        }
    });
});
