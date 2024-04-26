document.addEventListener('DOMContentLoaded', function() {
    const chartContainer = document.getElementById('glucoseChart').getContext('2d');
    let glucoseChart;
    let originalData; // holds original aggregated data for resetting

    init();  // initialize and load the chart with data on page load

    function init() {
        fetch('glucose_data.csv')
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCSV(data);
                originalData = aggregateByTime(parsedData); // store original data
                glucoseChart = renderChart(chartContainer, originalData);
            });
    }

    document.getElementById('timeFilter').addEventListener('input', function(e) {
        // if filter is not checked, update the label only
        if (!document.getElementById('timeFilterEnabled').checked) {
            document.getElementById('timeLabel').textContent = `${e.target.value}:00`;
        }
        
        // if filter is checked, update the label and the chart
        if (document.getElementById('timeFilterEnabled').checked) {
            document.getElementById('timeLabel').textContent = `${e.target.value}:00`;
            updateChart(glucoseChart, e.target.value);
        }
    });

    document.getElementById('timeFilterEnabled').addEventListener('change', function(e) {
        if (e.target.checked) {
            const selectedHour = document.getElementById('timeFilter').value;
            document.getElementById('timeLabel').textContent = `${selectedHour}:00`;
            updateChart(glucoseChart, selectedHour);
        } else {
            resetGraph();
        }
    });

    function resetGraph() {
        document.getElementById('timeFilter').value = "12"; // reset slider to a neutral position (12:00)
        document.getElementById('timeLabel').textContent = "12:00";
        glucoseChart = renderChart(chartContainer, originalData); // render the original data
    }

    function parseCSV(csvData) {
        const lines = csvData.split('\n').slice(1).filter(line => line.trim() !== '');
        return lines.map(line => {
            const [timestamp, glucose] = line.split(',');
            return { time: moment(timestamp, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm'), glucose: parseFloat(glucose) };
        }).filter(data => !isNaN(data.glucose));
    }

    function aggregateByTime(data) {
        const timeMap = {};
        data.forEach(entry => {
            const timeKey = entry.time.substr(0, 5); // get HH:mm part
            if (!timeMap[timeKey]) {
                timeMap[timeKey] = [];
            }
            timeMap[timeKey].push(entry.glucose);
        });

        return Object.keys(timeMap).map(time => {
            const values = timeMap[time];
            const avg = values.reduce((sum, curr) => sum + curr, 0) / values.length;
            return { time, avg };
        }).sort((a, b) => a.time.localeCompare(b.time)); // sort times
    }

    function renderChart(ctx, data) {
        if (glucoseChart) { // destroy existing chart instance if present
            glucoseChart.destroy();
        }
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.time),
                datasets: [{
                    label: " Miles' Average Glucose Level",
                    data: data.map(d => d.avg),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HH:mm'
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Time of Day'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel.toFixed(2)} mg/dL`;
                        }
                    }
                }
            }
        });
    }

    function updateChart(chart, selectedHour) {
        const filteredData = originalData.filter(d => d.time.startsWith(`${selectedHour.padStart(2, '0')}:`));
        chart.data.labels = filteredData.map(d => d.time);
        chart.data.datasets.forEach((dataset) => {
            dataset.data = filteredData.map(d => d.avg);
        });
        chart.update();
    }
});
