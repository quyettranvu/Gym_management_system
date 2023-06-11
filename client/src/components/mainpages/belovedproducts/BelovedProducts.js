import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Loading from "../utils/loading/Loading";
import { GloBalState } from "../../../GlobalState";

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
} from "@fortawesome/free-solid-svg-icons";
// import Footer from "../../footers/Footer";

function BelovedProducts() {
  const state = useContext(GloBalState);
  const [user, setUser] = state.userAPI.user;
  const [products] = state.productsAPI.products;
  const navigate = useNavigate();

  let productId;
  const moveDetailProduct = (productTitle) => {
    products.forEach((product) => {
      if (product.title === productTitle) {
        productId = product._id;
      }
    });
    navigate(`/detail/${productId}`);
  };

  const removeBelovedProduct = async (productId) => {
    await axios
      .patch(`/user/removebelovedproducts/${user._id}/${productId}`)
      .then(() => {
        // re-fetch the data
        const updatedBelovedProducts = user.belovedProducts.filter(
          (belovedProduct) => belovedProduct.productId !== productId
        );
        setUser({
          ...user,
          belovedProducts: updatedBelovedProducts,
        });

        toast.success("Этот любимый продукт успешно удален!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при удалении любимого продукта", {
          autoClose: 2000,
        });
      });
  };
  return (
    <>
      <div className="profile-container">
        <div className="profile-row">
          <div className="beloved_product">
            <p className="beloved_product_header">Следованные Продукты</p>
            {user?.belovedProducts?.map((belovedProduct) => (
              <div
                className="product_beloved_card"
                key={belovedProduct.productId}
              >
                <img
                  src={belovedProduct.productImages.url}
                  alt={belovedProduct.productTitle}
                />
                <div className="product_new_box">
                  <p>Rating: {belovedProduct.productRating}</p>
                  <h2 title={belovedProduct.productTitle}>
                    {belovedProduct.productTitle}
                  </h2>
                  <span>Цена: ${belovedProduct.productPrice}</span>
                </div>
                <div className="container_beloved_product">
                  <button
                    className="view_beloved_product"
                    onClick={() =>
                      moveDetailProduct(belovedProduct.productTitle)
                    }
                  >
                    Просмотр
                  </button>
                  <button
                    className="remove_beloved_product"
                    onClick={() =>
                      removeBelovedProduct(belovedProduct.productId)
                    }
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* <BtnRender product={product} deleteProduct={deleteProduct} /> */}
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
    </>
  );
}

export default BelovedProducts;
