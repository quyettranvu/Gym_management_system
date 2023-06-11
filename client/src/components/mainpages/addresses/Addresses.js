import React, { useContext, useState } from "react";
import axios from "axios";
import { GloBalState } from "../../../GlobalState";

/*Popup Windows*/
import Popup2 from "../popup/Popup2";
import Popup3 from "../popup/Popup3";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faWallet,
  faLocationDot,
  faHeart,
  faCircleInfo,
  faCirclePlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import Footer from "../../footers/Footer";

function Addresses() {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  // const [loading, setLoading] = useState(false);
  // const [token] = state.token;
  const [index, setIndex] = useState(0);

  /*Popup for User Addresses*/
  const [popup2, setPopup2] = useState(false);
  const [popup3, setPopup3] = useState(false);

  const handleEditAddress = (index) => {
    setPopup3(true);
    setIndex(index);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Do you want to delete this address?")) {
      await axios
        .patch(`/user/deleteaddress/${user._id}`, { index })
        .then(() => {
          //re-fetch data
          const updatedAddresses = user.addresses.filter(
            (userAddress, i) => i !== index
          );
          setUser({
            ...user,
            addresses: updatedAddresses,
          });
          toast.success("Удалить этот адрес успешно!", {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ошибка удаления адреса", {
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-row">
          <div className="col-md-12 col-sm-12 col-xs-12 profile-image-section">
            <button
              className="profile-btn-add-addresses"
              onClick={() => setPopup2(true)}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="glyphicon glyphicon-profile"
              />
              Добавить адрес
            </button>
            <table className="profile-addresses">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Адреса</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {/*The optional chaining operator allows you to access properties of an object without having to check if the object or its properties are defined. It is useful when working with nested objects that may or may not exist.*/}
                {user?.addresses?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item}</td>
                    <td>
                      <button
                        type="button"
                        className="address-click-edit"
                        onClick={() => handleEditAddress(index)}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="glyphicon glyphicon-profile"
                        />
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="address-click-delete"
                        onClick={() => handleDelete(index)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="glyphicon glyphicon-profile"
                        />
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="profile-sidebar-general-addresses">
          <div className="col-md-3">
            <div className="profile-userpic">
              <img
                // src={`${user.avatar}?${new Date().getTime()}`}
                key={Date.now()}
                src={user.avatar}
                className="img-responsive"
                alt=""
              />
            </div>
          </div>

          <div className="profile-usertitle">
            <div className="profile-usertitle-name">{user.name}</div>
          </div>

          <h3>
            <span></span>
          </h3>

          <div className="profile-usermenu">
            <ul className="nav">
              <li>
                <a href="../user_profile">
                  <FontAwesomeIcon
                    icon={faAddressCard}
                    className="glyphicon glyphicon-profile"
                  />
                  Ваш профиль
                </a>
              </li>
              <li>
                <a href="/history">
                  <FontAwesomeIcon
                    icon={faWallet}
                    className="glyphicon glyphicon-profile"
                  />
                  История покупок
                </a>
              </li>
              <li>
                <a href="./addresses">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="glyphicon glyphicon-address"
                    color="yellow"
                  />
                  Ваши адреса
                </a>
              </li>
              <li>
                <a href="./belovedproducts">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="glyphicon glyphicon-heart"
                    color="red"
                  />
                  Следование
                </a>
              </li>
              <li>
                <a href="./helpchat">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="glyphicon glyphicon-help"
                    color="blue"
                  />
                  Помощь
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {popup2 ? (
        <Popup2
          className="open-popup-window"
          onClose={() => setPopup2(false)}
        />
      ) : null}
      {popup3 ? (
        <Popup3
          className="open-popup-window"
          index={index}
          onClose={() => setPopup3(false)}
        />
      ) : null}
    </>
  );
}

export default Addresses;
