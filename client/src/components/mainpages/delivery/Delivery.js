import React, { useContext, useState } from "react";
import axios from "axios";
// import Loading from "../utils/loading/Loading";
import { GloBalState } from "../../../GlobalState";
import Popup4 from "../popup/Popup4";
import Popup5 from "../popup/Popup5";

/*Popup Windows*/

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function Delivery() {
  const state = useContext(GloBalState);
  // const [loading, setLoading] = useState(false);
  // const [token] = state.token;
  const [index, setIndex] = useState(0);
  // const [services, setServices] = useState([]);
  const [services, setServices] = state.deliveriesAPI.services;
  const [callback, setCallback] = state.deliveriesAPI.callback;
  const [serviceID, setServiceID] = useState("");

  /*Popup for Delivery Service*/
  const [popup4, setPopup4] = useState(false);
  const [popup5, setPopup5] = useState(false);

  const handleEditDelivery = ({ id, index }) => {
    setPopup5(true);
    setServiceID(id);
    setIndex(index);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы хотите удалить эту доставку??")) {
      await axios
        .delete(`/api/delivery/${id}`)
        .then(() => {
          //re-fetch data
          setServices(services.filter((service) => service._id !== id));
          toast.success("Удаление этой службы доставки успешно!", {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            autoClose: 2000,
          });
          setCallback(!callback);
        })
        .catch((error) => {
          toast.error("Ошибка удаления службы доставки", {
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-row">
          <div className="col-md-12 col-sm-12 col-xs-12 profile-image-section">
            <button
              className="profile-btn-add-delivery"
              onClick={() => setPopup4(true)}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="glyphicon glyphicon-profile"
              />
              Добавить службу доставки
            </button>
            <div className="delivery-services-container">
              <table className="profile-delivery">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Название службы доставки</th>
                    <th>Идентификатор(ID) платежа заказа</th>
                    <th>Описание</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.serviceName}</td>
                      <td>
                        {item.paymentID.map((payment, i) => (
                          <div key={i}>{payment}</div>
                        ))}
                      </td>
                      <td>{item.description}</td>
                      <td>
                        <button
                          type="button"
                          className="address-click-edit"
                          onClick={() =>
                            handleEditDelivery({ id: item._id, index })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="glyphicon glyphicon-profile"
                          />
                          Редактировать
                        </button>
                        <button
                          type="button"
                          className="address-click-delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="glyphicon glyphicon-profile"
                          />
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {popup4 ? (
        <Popup4
          className="open-popup-window"
          services={services}
          setServices={setServices}
          onClose={() => setPopup4(false)}
        />
      ) : null}
      {popup5 ? (
        <Popup5
          className="open-popup-window"
          services={services}
          setServices={setServices}
          serviceID={serviceID}
          index={index}
          onClose={() => setPopup5(false)}
        />
      ) : null}
    </>
  );
}

export default Delivery;
