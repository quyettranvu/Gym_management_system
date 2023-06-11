import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

//React Stars
import ReactStars from "react-rating-stars-component";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup6 = ({ onClose, detailProduct, setDetailProduct }) => {
  const state = useContext(GloBalState);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = state.userAPI.user;
  // const [loading, setLoading] = useState(false);
  // const [token] = state.token;

  /*Popup for User comments*/
  // const [popup6, setPopup6] = useState(false);

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleAdd = async () => {
    const newReview = {
      userPhoto: user.avatar,
      userName: user.name,
      rating: rating,
      comment: comment,
    };

    await axios
      .post(`/api/products/${detailProduct._id}`, newReview)
      .then((response) => {
        //refetch-data
        setDetailProduct({
          ...detailProduct,
          reviews: response.data.product.reviews,
        });
        toast.success("Новый отзыв успешно добавлен!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });

        // Clear the form inputs
        setRating(3);
        setComment("");
      })
      .catch((error) => {
        toast.error("Ошибка удаления адреса", {
          autoClose: 2000,
        });
        console.error("Ошибка добавления нового отзыва:", error);
      });
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">Обзор и оценка продукта</span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Рейтинг</label>

        <div>
          Поставить рейтинг:
          <ReactStars count={5} size={30} onChange={ratingChanged} />
        </div>
        <label className="popup-form-label">Обзор содержания</label>
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={handleChange}
        />
        <button className="popup-submit" onClick={handleAdd}>
          Добавлять
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup6;
