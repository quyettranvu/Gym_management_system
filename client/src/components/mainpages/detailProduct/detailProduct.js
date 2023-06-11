import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { GloBalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductITem";
import Popup6 from "../popup/Popup6";
import Popup7 from "../popup/Popup7";

//Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

//React Stars
import ReactStars from "react-rating-stars-component";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetailProduct() {
  const params = useParams(); //sử dụng useParams để có thể cho phép làm việc với nhận biến đầu vào
  const state = useContext(GloBalState);

  const [products] = state.productsAPI.products;
  const [user] = state.userAPI.user;
  const [token] = state.token;

  const addCart = state.userAPI.addCart;
  const [detailProduct, setDetailProduct] = useState([]);
  const [index, setIndex] = useState(0);
  const [popup6, setPopup6] = useState(false);
  const [popup7, setPopup7] = useState(false);

  useEffect(() => {
    if (params) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
      });
    }
  }, [params, products]);
  //console.log(detailProduct);

  if (detailProduct.length === 0) return null;

  let data = {
    productId: detailProduct.product_id,
    productTitle: detailProduct.title,
    productImages: detailProduct.images,
    productRating: detailProduct.rating,
    productPrice: detailProduct.price,
  };

  const handleBelovedProduct = async () => {
    if (!token) {
      alert("Пожалуйста, войдите, чтобы добавить свой любимый продукт");
    } else {
      await axios
        .patch(
          `/user/updatebelovedproducts/${user._id}`,
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then(() => {
          toast.success("Добавлено в любимый продукт успешно!", {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error("Ошибка при добавлении любимого товара", {
            autoClose: 2000,
          });
        });
    }
  };

  const handleComment = () => {
    if (!token) {
      alert("Пожалуйста, войдите, чтобы добавить свои комментарии");
    } else {
      setPopup6(true);
    }
  };

  const handleEditComment = (index) => {
    setPopup7(true);
    setIndex(index);
  };

  const handleDelete = (index) => {
    const commentId = detailProduct.reviews[index]._id; // assuming your comment object has an "_id" property
    axios
      .patch(`/api/products/comments/${detailProduct._id}`, {
        commentId,
      })
      .then((response) => {
        //refetch data
        setDetailProduct({
          ...detailProduct,
          reviews: response.data.updatedProduct.reviews,
        });

        toast.success("Комментарий успешно удален!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка удаления комментария", {
          autoClose: 2000,
        });
        console.log(error);
      });
  };

  return (
    <>
      <div className="detail">
        <img src={detailProduct.images.url} alt="" />
        <div className="box-detail">
          <div className="row">
            <h2>{detailProduct.title}</h2>
          </div>

          <span>Цена: $ {detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>Продал: {detailProduct.sold}</p>
          <div>
            Рейтинг:
            <ReactStars
              count={detailProduct.rating}
              size={30}
              edit={false}
              color="#ffd700"
              className="rating"
            />
          </div>
          <button className="add_beloved" onClick={handleBelovedProduct}>
            <FontAwesomeIcon icon={faHeart} />
            Добавить в любимый продукт
          </button>
          <Link
            to="/cart"
            className="cart"
            onClick={() => addCart(detailProduct)}
          >
            Купить
          </Link>
          <button className="cart_comment" onClick={handleComment}>
            Комментарии
          </button>
        </div>
      </div>

      <div className="comments-container">
        <h2>Комментарии</h2>
        {detailProduct.reviews.map((review, index) => (
          <div key={index} className="comment">
            <img src={review.userPhoto} alt="User" className="avatar" />
            <div className="comment-details">
              <div className="user-name">{review.userName}</div>
              <ReactStars
                count={5}
                size={24}
                value={review.rating}
                edit={false}
              />
              <div className="comment-text">{review.comment}</div>
              {user && user.name === review.userName && (
                <div className="comment-buttons">
                  <button
                    type="button"
                    className="comment-click-edit"
                    onClick={() => handleEditComment(index)}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="glyphicon glyphicon-profile"
                    />
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="comment-click-delete"
                    onClick={() => handleDelete(index)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="glyphicon glyphicon-profile"
                    />
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2>Related products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
      {popup6 ? (
        <Popup6
          className="open-popup-window"
          detailProduct={detailProduct}
          setDetailProduct={setDetailProduct}
          onClose={() => setPopup6(false)}
        />
      ) : null}
      {popup7 ? (
        <Popup7
          className="open-popup-window"
          detailProduct={detailProduct}
          setDetailProduct={setDetailProduct}
          index={index}
          onClose={() => setPopup7(false)}
        />
      ) : null}
    </>
  );
}
