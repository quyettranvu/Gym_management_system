import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./products/Products";
import DetailProduct from "../mainpages/detailProduct/detailProduct";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Register from "./auth/Register";
import OrderHistory from "./cart/history/OrderHistory";
import OrderDetails from "./cart/history/OrderDetails";
import UserProfile from "../mainpages/userProfile/UserProfile";
import Addresses from "../mainpages/addresses/Addresses";
import BelovedProducts from "./belovedproducts/BelovedProducts";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import UserManager from "./usermanager/UserManager";
import Dashboard from "./dashboard/Dashboard";
import Delivery from "./delivery/Delivery";

import { GloBalState } from "../../GlobalState";
import Messenger from "./messenger/Messenger";

export default function Pages() {
  const state = useContext(GloBalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Products />}></Route>
        <Route exact path="/detail/:id" element={<DetailProduct />}></Route>

        <Route
          exact
          path="/login"
          element={isLogged ? <NotFound /> : <Login />}
        ></Route>

        <Route
          exact
          path="/forgot_password"
          element={<ForgotPassword />}
        ></Route>

        <Route
          exact
          path="/resetpassword/:id/:token"
          element={<ResetPassword />}
        ></Route>

        <Route
          exact
          path="/register"
          element={isLogged ? <NotFound /> : <Register />}
        ></Route>
        <Route
          exact
          path="/category"
          element={isAdmin ? <Categories /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/create_product"
          element={isAdmin ? <CreateProduct /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/edit_product/:id"
          element={isAdmin ? <CreateProduct /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/user_manager"
          element={isAdmin ? <UserManager /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/dashboard"
          element={isAdmin ? <Dashboard /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/delivery"
          element={isAdmin ? <Delivery /> : <NotFound />}
        ></Route>

        <Route
          exact
          path="/history"
          element={isLogged ? <OrderHistory /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/history/:id"
          element={isLogged ? <OrderDetails /> : <NotFound />}
        ></Route>

        <Route exact path="/user_profile" element={<UserProfile />}></Route>
        <Route
          exact
          path="/user_profile/addresses"
          element={isLogged ? <Addresses /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/user_profile/belovedproducts"
          element={isLogged ? <BelovedProducts /> : <NotFound />}
        ></Route>
        <Route
          exact
          path="/user_profile/helpchat"
          element={isLogged ? <Messenger /> : <NotFound />}
        ></Route>

        <Route exact path="/cart" element={<Cart />}></Route>

        <Route exact path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}
