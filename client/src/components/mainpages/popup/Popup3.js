import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup3 = ({ onClose, index }) => {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  const [token] = state.token;

  const [newaddress, setNewAddress] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setNewAddress(e.target.value);
  };

  const handleEdit = async () => {
    const data = {
      index: index,
      value: newaddress,
    };

    await axios
      .patch(
        `/user/editaddress/${user._id}`,
        { data },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      .then((res) => {
        // re-fetch the data
        setUser({
          ...user,
          addresses: res.data.user.addresses,
        });
        toast.success("Изменить адрес успешно", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при добавлении адреса", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">Изменить адрес</span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Текущий адрес</label>
        <input
          type="text"
          name="inputaddress"
          defaultValue={user.addresses[index]}
          onChange={handleChange}
          required
        />
        <button className="popup-submit" onClick={handleEdit}>
          Сохранить
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup3;
