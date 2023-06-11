import React, { useContext, useState } from "react";
import { GloBalState } from "../../GlobalState.js";
import Menu from "./icon/align-justify-solid.svg";
import Close from "./icon/square-xmark-solid.svg";
import Cart from "./icon/cart-shopping-solid.svg";
import { Link } from "react-router-dom";
import axios from "axios";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const state = useContext(GloBalState);

  //Define access roles and fit contents
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [user] = state.userAPI.user;

  //Other states
  const [open, setOpen] = useState(false);

  //If anyone clicked on Log-out all states will be reset
  const logoutUser = async () => {
    await axios.get("/user/logout");
    //localStorage.clear();
    localStorage.removeItem("firstLogin");
    setIsAdmin(false);
    setIsLogged(false);
    window.location.href = "/";
  };

  // const closeMenu = () => {
  //   setOpen(false);
  // };

  const adminRouter = () => {
    return (
      <>
        <li
          className="menu-trigger"
          onMouseOver={() => {
            setOpen(!open);
          }}
        >
          ПРОДУКТЫ
        </li>
        <div
          className={`dropdown-menu ${open ? "active" : "inactive"}`}
          onMouseLeave={() => {
            setOpen(false);
          }}
        >
          <ul>
            <li>
              <Link to="/create_product">Создать Продукт</Link>
            </li>
            <li>
              <Link to="/category">Категория</Link>
            </li>
          </ul>
        </div>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/user_function">
            {isAdmin ? "Управления фитнесом" : "Фитнес для тебя!"}
          </Link>
        </li>
        <li>
          <Link to="/history">История</Link>
        </li>
        <li>
          <ul>
            <div className="dropdown-profile">
              <img
                src={user.avatar}
                className="dropdown-dropbtn-profile"
                alt=""
              />
              <div className="dropdown-content-profile">
                <li>
                  <Link to="/user_profile">{user.name}</Link>
                </li>
                <li>
                  <Link to="/user_manager">
                    {isAdmin
                      ? "Управление пользователем"
                      : "Управление магазина"}
                  </Link>
                </li>
                {isAdmin ? (
                  <li>
                    <Link to="/dashboard">Приборная Панель</Link>
                  </li>
                ) : null}
                {isAdmin ? (
                  <li>
                    <Link to="/delivery">Служба доставки</Link>
                  </li>
                ) : null}
                <li>
                  <Link to="/" onClick={logoutUser}>
                    Выйти
                  </Link>
                </li>
              </div>
            </div>
          </ul>
        </li>
      </>
    );
  };

  return (
    <header>
      <div className="menu">
        <img src={Menu} alt="" width="30" />
      </div>

      <div className="logo">
        <h1>
          <FontAwesomeIcon icon={faDumbbell} />
          <Link to="/">{isAdmin ? "Администратор" : "QuyetTran Gym Shop"}</Link>
        </h1>
      </div>

      <ul>
        <li>
          <Link to="/">Shop</Link>
        </li>
        <li>
          <Link to="/news">
            {isAdmin ? "Создать новость" : "Читать новости"}
          </Link>
        </li>

        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Логин и Регистрация</Link>
          </li>
        )}

        <li>
          <img src={Close} alt="" width="30" className="menu" />
        </li>
      </ul>

      {isAdmin || !isLogged ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}
