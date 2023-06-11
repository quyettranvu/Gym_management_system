import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("password");

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); //những name(tức tương ứng là name,email,password) sẽ được thay đổi bằng giá trị value mới cập nhật
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/user/register", { ...user });

      localStorage.setItem("firstRegister", true);

      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="background-here">
      <div className="login-page">
        <form onSubmit={registerSubmit}>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={user.name}
            onChange={onChangeInput}
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={user.email}
            onChange={onChangeInput}
          />

          <input
            type={passwordType}
            name="password"
            required
            autoComplete="on"
            placeholder="Password"
            value={user.password}
            onChange={onChangeInput}
          />
          {passwordType === "password" ? (
            <FontAwesomeIcon
              icon={faEye}
              className="password-toggle"
              onClick={togglePassword}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              className="password-toggle"
              onClick={togglePassword}
            />
          )}

          <div className="row">
            <button type="submit">Регистрация</button>
            <div>
              Уже есть аккаунт? &nbsp;
              <Link to="/login">Логин</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
