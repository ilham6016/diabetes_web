const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

const width = 400;
const height = 200;
const chartCanvas = new ChartJSNodeCanvas({ width, height });

// ✅ ฟังก์ชันกราฟเส้นเดี่ยว
async function generateGraphImage(patientId, dataArray, title, fileName) {
  const config = {
    type: 'line',
    data: {
      labels: dataArray.map(d => d.date),
      datasets: [{
        label: title,
        data: dataArray.map(d => d.value),
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      },
      scales: { y: { beginAtZero: true } }
    }
  };

  const buffer = await chartCanvas.renderToBuffer(config);
  const outPath = path.join(__dirname, `../tmp/${fileName}-${patientId}.png`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

// ✅ ฟังก์ชันกราฟเส้นคู่
async function generateDualLineGraphImage(patientId, systolicArray, diastolicArray, fileName) {
  const config = {
    type: 'line',
    data: {
      labels: systolicArray.map(d => d.date),
      datasets: [
        {
          label: 'ค่าบน (Systolic)',
          data: systolicArray.map(d => d.value),
          borderColor: 'red',
          fill: false
        },
        {
          label: 'ค่าล่าง (Diastolic)',
          data: diastolicArray.map(d => d.value),
          borderColor: 'blue',
          fill: false
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'ความดันโลหิต'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  };

  const buffer = await chartCanvas.renderToBuffer(config);
  const outPath = path.join(__dirname, `../tmp/${fileName}-${patientId}.png`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

module.exports = {
  generateGraphImage,
  generateDualLineGraphImage
};

