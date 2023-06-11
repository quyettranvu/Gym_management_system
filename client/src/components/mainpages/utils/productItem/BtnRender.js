import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GloBalState } from "../../../../GlobalState";

export default function BtnRender({ product, deleteProduct }) {
  const state = useContext(GloBalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;

  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link
            id="btn_buy"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            Удалить
          </Link>
          <Link id="btn_view" to={`/edit_product/${product._id}`}>
            Редактировать
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_buy" to="#!" onClick={() => addCart(product)}>
            Купить
          </Link>
          <Link id="btn_view" to={`/detail/${product._id}`}>
            Просмотр
          </Link>
        </>
      )}
    </div>
  );
}
