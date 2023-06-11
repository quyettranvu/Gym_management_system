import React, { useState, useEffect } from "react";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//token ở đây là được truy xuất từ giá trị token(tức access_token khi người dùng đăng nhập) trong file GlobalState.js
export default function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState([]);

  //useEffect for getting informations about user
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/user/infor", {
            headers: { Authorization: token },
          });

          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart); //đặt state mới cho cart là giá trị trả về cart từ phía server
          setUser(res.data);

          //setCart(res.data.cart)
          console.log(res);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };

      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert("Please login to continue buying");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios
        .patch(
          "/user/addcart",
          { cart: [...cart, { ...product, quantity: 1 }] },
          {
            headers: { Authorization: token }, //có config này là do trong router tương ứng mình đã call thêm auth
          }
        )
        .then(() => {
          toast.success("Added Product successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        });
    } else {
      alert("This product has been added to cart.");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart], //quản lý loại mặt hàng và state của nó trong giỏ
    addCart: addCart, //xử lý việc kiếm tra hàng đã được thêm vào chưa
    history: [history, setHistory],
    user: [user, setUser],
  };
}
