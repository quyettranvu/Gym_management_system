import React, { useContext, useEffect } from "react";
import { GloBalState } from "../../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
// import Footer from "../../../footers/Footer";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderHistory() {
  const state = useContext(GloBalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });

          setHistory(res.data); //đặt lại state mới cho History là data của response từ phía server
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });

          setHistory(res.data); //đặt lại state mới cho History là data của response từ phía server
        }
      };

      getHistory();
    }
  }, [token, isAdmin]);

  const deletePayment = async (id) => {
    await axios
      .delete(`/api/payment/${id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setHistory(res.data.updatedPayment);

        toast.success("Этот заказ успешно обработан!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error("Ошибка при обработке этого заказа", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="history-page">
      <h2>История</h2>

      <h3>У вас есть {history.length} заказы</h3>

      <div>
        <table>
          <thead>
            <tr>
              <th>ID Оплата</th>
              <th>Дата покупки</th>
              <th></th>
            </tr>
          </thead>

          {isAdmin ? (
            <tbody>
              {history.map((items) => (
                <tr key={items._id}>
                  <td>{items._id}</td>
                  <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/history/${items._id}`}>Просмотр</Link>
                    <button
                      className="history-delete"
                      onClick={() => deletePayment(items._id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {history.map((items) => (
                <tr key={items._id}>
                  <td>{items._id}</td>
                  <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/history/${items._id}`}>Просмотр</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
