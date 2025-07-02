const stationSelect = document.getElementById('station-select');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const liveUpdateButton = document.getElementById('live-update-btn');
const today = new Date().toISOString().split('T')[0];

startDateInput.addEventListener('change', () => {
  updateLiveStatus();
  displayCharts();
});

endDateInput.addEventListener('change', () => {
  updateLiveStatus();
  displayCharts();
});


stationSelect.addEventListener('change', () => {
  displayCharts();
});

let spcChart, xChart, rChart, histogramChart, normalChart;

async function getChartData() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const station = stationSelect.value;

  // console.log("📅 Start Date:", startDate);
  // console.log("📅 End Date:", endDate);
  // console.log("📍 Station:", station);

  const response = await fetch(`./chart-data?startDate=${startDate}&endDate=${endDate}&station=${station}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });  
  if (!response.ok) {
    console.error("❌ Failed to fetch data:", response.status);
    return;
  }
  return await response.json();
}

function createChart(ctx, label, data, type = 'line', color = 'blue') {
  const colors = {
    red: ['rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)'],
    blue: ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)'],
    yellow: ['rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)'],
    teal: ['rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)'],
    purple: ['rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)'],
  };

  return new Chart(ctx, {
    type: type,
    data: {
      labels: data.map((_, index) => index + 1),
      datasets: [{
        label: label,
        data: data,
        borderColor: colors[color][0],
        backgroundColor: colors[color][1],
        borderWidth: 2,
        fill: type !== 'bar'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Sample Index' } },
        y: { display: true, title: { display: true, text: label } }
      }
    }
  });
}

function createSPCChart(ctx, label, data) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = Math.sqrt(data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length);
  const UCL = mean + 3 * stdDev;
  const LCL = mean - 3 * stdDev;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, index) => index + 1),
      datasets: [
        {
          label: label,
          data: data,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          fill: false
        },
        {
          label: 'UCL',
          data: new Array(data.length).fill(UCL),
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderDash: [5, 5],
          fill: false
        },
        {
          label: 'LCL',
          data: new Array(data.length).fill(LCL),
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderDash: [5, 5],
          fill: false
        },
        {
          label: 'Mean',
          data: new Array(data.length).fill(mean),
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderDash: [2, 2],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { title: { display: true, text: 'Sample Index' }},
        y: { title: { display: true, text: label }}
      }
    }
  });
}

function createXBarChart(ctx, label, data) {
  const groupSize = 5;
  const means = [];
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize);
    const mean = group.reduce((a, b) => a + b, 0) / group.length;
    means.push(mean);
  }

  return createChart(ctx, label + ' (X-bar)', means, 'line', 'blue');
}

function createRChart(ctx, label, data) {
  const groupSize = 5;
  const ranges = [];
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, i + groupSize);
    const range = Math.max(...group) - Math.min(...group);
    ranges.push(range);
  }

  return createChart(ctx, label + ' (Range)', ranges, 'line', 'yellow');
}

function createHistogram(ctx, label, data) {
  const bins = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;

  const binCounts = new Array(bins).fill(0);
  const binLabels = [];

  data.forEach(val => {
    let bin = Math.floor((val - min) / binWidth);
    if (bin === bins) bin -= 1;
    binCounts[bin]++;
  });

  for (let i = 0; i < bins; i++) {
    const binStart = (min + i * binWidth).toFixed(2);
    const binEnd = (min + (i + 1) * binWidth).toFixed(2);
    binLabels.push(`${binStart} - ${binEnd}`);
  }

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: binLabels,
      datasets: [{
        label: label,
        data: binCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true }},
      scales: {
        x: { title: { display: true, text: 'Value Range' }},
        y: { title: { display: true, text: 'Frequency' }}
      }
    }
  });
}

function createNormalDistributionChart(ctx, label, data) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = Math.sqrt(data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length);

  const xValues = [];
  const yValues = [];
  const step = (Math.max(...data) - Math.min(...data)) / 50;

  for (let x = mean - 4 * stdDev; x <= mean + 4 * stdDev; x += step) {
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * stdDev ** 2));
    xValues.push(x.toFixed(2));
    yValues.push(y);
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [{
        label: label,
        data: yValues,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true }},
      scales: {
        x: { title: { display: true, text: 'Value' }},
        y: { title: { display: true, text: 'Probability Density' }}
      }
    }
  });
}

async function displayCharts() {
  const data = await getChartData();

  // Check if data is valid and not empty
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data found for the selected range and station!");

    // Clear charts when no data is found
    clearCharts();
  } else {
    // Slice data to the first 50 entries
    const sliceddata = data.slice(0, 50);

    const doseWeights = sliceddata.map(item => parseFloat(item.Dose_Weight_W2_minus_W1));
    const weightBefore = sliceddata.map(item => parseFloat(item.Weight_Before_Coating_W1));
    const weightAfter = sliceddata.map(item => parseFloat(item.Weight_After_Coating_W2));

    const histogramData = [...doseWeights];
    const normalDistData = [...doseWeights];

    // Destroy previous charts before rendering new ones
    [spcChart, xChart, rChart, histogramChart, normalChart].forEach(chart => {
      if (chart) chart.destroy();
    });

    // Create and display new charts with the available data
    spcChart = createSPCChart(document.getElementById('spcChart'), 'SPC - Dose Weight', doseWeights);
    xChart = createXBarChart(document.getElementById('xChart'), 'X-bar - Weight Before Coating', weightBefore);
    rChart = createRChart(document.getElementById('rChart'), 'R - Weight After Coating', weightAfter);
    histogramChart = createHistogram(document.getElementById('histogram'), 'Histogram - Dose Weight', histogramData);
    normalChart = createNormalDistributionChart(document.getElementById('normalChart'), 'Normal Distribution - Dose Weight', normalDistData);
  }
}

// Function to clear all charts
function clearCharts() {
  // Destroy existing chart instances before clearing
  [spcChart, xChart, rChart, histogramChart, normalChart].forEach(chart => {
    if (chart) {
      chart.destroy();
    }
  });

  // Reinitialize charts with empty data
  spcChart = createSPCChart(document.getElementById('spcChart'), 'SPC - Dose Weight', []);
  xChart = createXBarChart(document.getElementById('xChart'), 'X-bar - Weight Before Coating', []);
  rChart = createRChart(document.getElementById('rChart'), 'R - Weight After Coating', []);
  histogramChart = createHistogram(document.getElementById('histogram'), 'Histogram - Dose Weight', []);
  normalChart = createNormalDistributionChart(document.getElementById('normalChart'), 'Normal Distribution - Dose Weight', []);
}


let popupChartInstance = null;
let fullPopupData = [];
let fullPopupLabels = [];

function maximize(canvasId) {
  const originalChart = Chart.getChart(canvasId);
  const popupCanvas = document.getElementById("popupChartCanvas");
  const popupContainer = document.getElementById("popupContainer");

  if (!originalChart || !popupCanvas || !popupCanvas.getContext) {
    console.error("❌ Chart or popup canvas not ready!");
    return;
  }

  if (popupChartInstance) {
    popupChartInstance.destroy();
    popupChartInstance = null;
  }

  const clonedConfig = {
    type: originalChart.config.type,
    data: JSON.parse(JSON.stringify(originalChart.config.data)),
    options: JSON.parse(JSON.stringify(originalChart.config.options)),
  };

  fullPopupData = [...clonedConfig.data.datasets[0].data];
  fullPopupLabels = [...clonedConfig.data.labels];

  popupChartInstance = new Chart(popupCanvas.getContext("2d"), clonedConfig);
  popupContainer.style.display = "flex";

  const dataCountSelect = document.getElementById("dataCountSelect");
  if (dataCountSelect) {
    dataCountSelect.value = "all";
    filterPopupData(); // Apply full data
  }
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  if (popupChartInstance) {
    popupChartInstance.destroy();
    popupChartInstance = null;
  }
}

function filterPopupData() {
  const countInput = document.getElementById("dataCountInput").value.trim();
  const count = countInput.toLowerCase() === "all" ? "all" : parseInt(countInput);
  const dataBox = document.querySelector(".datavalues");
  
  if (!popupChartInstance) return;

  let filteredData, filteredLabels;

  if (isNaN(count) || count === "all") {
    filteredData = [...fullPopupData];
    filteredLabels = [...fullPopupLabels];
  } else {
    filteredData = fullPopupData.slice(-count);
    filteredLabels = fullPopupLabels.slice(-count);
  }
  

  popupChartInstance.data.datasets[0].data = filteredData;
  popupChartInstance.data.labels = filteredLabels;
  popupChartInstance.update();

  updatePopupDataValues(filteredData);
}

function updatePopupDataValues(values) {
  const valueDiv = document.querySelector(".datavalues");
  if (valueDiv) {
    valueDiv.innerHTML = values
      .map((val, i) => `#${i + 1}: ${parseFloat(val).toFixed(2)}`)
      .join("<br>");
  }
}

// Toggle the sidebar open/close
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main-content");
  if (sidebar.style.width === "300px") {
    sidebar.style.width = "0";
    main.classList.remove("sidebar-opened");
  } else {
    sidebar.style.width = "300px";
    main.classList.add("sidebar-opened");
  }

  sidebar.classList.toggle("active"); // Toggle the sidebar's visibility
}

// Helper function to format date in local time as YYYY-MM-DD
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ✅ Function to set default date range on page load
function setDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  document.getElementById('start-date').value = formatDateLocal(today);
  document.getElementById('end-date').value = formatDateLocal(tomorrow);
}

// Call this function when the page loads
window.onload = setDefaultDates;

// Optional: Close sidebar if clicking outside of it
window.addEventListener("click", function(event) {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.querySelector(".openbtn");

  if (sidebar.classList.contains("active") && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
    sidebar.classList.remove("active");
  }
});

// ✅ Function to update live button status
function updateLiveStatus() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const liveButton = document.getElementById("live-update-btn");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const isLive = startDate.getTime() === today.getTime() && endDate.getTime() === tomorrow.getTime();

  if (isLive) {
    liveButton.textContent = "Live Data 🔴";
    liveButton.classList.remove("offline");
    liveButton.classList.add("live");
  } else {
    liveButton.textContent = "Offline Data ⚫";
    liveButton.classList.remove("live");
    liveButton.classList.add("offline");
  }
}

// Auto-update live status when dates change
document.getElementById("start-date").addEventListener("change", updateLiveStatus);
document.getElementById("end-date").addEventListener("change", updateLiveStatus);

// ✅ Live button sets today and tomorrow correctly
document.getElementById("live-update-btn").addEventListener("click", function () {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = formatDateLocal(today);
  const tomorrowStr = formatDateLocal(tomorrow);

  document.getElementById("start-date").value = todayStr;
  document.getElementById("end-date").value = tomorrowStr;

  setTimeout(() => {
    updateLiveStatus();
    displayCharts();  // Refresh charts with new date range
  }, 0);
});


// On page load
window.addEventListener("load", updateLiveStatus);


document.addEventListener("DOMContentLoaded", function () {
  const zoneSelect = document.getElementById("zone-select");
  const stationSelect = document.getElementById("station-select");
  const header = document.getElementById("project-header");

  function updateHeader() {
    const zone = zoneSelect.options[zoneSelect.selectedIndex].text;
    const station = stationSelect.options[stationSelect.selectedIndex].text;

    if (zone !== "Select Zone" && station !== "Select Station") {
      header.textContent = `${zone} and ${station} Project Data`;
    } else {
      header.textContent = "Project Data";
    }
  }

  zoneSelect.addEventListener("change", updateHeader);
  stationSelect.addEventListener("change", updateHeader);
});

function exportToPDF() {
  const exportContainer = document.createElement("div");

  const charts = [
    { id: "spcChart", title: "SPC Chart" },
    { id: "xChart", title: "X Chart" },
    { id: "rChart", title: "R Chart" },
    { id: "histogram", title: "Histogram" },
    { id: "normalChart", title: "Normal Distribution" }
  ];

  charts.forEach(({ id, title }, index) => {
    const chart = Chart.getChart(id);
    if (!chart) return;
  
    // Create chart image
    const canvas = document.getElementById(id);
    const image = canvas.toDataURL("image/png");
  
    const section = document.createElement("div");
    section.style.marginBottom = "40px";
  
    const chartTitle = document.createElement("h2");
    chartTitle.innerText = title;
    section.appendChild(chartTitle);
  
    const chartImage = document.createElement("img");
    chartImage.src = image;
    chartImage.style.width = "100%";
    section.appendChild(chartImage);
  
    // Add corresponding data table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "15px";
  
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const labelTh = document.createElement("th");
    labelTh.innerText = "Label";
    labelTh.style.border = "1px solid #000";
    labelTh.style.padding = "4px";
    headerRow.appendChild(labelTh);
  
    chart.data.datasets.forEach(ds => {
      const th = document.createElement("th");
      th.innerText = ds.label || "Value";
      th.style.border = "1px solid #000";
      th.style.padding = "4px";
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement("tbody");
  
    chart.data.labels.forEach((label, i) => {
      const tr = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.innerText = label;
      tdLabel.style.border = "1px solid #000";
      tdLabel.style.padding = "4px";
      tr.appendChild(tdLabel);
  
      chart.data.datasets.forEach(ds => {
        const td = document.createElement("td");
        td.innerText = ds.data[i];
        td.style.border = "1px solid #000";
        td.style.padding = "4px";
        tr.appendChild(td);
      });
  
      tbody.appendChild(tr);
    });
  
    table.appendChild(tbody);
    section.appendChild(table);
  
    // Add page break after every section except the last one
    if (index < charts.length - 1) {
      section.style.pageBreakAfter = "always"; // For most browsers
      section.style.breakAfter = "page";       // For modern compatibility
    }
  
    exportContainer.appendChild(section);
  });
  

  // Generate the PDF
  html2pdf()
    .from(exportContainer)
    .set({
      margin: 10,
      filename: "Battery_Line_Charts_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .save();
}


function exportToExcel() {
  const charts = [
    { id: "spcChart", title: "SPC Chart" },
    { id: "xChart", title: "X Chart" },
    { id: "rChart", title: "R Chart" },
    { id: "histogram", title: "Histogram" },
    { id: "normalChart", title: "Normal Distribution" }
  ];

  const wb = XLSX.utils.book_new(); // Create a new workbook

  charts.forEach(({ id, title }) => {
    const chart = Chart.getChart(id);
    if (!chart) return;

    const sheetData = [["Label", ...chart.data.datasets.map(ds => ds.label || "Value")]];

    chart.data.labels.forEach((label, i) => {
      const row = [label];
      chart.data.datasets.forEach(dataset => {
        row.push(dataset.data[i]);
      });
      sheetData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31)); // Excel sheet name max length = 31
  });

  XLSX.writeFile(wb, "Battery_Line_Charts_Data.xlsx");
}


startDateInput.addEventListener('change', () => {
  updateLiveStatus();
  displayCharts();  // 🔁 Refresh charts
});

endDateInput.addEventListener('change', () => {
  updateLiveStatus();
  displayCharts();  // 🔁 Refresh charts
});

stationSelect.addEventListener('change', () => {
  displayCharts();  // 🔁 Refresh charts when station changes
});

updateLiveStatus(); // Set the right status on page load
displayCharts();    // Show charts with today's data initially

