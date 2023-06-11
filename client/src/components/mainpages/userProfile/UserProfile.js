/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import axios from "axios";
// import Loading from "../utils/loading/Loading";
import { GloBalState } from "../../../GlobalState";

/*Popup Windows*/
import Popup from "../popup/Popup";
import Popup1 from "../popup/Popup1";

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
  faUser,
  faPenToSquare,
  faKey,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
// import Footer from "../../footers/Footer";

function UserProfile() {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [token] = state.token;

  /*Popup for User Edit Informations, Password*/
  const [popup, setPopup] = useState(false);
  const [popup1, setPopup1] = useState(false);

  //Edit Avatar
  const editAvatar = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    try {
      let formData = new FormData();
      formData.append("file", file); //this will add value file to the key 'file' of formData

      setLoading(true);
      await axios
        .post("/api/user/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        })
        .then(async (res) => {
          await axios
            .put(
              `/user/upload/${user._id}`,
              { avatar: res.data.url },
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
                avatar: res.data.user.avatar,
              });
              toast.success("Аватар успешно загружен!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
              setLoading(true);
            })
            .catch((error) => {
              toast.error("Ошибка при загрузке аватара", {
                autoClose: 2000,
              });
            });
        });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  //Edit Cover Photo
  const editCoverPhoto = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      let formData = new FormData();
      formData.append("file", file); //this will add value file to the key 'file' of formData
      setLoading(true);
      await axios
        .post("/api/user/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        })
        .then(async (res) => {
          await axios
            .put(
              `/user/coverupload/${user._id}`,
              {
                coverphoto: res.data.url,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            )
            .then((res) => {
              setUser({
                ...user,
                coverphoto: res.data.user.coverphoto,
              });
              toast.success("Фото обложки успешно загружено!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              });
              setLoading(true);
            })
            .catch((error) => {
              toast.error("Ошибка при загрузке обложки", {
                autoClose: 2000,
              });
            });
        });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-row">
          <div className="col-md-12 col-sm-12 col-xs-12 profile-image-section">
            <img
              //src={`${user.coverphoto}?${new Date().getTime()}`}
              key={Date.now()}
              src={user.coverphoto}
              alt=""
            />
            <label htmlFor="profileImage">
              <a className="profile-usercoverphoto">
                <FontAwesomeIcon icon={faCamera} />
                Редактировать фото обложки
              </a>
            </label>
            <input
              type="file"
              name="profileImage"
              id="profileImage"
              style={{ display: "none" }}
              onChange={editCoverPhoto}
            />
          </div>
        </div>

        <div className="profile-sidebar-general">
          <div className="col-md-3">
            <div className="profile-userpic">
              <img
                // src={`${user.avatar}?${new Date().getTime()}`}
                key={Date.now()}
                src={user.avatar}
                className="img-responsive"
                alt=""
              />
              <label htmlFor="profileNewImage">
                <a className="profile-userphoto">
                  <FontAwesomeIcon icon={faCamera} />
                  Загрузить
                </a>
              </label>
              <input
                type="file"
                name="profileNewImage"
                id="profileNewImage"
                style={{ display: "none" }}
                onChange={editAvatar}
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
                <a href="./user_profile">
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
                <a href="./user_profile/addresses">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="glyphicon glyphicon-address"
                    color="yellow"
                  />
                  Ваши адреса
                </a>
              </li>
              <li>
                <a href="./user_profile/belovedproducts">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="glyphicon glyphicon-heart"
                    color="red"
                  />
                  Следование
                </a>
              </li>
              <li>
                <a href="./user_profile/helpchat">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="glyphicon glyphicon-help"
                    color="blue"
                  />
                  Помощ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <span className="profile-usertextbox">
          Имя: {user.name}
          <br />
          <br />
          Электронная почта: {user.email}
          <br />
          <br />
          Телефон: {user.phone}
          <br />
          <br />
          Роль:
          {user.role === 0 ? (
            <p>
              <FontAwesomeIcon icon={faUser} />
              Пользователь
            </p>
          ) : (
            <p>
              <FontAwesomeIcon icon={faUser} />
              Администратор
            </p>
          )}
          <br />
          Joined: {new Date(user.createdAt).toLocaleDateString("en-US")}
          <br />
          <button onClick={() => setPopup(true)} className="profile-useredit">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="glyphicon glyphicon-profile"
            />
          </button>
          <button
            onClick={() => setPopup1(true)}
            className="profile-userpassword"
          >
            <FontAwesomeIcon
              icon={faKey}
              className="glyphicon glyphicon-profile"
            />
          </button>
        </span>
      </div>
      {popup ? (
        <Popup className="open-popup-window" onClose={() => setPopup(false)} />
      ) : null}
      {popup1 ? (
        <Popup1
          className="open-popup-window"
          onClose={() => setPopup1(false)}
        />
      ) : null}
    </>
  );
}

export default UserProfile;
