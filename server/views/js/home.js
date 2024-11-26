import utils from "./utils.js";

const home = () => {
  const ctx = document.getElementById("myChart");
  const dayTotalOrders = document.querySelector(".day-total-orders");
  const monthTotalOrders = document.querySelector(".month-total-orders");
  const dayTotalRevenue = document.querySelector(".day-total-revenue");
  const monthTotalRevenue = document.querySelector(".month-total-revenue");

  const getDataSaleMonth = async () => {
    try {
      const accessToken = await utils.getAccessToken();
      const res = await fetch(
        utils.getCurrentUrl() +
          `/sale/month-sale?year=2024&month=11&status_order=confirmed`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);

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
      new Chart(ctx, {
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
  getDataSaleMonth();
};
export default home;
