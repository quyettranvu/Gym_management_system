import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import DeliveriesAPI from "./api/DeliveriesAPI";
import axios from "axios";

export const GloBalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  //Perform side effect
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    /*nếu như là firstLogin(được set up trong localStorage từ login) call đến route ở backend*/
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.get("/user/refresh_token");

        setToken(res.data.accesstoken);
      };

      //refreshToken will be proceeded after 15000ms
      setTimeout(() => {
        refreshToken();
      }, 15000);

      refreshToken();
    }
  }, []);

  //Here is our useContext parameter(initialized with following states)
  //-incase we want to take state from GlobalState: useContext(GlobalState)
  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
    deliveriesAPI: DeliveriesAPI(),
  };

  return <GloBalState.Provider value={state}>{children}</GloBalState.Provider>;
};
