document.getElementById('btnMostrarGrafica').addEventListener('click', () => {
  const modal = document.getElementById('modalGrafica');
  modal.style.display = 'flex';

  setTimeout(() => {
    fetch('http://localhost:7000/stats/average')
      .then(res => res.json())
      .then(data => {
        const labels = data.map(item => `Mesa ${item.id_mesa}`);
        const valores = data.map(item => item.total_ganancia);

        const ctx = document.getElementById('graficoGananciaMesa').getContext('2d');
        if (window.graficoMesa) {
          window.graficoMesa.destroy();
        }

        window.graficoMesa = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Ganancia por mesa ($)',
              data: valores,
              backgroundColor: 'rgba(255, 159, 64, 0.7)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Ganancia total por mesa'
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Ganancia ($)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Mesas'
                }
              }
            }
          }
        });
      });
  }, 150); // Esperar a que se monte visualmente
});

document.getElementById('cerrarModalGrafica').addEventListener('click', () => {
  document.getElementById('modalGrafica').style.display = 'none';
});
