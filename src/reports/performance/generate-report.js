const fs = require('fs');
const path = require('path');

// Función para renderizar un objeto como tabla compacta (estilo dark)
function renderObjectTable(obj) {
  if (!obj || Object.keys(obj).length === 0) {
    return '<p>No hay datos disponibles.</p>';
  }
  let rows = '';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      rows += `<tr><td>${key}</td><td>${obj[key]}</td></tr>`;
    }
  }
  return `<table class="data-table">
    <thead>
      <tr><th>Clave</th><th>Valor</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>`;
}

// Función que genera el HTML completo del reporte
function generateHTMLReport(data) {
  // Extraer los contadores del aggregate para construir los gráficos
  const counters = data.aggregate.counters || {};
  const counterLabels = Object.keys(counters);
  const counterValues = Object.values(counters);

  // Colores predefinidos (se asignarán dinámicamente)
  const presetColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
    'rgba(255, 102, 255, 0.8)',
    'rgba(102, 255, 102, 0.8)'
  ];
  const barColors = counterLabels.map((_, index) => presetColors[index % presetColors.length]);
  const borderColors = barColors.map(color => color.replace(/0\.8/, '1'));

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Rendimiento de Artillery</title>
  <!-- Tipografía moderna -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* Estilos generales dark con tipografía Poppins */
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Poppins', sans-serif;
      background-color: #121212;
      color: #e0e0e0;
      line-height: 1.6;
    }
    h1, h2, h3, h4, h5 {
      color: #ffffff;
    }
    .section {
      margin-bottom: 40px;
    }
    .card {
      background-color: #1e1e1e;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    }
    /* Layout en grid para tablas compactas */
    .table-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9em;
    }
    .data-table th, .data-table td {
      border: 1px solid #333;
      padding: 8px;
      text-align: left;
    }
    .data-table th {
      background-color: #333;
    }
    a {
      color: #64b5f6;
    }
    canvas {
      background-color: #1e1e1e;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 20px;
    }
    /* Adaptabilidad en móviles */
    @media (max-width: 600px) {
      .table-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  <!-- Incluir Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Reporte de Rendimiento de Artillery</h1>
  <p>Fecha: ${new Date().toLocaleString()}</p>

  <div class="section">
    <h2>Resultados Agregados</h2>
    <div class="table-grid">
      <div>
        <h3>Counters</h3>
        ${renderObjectTable(data.aggregate.counters)}
      </div>
      <div>
        <h3>Resumen de <code>vusers.session_length</code></h3>
        ${
          data.aggregate.summaries && data.aggregate.summaries["vusers.session_length"]
            ? renderObjectTable(data.aggregate.summaries["vusers.session_length"])
            : '<p>No hay resumen disponible.</p>'
        }
      </div>
    </div>
    <div class="table-grid">
      <div>
        <h3>Gráfico de Barras</h3>
        <canvas id="countersBarChart" width="400" height="300"></canvas>
      </div>
      <div>
        <h3>Gráfico de Torta</h3>
        <canvas id="countersPieChart" width="400" height="300"></canvas>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Resultados Intermedios</h2>
    ${data.intermediate
      .map((item, index) => {
        return `
      <div class="card">
        <h3>Segmento ${index + 1}</h3>
        <p><strong>Periodo:</strong> ${new Date(parseInt(item.period)).toLocaleString()}</p>
        <div class="table-grid">
          <div>
            <h4>Counters</h4>
            ${renderObjectTable(item.counters)}
          </div>
          <div>
            <h4>Summaries</h4>
            ${
              item.summaries && Object.keys(item.summaries).length > 0
                ? Object.keys(item.summaries)
                    .map(key => `<h5>${key}</h5>${renderObjectTable(item.summaries[key])}`)
                    .join('')
                : '<p>No hay summaries disponibles.</p>'
            }
          </div>
        </div>
        <div class="table-grid">
          <div>
            <h4>Histograms</h4>
            ${
              item.histograms && Object.keys(item.histograms).length > 0
                ? Object.keys(item.histograms)
                    .map(key => `<h5>${key}</h5>${renderObjectTable(item.histograms[key])}`)
                    .join('')
                : '<p>No hay histograms disponibles.</p>'
            }
          </div>
        </div>
      </div>
      `;
      })
      .join('')}
  </div>

  <script>
    // Datos para los gráficos
    const counterLabels = ${JSON.stringify(counterLabels)};
    const counterValues = ${JSON.stringify(counterValues)};
    const barColors = ${JSON.stringify(barColors)};
    const borderColors = ${JSON.stringify(borderColors)};

    // Gráfico de Barras
    const barCtx = document.getElementById('countersBarChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: counterLabels,
        datasets: [{
          label: 'Valor',
          data: counterValues,
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#e0e0e0',
              font: { family: 'Poppins', size: 14 }
            }
          },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            bodyFont: { family: 'Poppins', size: 12 }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#e0e0e0',
              font: { family: 'Poppins', size: 12 }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#e0e0e0',
              font: { family: 'Poppins', size: 12 }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });

    // Gráfico de Torta (Pie Chart)
    const pieCtx = document.getElementById('countersPieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: counterLabels,
        datasets: [{
          data: counterValues,
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#e0e0e0',
              font: { family: 'Poppins', size: 14 }
            }
          },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            bodyFont: { family: 'Poppins', size: 12 }
          }
        }
      }
    });
  </script>
</body>
</html>
  `;
}

const inputPath = path.join(__dirname, 'report.json');
const outputPath = path.join(__dirname, 'performance-report.html');

fs.readFile(inputPath, 'utf8', (err, jsonString) => {
  if (err) {
    console.error("Error al leer el archivo JSON:", err);
    return;
  }
  try {
    const data = JSON.parse(jsonString);
    const html = generateHTMLReport(data);
    fs.writeFile(outputPath, html, err => {
      if (err) {
        console.error("Error al escribir el reporte HTML:", err);
      } else {
        console.log("Reporte HTML generado correctamente en:", outputPath);
      }
    });
  } catch (err) {
    console.error("Error al parsear el JSON:", err);
  }
});
