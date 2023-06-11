import React, { useContext, useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";
// import PayPalButton from "./PayPalButton";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const state = useContext(GloBalState);
  const [user] = state.userAPI.user;
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token; //như đã nói ở file GloBalState, token chính là access_token khi người dùng thao tác trong cart
  const [total, setTotal] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const moveDetailProduct = (productId) => {
    navigate(`/detail/${productId}`);
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]); //bởi vì cart là 1 mảng nên mình phải call tất cả dữ liệu trong mảng cart cũ
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Вы хотите удалить этот продукт?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1); //các tham số của phương thức splice của Array:thứ nhất là chỉ mục, thứ hai là số phần tử xóa đi, thứ ba là phần tử thêm vào
        }
      });
    }

    setCart([...cart]);
    addToCart(cart);
  };

  //Khi xử lý mua hàng thành công, sau khi thực hiện tạo Payment(theo đường dẫn) trả về dữ liệu cho người dùng
  const tranSuccess = async ({ paymentId, useraddress }) => {
    await axios
      .post(
        "/api/payment",
        { cart, paymentID: paymentId, address: useraddress, total },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => {
        toast.success("Успешный платеж!", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          autoClose: 2000,
        });
      });

    setCart([]);
    addToCart([]);
    //setCallback(!callback); //đơn giản là đặt callback=true
  };

  if (cart.length === 0) {
    return (
      <h2
        style={{
          textAlign: "center",
          fontSize: "5rem",
          minHeight: "calc(100vh - 70px)",
          overflow: "hidden",
        }}
      >
        Cart Empty
      </h2>
    );
  }

  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img
            src={product.images.url}
            alt=""
            onClick={() => moveDetailProduct(product._id)}
          />

          <div className="box-detail">
            <h2>{product.title}</h2>

            <h3 className="price_each">
              Итоговая цена: ${product.price * product.quantity}
            </h3>
            <p>Применение : {product.description}</p>
            <p>P/s: {product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}>+</button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}

      <div>
        <div className="address-label">Ваш адрес доставки:</div>
        <select
          id="address"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="select">Выбирать адрес доставки</option>
          {user?.addresses?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="total">
        <h3>Итого: $ {total}</h3>
        Оплатить сейчас:
        <PayPalScriptProvider
          options={{
            "client-id": "test",
          }}
        >
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                const paymentId = details.id;
                const useraddress = selectedValue;
                console.log(useraddress);
                console.log("The payment was succeeded!");
                tranSuccess({ paymentId, useraddress });
              });
            }}
            onError={(err) => {
              console.log("Error!", err);
            }}
            forceReRender={[selectedValue]}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
