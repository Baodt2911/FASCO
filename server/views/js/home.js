const home = () => {
  const ctx = document.getElementById("myChart");
  const months = [
    170, 2, 3, 4, 5, 60, 70, 8, 9, 10, 11, 120, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Sale",
          data: months,
          fill: true,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.5,
          pointRadius: 5,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
export default home;
