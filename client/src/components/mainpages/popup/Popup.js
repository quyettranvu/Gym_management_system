import React, { useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = ({ onClose }) => {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  const [token] = state.token;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    //input data
    const data = {
      newName: user.name,
      newEmail: user.email,
      newPhone: user.phone,
    };

    try {
      const res = await axios.patch(
        `/user/updateinfo/${user._id}`,
        { data },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      toast.success("Информация успешно обновлена", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      console.log(res.data);
    } catch (error) {
      toast.error("Неверный текущий пароль", {
        autoClose: 2000,
      });
      //console.log(error.response.data);
    }
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header">Редактировать профиль</span>
      <div className="popup-modalContainer">
        <label className="popup-form-label">Имя</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
        <label className="popup-form-label">Электронная почта</label>
        <input type="email" name="email" value={user.email} readOnly />
        <label className="popup-form-label">Телефон</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />
        <button className="popup-submit" onClick={handleAdd}>
          Сохранить
        </button>
      </div>
      <button className="popup-closeBtn" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup;
