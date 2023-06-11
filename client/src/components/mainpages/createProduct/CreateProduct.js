import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GloBalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";

/*React Toastify for showing messages*/
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Use state as an object
const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description:
    "How to add tutorial videos of cool CSS effect, Web Design ideads, Javacript libraries, Node.",
  content:
    "Welcome to our hobby channel about coding. Here you can leanr web designing, UI/UX designing, html css tutorias, css animations and so on.",
  category: "",
  _id: "",
};

export default function CreateProduct() {
  const state = useContext(GloBalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const navigate = useNavigate();
  const param = useParams();

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;

  //Sử dụng useEffect ở đây để khi edit thì hiển thị lại đúng nội dung
  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      //nếu không có tham số id truyền vào(tức ko chọn edit sửa ảnh)
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Вы не администратор!");
      const file = e.target.files[0];

      if (!file) return alert("Файл не существует.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Слишком большой размер!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("Неверный формат файла.");

      let formData = new FormData();
      formData.append("file", file); //this will add value file to the key 'file' of formData

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("Вы не администратор!");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  //Lưu ý giá trị name ở đây là tương ứng với thuộc tính name của thẻ
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Вы не администратор!");
      if (!images) return alert("Изображения не загружены");

      //xử lý case update
      if (onEdit) {
        await axios
          .put(
            `/api/products/${product._id}`,
            { ...product, images },
            {
              headers: { Authorization: token },
            }
          )
          .then(() => {
            toast.success("Информация о продукте успешно обновлена!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          });
      } else {
        //xử lý case create
        await axios
          .post(
            "/api/products",
            { ...product, images },
            {
              headers: { Authorization: token },
            }
          )
          .then(() => {
            toast.success("Новый продукт успешно создан!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          });
      }

      //Sau khi cập nhật thêm sản phẩm mới thì trả lại nội dung hiển thị về ban đầu
      setCallback(!callback);
      setImages(false);
      setProduct(initialState);

      navigate("/"); //The useHistory hook gives you access to the history instance that you may use to navigate.
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const styleUpload = {
    display: images ? "block" : "none",
  };

  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Продукт_ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Название</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Описание</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Содержание</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            rows="7"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="categories">Категории: </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value="">Выбирать категорию</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{onEdit ? "Обновлять" : "Создать"}</button>
      </form>
    </div>
  );
}
