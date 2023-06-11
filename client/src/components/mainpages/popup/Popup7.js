import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

//React Stars
import ReactStars from "react-rating-stars-component";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup7 = ({ onClose, detailProduct, setDetailProduct, index }) => {
  const state = useContext(GloBalState);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = state.userAPI.user;
  // const [token] = state.token;

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleEdit = async () => {
    const commentId = detailProduct.reviews[index]._id;
    const updatedReview = {
      commentId: commentId,
      rating: rating,
      comment: comment,
    };

    await axios
      .put(`/api/products/comments/${detailProduct._id}`, updatedReview)
      .then((response) => {
        //refetch-data
        setDetailProduct({
          ...detailProduct,
          reviews: response.data.product.reviews,
        });

        toast.success("Отзыв успешно обновлен!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error("Ошибка при обновлении отзыва", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="popup-over-lay">
      <span className="popup-header-addresses">Редактировать отзыв</span>
      <div className="popup-modalContainer-addresses">
        <label className="popup-form-label">Рейтинг</label>

        <div>
          Поставить рейтинг:
          <ReactStars
            count={5}
            size={30}
            value={detailProduct.reviews[index].rating}
            onChange={ratingChanged}
          />
        </div>
        <label className="popup-form-label">Обзор содержания</label>
        <input
          type="text"
          name="comment"
          defaultValue={detailProduct.reviews[index].comment}
          onChange={handleChange}
        />
        <button className="popup-submit" onClick={handleEdit}>
          Добавлять
        </button>
      </div>
      <button className="popup-closeBtn-addresses" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Popup7;
