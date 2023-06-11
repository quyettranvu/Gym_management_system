import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup2 = ({ onClose }) => {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [token] = state.token;

  const [address, setAddress] = useState({
    street: "",
    ward: "",
    province: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    let isObjectValuesEmpty = Object.values(address).some(
      (val) => val !== undefined && val !== null && val !== ""
    );
    if (!isObjectValuesEmpty) {
      toast.error("Введите адрес не может быть пустым!", {
        autoClose: 2000,
      });
    } else {
      //input data
      const data = Object.values(address).reduce(
        (a, b, index) =>
          a + b + (index < Object.values(address).length - 1 ? "," : ""),
        ""
      );

      await axios
        .patch(
          `/user/updateaddress/${user._id}`,
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((res) => {
          //re-fetch data
          setUser({
            ...user,
            addresses: res.data.user.addresses,
          });
          toast.success("Адрес успешно добавлен", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
          setLoading(true);
        })
        .catch((error) => {
          toast.error("Ошибка при добавлении адреса", {
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">Добавить новый адрес</span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Адрес улицы</label>
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleChange}
          required
        />
        <label className="popup-form-label">Палата</label>
        <input
          type="text"
          name="ward"
          value={address.ward}
          onChange={handleChange}
        />
        <label className="popup-form-label">Город/Район</label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
        />
        <label className="popup-form-label">Провинция/Город</label>
        <input
          type="text"
          name="province"
          value={address.province}
          onChange={handleChange}
        />
        <label className="popup-form-label">Страна</label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleChange}
        />
        <button className="popup-submit" onClick={handleAdd}>
          Добавить
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup2;
