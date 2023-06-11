import React, { useState } from "react";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup4 = ({ onClose, services, setServices }) => {
  // const [loading, setLoading] = useState(false);

  const [service, setService] = useState({
    serviceName: "",
    description: "",
  });

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await axios
      .post("/api/delivery", {
        serviceName: service.serviceName,
        description: service.description,
      })
      .then((res) => {
        //re-fetch data
        fetchData();
        toast.success("Новая служба доставки успешно добавлена!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
        setService({
          serviceName: "",
          description: "",
        });
      })
      .catch((error) => {
        toast.error("Ошибка при добавлении новой службы доставки", {
          autoClose: 2000,
        });
        console.log(error);
      });
  };

  const fetchData = async () => {
    const response = await axios.get("/api/delivery");
    setServices(response.data);
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">
        Добавить новую службу доставки
      </span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Название службы доставки</label>
        <input
          type="text"
          name="serviceName"
          value={service.serviceName}
          onChange={handleChange}
          required
        />
        <label className="popup-form-label">Описание</label>
        <input
          type="text"
          name="description"
          value={service.description}
          onChange={handleChange}
        />
        <button className="popup-submit" onClick={handleAdd}>
          Добавлять
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup4;
