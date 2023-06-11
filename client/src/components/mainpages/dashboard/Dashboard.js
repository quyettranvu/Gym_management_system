import { useState, useContext } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
import { GloBalState } from "../../../GlobalState";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const state = useContext(GloBalState);
  const [token] = state.token;
  const [chartData, setChartData] = useState(null);
  const [displayChart, setDisplayChart] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [top3, setTop3] = useState([]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleProductsButtonClick = () => {
    fetchProductsData();
    setDisplayChart(true);
  };

  const handleUsersButtonClick = () => {
    fetchUserOrdersData();
    setDisplayChart(true);
  };

  const handleOrdersButtonClick = () => {
    fetchOrdersData();
    setDisplayChart(true);
  };

  const fetchProductsData = async () => {
    const response = await axios.get("/api/allproducts");
    const products = response.data.reduce(
      (accumulator, product) => {
        accumulator.labels.push(product.title);
        accumulator.data.push(product.sold);
        return accumulator;
      },
      { labels: [], data: [] }
    );

    const sortedProducts = response.data.sort((a, b) => b.sold - a.sold);
    const top3 = sortedProducts.slice(0, 3).map((product, index) => ({
      rank: index + 1,
      name: product.title,
      value: product.sold,
    }));

    setTop3(top3);

    const colors = Array.from(
      { length: products.data.length },
      () =>
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.2)`
    );

    setChartData({
      labels: products.labels,
      datasets: [
        {
          label: "Проданные продукты",
          data: products.data,
          backgroundColor: colors,
        },
      ],
    });
  };

  const fetchUserOrdersData = async () => {
    const response = await axios("/api/payment", {
      headers: { Authorization: token },
    });

    const ordersByUser = response.data.reduce((acc, order) => {
      if (!acc[order.name]) {
        acc[order.name] = order.total;
      } else {
        acc[order.name] += order.total;
      }
      return acc;
    }, {});

    const orders = Object.entries(ordersByUser).map(([name, total]) => ({
      x: name,
      y: total,
    }));

    /*Data for Ranking Table*/
    const top3 = orders
      .sort((a, b) => b.y - a.y)
      .slice(0, 3)
      .map((order, index) => ({
        rank: index + 1,
        name: order.x,
        value: order.y,
      }));

    setTop3(top3);

    const colors = Array.from(
      { length: orders.length },
      () =>
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.2)`
    );

    setChartData({
      labels: orders.map((order) => order.x),
      datasets: [
        {
          label: "Общая стоимость заказа пользователями",
          data: orders.map((order) => order.y),
          backgroundColor: colors,
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
          tension: 0.1,
          fill: false,
        },
      ],
    });
  };

  const fetchOrdersData = async () => {
    const response = await axios("/api/payment", {
      headers: { Authorization: token },
    });

    const orders = response.data.map((order) => ({
      x: new Date(order.createdAt),
      y: order.total,
    }));

    /*Data for Ranking Table*/
    const top3 = orders
      .sort((a, b) => b.y - a.y)
      .slice(0, 3)
      .map((order, index) => ({
        rank: index + 1,
        name: order.x,
        value: order.y,
      }));

    setTop3(top3);

    const colors = Array.from(
      { length: orders.length },
      () =>
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.2)`
    );
    setChartData({
      labels: orders.map((order) =>
        order.x.toLocaleString("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })
      ),
      datasets: [
        {
          label: "Общая стоимость заказа",
          data: orders.map((order) => order.y),
          backgroundColor: colors,
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
          tension: 0.1,
          fill: false,
        },
      ],
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Панель</h1>
      <div className="button-container">
        <button
          className="dashboard-button-1"
          onClick={handleProductsButtonClick}
        >
          Продукты
        </button>
        <button className="dashboard-button-2" onClick={handleUsersButtonClick}>
          Пользователи
        </button>
        <button
          className="dashboard-button-3"
          onClick={handleOrdersButtonClick}
        >
          Заказы
        </button>
      </div>
      <div>
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line Chart</option>
          <option value="doughnut">Doughnut Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>
      <div className="chart-table-container">
        {chartType === "line" && chartData && (
          <div className="chart-container">
            {chartData && displayChart && <Line data={chartData} />}
          </div>
        )}
        {chartType === "doughnut" && chartData && (
          <div className="doughnut-chart-container">
            {chartData && displayChart && <Doughnut data={chartData} />}
          </div>
        )}
        {chartType === "bar" && chartData && (
          <div className="chart-container">
            {chartData && displayChart && <Bar data={chartData} />}
          </div>
        )}
        {chartData && (
          <div className="top3-table-container">
            <h2>Top 3 Orders</h2>
            <table className="top3-table">
              <thead>
                <tr>
                  <th>Ранг</th>
                  <th>Содержание</th>
                  <th>Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {top3.map((item) => (
                  <tr key={item.rank}>
                    <td>{item.rank}</td>
                    <td>{item.name.toLocaleString()}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
