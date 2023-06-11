import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GloBalState } from "../../../GlobalState";

const UserManager = () => {
  // eslint-disable-next-line no-unused-vars
  const state = useContext(GloBalState);
  // const [token] = state.token;
  // const [isAdmin] = state.userAPI.isAdmin;
  const [alluser, setAllUser] = useState([]);
  const [sortBy, setSortBy] = useState({ field: "createdAt", order: "asc" });

  //Get All Users
  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get("/user/getallusers");
      setAllUser(res.data);
    };

    getAllUsers();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortBy.field === field && sortBy.order === "asc";
    setSortBy({ field, order: isAsc ? "desc" : "asc" });
  };

  const sortedUsers = alluser.sort((a, b) => {
    const fieldA = a[sortBy.field];
    const fieldB = b[sortBy.field];
    const compare = fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
    return sortBy.order === "asc" ? compare : -compare;
  });

  return (
    <>
      <div>
        <form>
          <table className="table_usermanager">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => handleSort("name")}>
                  Имя{" "}
                  {sortBy.field === "name" &&
                    (sortBy.order === "asc" ? "▲" : "▼")}
                </th>
                <th>Роль</th>
                <th onClick={() => handleSort("_id")}>
                  ID пользователя{" "}
                  {sortBy.field === "_id" &&
                    (sortBy.order === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Электронная почта{" "}
                  {sortBy.field === "email" &&
                    (sortBy.order === "asc" ? "▲" : "▼")}
                </th>
                <th>Телефон</th>
                <th onClick={() => handleSort("createdAt")}>
                  Присоединился{" "}
                  {sortBy.field === "createdAt" &&
                    (sortBy.order === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={item.avatar} alt="" />
                    {item.name}
                  </td>
                  <td>{item.role === 1 ? "Администратор" : "Пользователь"}</td>
                  <td>{item._id}</td>
                  <td style={{ textTransform: "lowercase" }}>
                    {item.email.toLowerCase()}
                  </td>
                  <td>{item.phone}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("en-GB")}{" "}
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default UserManager;
