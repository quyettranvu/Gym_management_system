import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DeliveriesAPI() {
  const [services, setServices] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getDeliveries = async () => {
      const response = await axios.get("/api/delivery");
      setServices(response.data);
    };

    getDeliveries();
  }, [callback]);
  return {
    services: [services, setServices],
    callback: [callback, setCallback],
  };
}
