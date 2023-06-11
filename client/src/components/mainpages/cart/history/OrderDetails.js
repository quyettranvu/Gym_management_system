import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GloBalState } from "../../../../GlobalState";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderDetails() {
  const state = useContext(GloBalState);
  // const [user] = state.userAPI.user;
  const [isAdmin] = state.userAPI.isAdmin;
  const [history] = state.userAPI.history;
  // eslint-disable-next-line no-unused-vars
  const [services, setServices] = state.deliveriesAPI.services;
  // eslint-disable-next-line no-unused-vars
  const [callback, setCallback] = state.deliveriesAPI.callback;
  const [token] = state.token;
  const [orderDetails, setOrderDetails] = useState([]);

  //Biến params sẽ tương ứng lưu giá trị id(để ý ở file Pages Route trỏ đến file OrderDetails.js với giá trị item._id trên đường dẫn)
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  const confirmOrder = async (id) => {
    await axios
      .patch(
        "/api/payment",
        {
          id: id,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        // re-fetch the data
        setOrderDetails({
          ...orderDetails,
          status: res.data.payment.status,
        });

        toast.success("Статус заказа успешно изменен!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при изменении статуса заказа", {
          autoClose: 2000,
        });
        console.log(error);
      });
  };

  const handleAddNormalDelivery = async (paymentID) => {
    // Find the index of the normal service in the services array
    const normalService = services.find(
      (service) => service.serviceName === "Обычный"
    );
    const normalServiceId = normalService ? normalService._id : null;

    await axios
      .put(`/api/delivery/${normalServiceId}`, { paymentId: paymentID })
      .then((response) => {
        toast.success("Этот платеж успешно добавлен в обычный сервис!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при добавлении платежа к обычному сервису", {
          autoClose: 2000,
        });
        console.log(error);
      });
  };

  const handleAddExpressDelivery = async (paymentID) => {
    // Find the index of the normal service in the services array
    const expressService = services.find(
      (service) => service.serviceName === "Экспресс"
    );
    const expressServiceId = expressService ? expressService._id : null;

    await axios
      .put(`/api/delivery/${expressServiceId}`, { paymentId: paymentID })
      .then((response) => {
        toast.success("Этот платеж успешно добавлен в экспресс-сервис!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при добавлении платежа в экспресс-услугу", {
          autoClose: 2000,
        });
        console.log(error);
      });
  };

  if (orderDetails.length === 0) return null;

  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>UserID</th>
            <th>Имя</th>
            <th>Адрес</th>
            <th>Статус заказа</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{orderDetails.user_id}</td>
            <td>{orderDetails.name}</td>
            <td>{orderDetails.address}</td>
            <td>
              {orderDetails.status === false ? "На обработке" : "Обработанны"}
              {isAdmin ? (
                <button onClick={() => confirmOrder(orderDetails._id)}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Продукты</th>
            <th>Количество</th>
            <th>Цена (в $)</th>
          </tr>
        </thead>

        <tbody>
          {orderDetails.cart.map((items) => (
            <tr key={items._id}>
              <td>
                <img src={items.images.url} alt="" />
              </td>
              <td>{items.title}</td>
              <td>{items.quantity}</td>
              <td>{items.price * items.quantity}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}></td>
            <td>Итого: {orderDetails.total}$</td>
          </tr>
        </tbody>
      </table>

      <div className="delivery-options-container">
        <div className="delivery-option normal-delivery">
          <h3>Обычная доставка</h3>
          <p>Срок поставки: 2-5 рабочих дней</p>
          <p>Цена: $5</p>
          <button onClick={() => handleAddNormalDelivery(orderDetails._id)}>
            Выбирать
          </button>
        </div>
        <div className="delivery-option express-delivery">
          <h3>Экспресс-доставка</h3>
          <p>Срок поставки: 1-2 рабочих дня</p>
          <p>Цена: $10</p>
          <button onClick={() => handleAddExpressDelivery(orderDetails._id)}>
            Выбирать
          </button>
        </div>
      </div>
    </div>
  );
}
