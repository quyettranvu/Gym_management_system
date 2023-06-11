import React, { useContext } from "react";
import { GloBalState } from "../../../GlobalState";

export default function Filters() {
  const state = useContext(GloBalState);
  const [categories] = state.categoriesAPI.categories;

  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;

  const handleCategory = (e) => {
    setCategory(e.target.value); //value bằng category nên set sự thay đổi sử dụng setCategory
    setSearch("");
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <span>Filters: </span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">All Products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={search}
        placeholder="Введить свой поиск!"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="row">
        <span>Sort By: </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Новейшие</option>
          <option value="sort=oldest">Старейший</option>
          <option value="sort=-sold">Лучшие продажи</option>
          <option value="sort=-price">Цена: высокая-низкая</option>
          <option value="sort=price">Цена: низкая-высокая</option>
        </select>
      </div>
    </div>
  );
}
