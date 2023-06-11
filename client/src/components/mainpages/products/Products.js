/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect, useCallback } from "react";
import { GloBalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductITem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import { Data } from "../../../Data";

// import LoadMore from "./LoadMore";
import ReactPaginate from "react-paginate";
import Footer from "../../footers/Footer";

//Alan Voice AI
import alanBtn from "@alan-ai/alan-sdk-web";

export default function Products() {
  const state = useContext(GloBalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });

    setProducts([...products]); //set state for many items
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      // eslint-disable-next-line no-unused-vars
      const destroyImg = await axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );

      // eslint-disable-next-line no-unused-vars
      const deleteProduct = await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      setLoading(false);
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  //Pagination using React Hooks(react-paginate)
  const [currentProducts, setCurrentProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentProducts(products.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, products]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    alanBtn({
      key: "9f537171dd937fe0997a215d21b3a71e2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command }) => {
        if (command === "firstCommand") {
          alert("firstCommand");
        }
        if (command === "бутылка") {
          filter("бутылка");
        }
      },
    });
    // filter("");
  }, []);

  const filter = (names) => {
    // console.log(products);
    const filtered = Data.filter(function (item) {
      if (item.title.includes(names)) {
        return true;
      } else return null;
    });
    setCurrentProducts(filtered);
  };

  if (loading)
    return (
      <div className="product_card">
        <Loading />
      </div>
    );

  return (
    <>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Выбрать все</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Удалить все</button>
        </div>
      )}

      <h1>Let's Discover</h1>
      <ul className="cards">
        <li>
          <a href="" className="card">
            <img src="gym_nutritions.jpg" className="card__image" alt="" />
            <div className="card__overlay">
              <div className="card__header">
                <img className="card__thumb" src="keep_smiling.jpg" alt="" />
                <div className="card__header-text">
                  <h3 className="card__title">
                    Все, что вам нужно для питания
                  </h3>
                </div>
              </div>
              <p className="card__description">
                У нас есть все виды витаминов, сыворотки, белков, рыбьего жира и
                многое другое ^^!
              </p>
            </div>
          </a>
        </li>

        <li>
          <a href="" className="card">
            <img src="gym_assessories.jpg" className="card__image" alt="" />
            <div className="card__overlay">
              <div className="card__header">
                <img className="card__thumb" src="keep_smiling.jpg" alt="" />
                <div className="card__header-text">
                  <h3 className="card__title">
                    Все отличные аксессуары для спортзала
                  </h3>
                </div>
              </div>
              <p className="card__description">
                У нас также есть все виды спортивных аксессуаров, которые вам
                нужны :))!
              </p>
            </div>
          </a>
        </li>

        <li>
          <a href="" className="card">
            <img src="gym_snack.jpg" className="card__image" alt="" />
            <div className="card__overlay">
              <div className="card__header">
                <img className="card__thumb" src="keep_smiling.jpg" alt="" />
                <div className="card__header-text">
                  <h3 className="card__title">
                    Все вкусные закуски в спортзал
                  </h3>
                </div>
              </div>
              <p className="card__description">
                Большой выбор спортивных закусок соответствует всем вашим
                требованиям и вкусу вашей семьи :>!
              </p>
            </div>
          </a>
        </li>

        <li>
          <a href="" className="card">
            <img src="power_boost_product.png" className="card__image" alt="" />
            <div className="card__overlay">
              <div className="card__header">
                <img className="card__thumb" src="keep_smiling.jpg" alt="" />
                <div className="card__header-text">
                  <h3 className="card__title">
                    Все специальные продукты для повышения мощности
                  </h3>
                </div>
              </div>
              <p className="card__description">
                Ознакомьтесь также со всеми натуральными продуктами для
                увеличения силы, изготовленными из превосходных ингредиентов (:!
              </p>
            </div>
          </a>
        </li>
      </ul>

      <h1>Gym Products World</h1>
      <div className="products">
        {currentProducts.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
      {/* <LoadMore /> */}
      {products.length === 0 && <Loading />}

      <h1>Promotions</h1>

      <div className="promo-coupon">
        <div className="promo-container">
          <h3>CodeGym QuyetTran Shop</h3>
        </div>
        <img src="gym_logo.jpg" className="promo-image" alt="Avatar" />
        <div className="promo-container">
          <h2>
            <b>СКИДКА 20% НА ПОКУПКУ ПРИ РЕГИСТРАЦИИ В НАШЕМ МАГАЗИНЕ</b>
          </h2>
        </div>
        <div className="promo-container">
          <p>
            Использовать промо-код:{" "}
            <span className="promo-promo">Недоступен</span>
          </p>
          <p className="promo-expire">Истекает: никогда</p>
        </div>
      </div>

      <div className="footer-shop">
        <h1>Hello</h1>
        <Footer />
      </div>
    </>
  );
}
