import React, { useState } from "react";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup5 = ({ onClose, services, setServices, serviceID, index }) => {
  const [data, setData] = useState({
    serviceName: "",
    description: "",
  });

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleEdit = async () => {
    await axios
      .patch(`/api/delivery/${serviceID}`, { data })
      .then((res) => {
        // re-fetch the data
        fetchData();
        toast.success("Редактировать службу доставки успешно", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        console.log("Обновлена служба доставки");
      })
      .catch((error) => {
        toast.error("Ошибка при обновлении службы доставки", {
          autoClose: 2000,
        });
        // console.log(error.message);
      });
  };

  const fetchData = async () => {
    const response = await axios.get("/api/delivery");
    setServices(response.data);
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">Изменить службу доставки</span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Название службы доставки</label>
        <input
          type="text"
          name="serviceName"
          defaultValue={services[index].serviceName}
          onChange={handleChange}
          required
        />
        <label className="popup-form-label">Описание</label>
        <input
          type="text"
          name="description"
          defaultValue={services[index].description}
          onChange={handleChange}
          required
        />
        <button className="popup-submit" onClick={handleEdit}>
          Сохранять
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup5;
