import React, { useState } from "react";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("/user/forgotpassword", {
        email: email,
      })
      .then((res) => {
        toast.success(
          "Отправлено на вашу почту! Закройте это окно и откройте электронную почту, чтобы продолжить:)!",
          {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            autoClose: 2000,
          }
        );
      })
      .catch((error) => {
        toast.error("Ошибка отправки на вашу электронную почту", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="background-here">
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">
              Электронная почта для сброса ссылки для получения:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="row">
            <button type="submit">OK</button>
          </div>
          {/* {message && <p>{message}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
