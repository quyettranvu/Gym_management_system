import React, { useState, useContext } from "react";
import { GloBalState } from "../../../GlobalState";
import axios from "axios";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Categories() {
  const state = useContext(GloBalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback; //lưu ý một điều ở đây là mình đã call đến callback để quản lý việc gọi lại từ file CategoriesAPI
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault(); //calcel default actions that belong to event
    try {
      if (onEdit) {
        await axios
          .put(
            `/api/category/${id}`,
            { name: category },
            {
              headers: { Authorization: token },
            }
          )
          .then(() => {
            toast.success("Категория успешно обновлена!", {
              position: toast.POSITION.TOP_RIGHT,
              theme: "dark",
              autoClose: 2000,
            });
          })
          .catch((error) => {
            toast.error("Ошибка при обновлении категории", {
              autoClose: 2000,
            });
          });
        // alert(res.data.msg);
      } else {
        await axios
          .post(
            "/api/category",
            { name: category },
            {
              headers: { Authorization: token },
            }
          )
          .then(() => {
            toast.success("Новая категория успешно добавлена!", {
              position: toast.POSITION.TOP_RIGHT,
              theme: "dark",
              autoClose: 2000,
            });
          })
          .catch((error) => {
            toast.error("Ошибка при добавлении новой категории", {
              autoClose: 2000,
            });
          });
        // alert(res.data.msg)
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="categories">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Категория</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">{onEdit ? "Обновлять" : "Создать"}</button>
      </form>

      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button onClick={() => editCategory(category._id, category.name)}>
                Редактировать
              </button>
              <button onClick={() => deleteCategory(category._id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
