const submitBtn = document.querySelector('#submit');
const selectInp = document.querySelector('select');
const startInp = document.querySelector('#start');
const endInp = document.querySelector('#end');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const file = selectInp.value;
  d3.csv(`/${file}`).then(function (data) {
    const firstRow = JSON.stringify(data[0]).replace(/[", ]/g, '').split([':']);
    const dataAmount = firstRow[2];
    const measurementDuration = firstRow[8];
    const singleMeasurementTime = measurementDuration / dataAmount;
    let accData = data.map((el) => parseInt(el['Acc [g]']));
    accData = accData.slice(startInp.value, endInp.value);
    const ctx = document.getElementById('chart');
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'First dataset',
            data: accData,
            borderColor: 'rgb(0, 143, 122)',
            fill: false,
          },
        ],
        labels: new Array(accData.length)
          .fill(1)
          .map((el, index) => parseInt(index) * singleMeasurementTime),
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                return Number(tooltipItem.yLabel).toFixed(2);
              },
            },
          },
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Przyspieszenie [g]',
                fontSize: 16,
                fontStyle: 'bold',
              },
            },
          ],
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Czas [ms]',
                fontSize: 16,
                fontStyle: 'bold',
              },
              ticks: {
                callback: function (value, index, values) {
                  return parseFloat(value).toFixed(0);
                },
                autoSkip: true,
                maxTicksLimit: 30,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  });
});
