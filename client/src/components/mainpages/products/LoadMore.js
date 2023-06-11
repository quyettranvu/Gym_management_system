import React, { useContext } from "react";
import { GloBalState } from "../../../GlobalState";

export default function LoadMore() {
  const state = useContext(GloBalState);
  const [page, setPage] = state.productsAPI.page;
  const [result] = state.productsAPI.result;
  return (
    <div className="load_more">
      {result < page * 5 ? (
        ""
      ) : (
        <button onClick={() => setPage(page + 1)}>Загрузи больше</button>
      )}
    </div>
  );
}
