import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Popup1 = ({ onClose }) => {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  const [token] = state.token;
  const [passwordType, setPasswordType] = useState("password");

  //new password
  const [newpass, setNewpass] = useState("");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    //input data
    const data = {
      password: user.password,
      newpassword: newpass,
    };

    if (data.newpassword === "") {
      toast.error("Поле нового пароля не может быть пустым!", {
        autoClose: 2000,
      });
    } else {
      try {
        const res = await axios.patch(
          `/user/updatepass/${user._id}`,
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        toast.success("Пароль успешно обновлен", {
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
    }
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header">Изменить пароль</span>
      <div className="popup-modalContainer">
        <label className="popup-form-label">Текущий пароль</label>
        <input
          type={passwordType}
          name="password"
          defaultValue={user.password}
          onChange={handleChange}
        />
        {passwordType === "password" ? (
          <FontAwesomeIcon
            icon={faEye}
            className="password-toggle-popup"
            onClick={togglePassword}
          />
        ) : (
          <FontAwesomeIcon
            icon={faEyeSlash}
            className="password-toggle-popup"
            onClick={togglePassword}
          />
        )}
        <label className="popup-form-label">Новый пароль</label>
        <input
          type={passwordType}
          name="newpassword"
          value={newpass}
          onChange={(e) => setNewpass(e.target.value)}
          required
        />
        {passwordType === "password" ? (
          <FontAwesomeIcon
            icon={faEye}
            className="password-toggle-popup"
            onClick={togglePassword}
          />
        ) : (
          <FontAwesomeIcon
            icon={faEyeSlash}
            className="password-toggle-popup"
            onClick={togglePassword}
          />
        )}
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

export default Popup1;
