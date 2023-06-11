import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState.js";
import Header from "./components/headers/Header.js";
import MainPages from "./components/mainpages/Pages.js";

/*React Toastify for showing messages*/
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <MainPages />
        </div>
      </Router>
      <ToastContainer />
    </DataProvider>
  );
}

export default App;
