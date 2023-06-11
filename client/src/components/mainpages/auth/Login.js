import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { GloBalState } from "../../../GlobalState";

import Google from "./icon/icons8-google.svg";
import Facebook from "./icon/icons8-facebook.svg";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("password");

  const onChangeInput = (e) => {
    const { name, value } = e.target; //value trong dòng này là value hiện tại của đối tượng
    setUser({ ...user, [name]: value }); //trong đó value chính là giá trị đã được cập nhật mới từ đối tượng
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", { ...user }); //để ý đường dẫn ở đây là được hình thành từ backend(gồm root và đối tượng cụ thể)

      localStorage.setItem("firstLogin", true); //cập nhật vào localStorage 1 hiển thị thành công

      window.location.href = "/"; //trả về URL của trang hiện tại(ở đây là trả về trang theo đường dẫn tức trang homepage)
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const googleAuth = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };

  return (
    <div className="background-here">
      <div className="login-page">
        <form onSubmit={loginSubmit}>
          <h2>Авторизация</h2>

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
            <button type="submit">Логин</button>
            <div>
              У вас нет аккаунта? &nbsp;
              <Link to="/register">Регистрация</Link>
            </div>
          </div>
        </form>

        <div className="forget-password">
          Забыли свой пароль?
          <a href="/forgot_password">Отправить электронное письмо</a>
        </div>

        <h3>
          <span>OR</span>
        </h3>
        <button href="#" className="google-btn" onClick={googleAuth}>
          <img src={Google} alt="" width="25" />
          Войти с Google+
        </button>
        <button href="#" className="facebook-btn">
          <img src={Facebook} alt="" width="25" />
          Войти с Facebook
        </button>
      </div>
    </div>
  );
}
