import utils from "./utils.js";

const home = () => {
  const ctx = document.getElementById("myChart");
  const dayTotalOrders = document.querySelector(".day-total-orders");
  const monthTotalOrders = document.querySelector(".month-total-orders");
  const dayTotalRevenue = document.querySelector(".day-total-revenue");
  const monthTotalRevenue = document.querySelector(".month-total-revenue");
  const dateInput = document.getElementById("date-input");
  const datepicker = document.getElementById("datepicker");
  const yearDisplay = document.getElementById("year-display");
  const prevYearBtn = document.getElementById("prev-year");
  const nextYearBtn = document.getElementById("next-year");
  const months = document.querySelectorAll(".month");
  const titleSale = document.getElementById("title-sale");
  let selectedYear = new Date().getFullYear();
  let selectedMonth = new Date().getMonth() + 1;
  let chartInstance = null;
  dateInput.value = `${selectedMonth}/${selectedYear}`;
  // Toggle datepicker visibility
  dateInput.addEventListener("click", () => {
    datepicker.classList.toggle("hidden");
  });

  // Update year display
  prevYearBtn.addEventListener("click", async () => {
    selectedYear--;
    yearDisplay.textContent = selectedYear;
    await getDataSaleMonth({ year: selectedYear, month: selectedMonth });
  });

  nextYearBtn.addEventListener("click", async () => {
    selectedYear++;
    yearDisplay.textContent = selectedYear;
    await getDataSaleMonth({ year: selectedYear, month: selectedMonth });
  });

  // Handle month click
  months.forEach((month, index) => {
    month.addEventListener("click", async () => {
      selectedMonth = index + 1;
      dateInput.value = `${selectedMonth
        .toString()
        .padStart(2, "0")}/${selectedYear}`;
      await getDataSaleMonth({ year: selectedYear, month: selectedMonth });
      // Highlight selected month
      months.forEach((m) => m.classList.remove("selected"));
      month.classList.add("selected");

      // Hide datepicker
      datepicker.classList.add("hidden");
    });
  });

  // Hide datepicker when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".datepicker-container")) {
      datepicker.classList.add("hidden");
    }
  });
  const getDataSaleMonth = async ({ year, month }) => {
    try {
      const accessToken = await utils.getAccessToken();
      const res = await fetch(
        utils.getCurrentUrl() +
          `/sale/month-sale?year=${year}&month=${month}&status_order=completed`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return console.error(data);
      }
      const sales = data?.sales;
      const currentDate = new Date();
      const months =
        sales.map(
          (item) =>
            `${item.day < 10 ? "0" + item.day : item.day}/${
              currentDate.getMonth() + 1
            }`
        ) || [];
      const revenue = sales.map((item) => item.totalRevenue) || [];
      const index = sales.findIndex(
        (item) => item.day == currentDate.getDate()
      );
      const totalOrder = sales.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalOrders,
        0
      );
      const totalRevenue = sales.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalRevenue,
        0
      );
      dayTotalOrders.innerHTML = sales[index].totalOrders;
      dayTotalRevenue.innerHTML = `${sales[index].totalRevenue} $`;
      monthTotalOrders.innerHTML = totalOrder;
      monthTotalRevenue.innerHTML = `${totalRevenue} $`;
      titleSale.textContent = `Doanh thu tháng ${selectedMonth}/${selectedYear}`;
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Sale",
              data: revenue,
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
    } catch (error) {
      console.log(error);
    }
  };
  getDataSaleMonth({ year: selectedYear, month: selectedMonth });
};
export default home;
