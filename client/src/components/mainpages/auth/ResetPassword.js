import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`/user/resetpassword/${id}/${token}`, { password })
      .then((res) => {
        toast.success("Сбросить пароль успешно!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Ошибка при сбросе пароля", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="background-here">
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">Сбросить пароль</label>
            <input
              type={passwordType}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          </div>
          <div className="row">
            <button type="submit">Сброс пароля</button>
          </div>
          {/* {message && <p>{message}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
