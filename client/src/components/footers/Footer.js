import React from "react";

/*Font Awesome*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="col">
        <h1>ОБО МНЕ</h1>
        <ul>
          <li>
            <FontAwesomeIcon icon={faDumbbell} />
            QUYETTRAN GYM SHOP
          </li>
          <li>
            СИСТЕМНЫЙ ВЕБ-САЙТ, где люди также могут совершать покупки, читать
            новости, записываться на занятия в спортзал и т. д....{" "}
          </li>
        </ul>
      </div>
      <div className="col">
        <h1>КАТЕГОРИИ</h1>
        <ul>
          <li>Аксессуар</li>
          <li>Питание</li>
          <li>Перекус в спортзале</li>
          <li>Специальный продукт повышения</li>
        </ul>
      </div>
      <div className="col">
        <h1>БЫСТРАЯ ССЫЛКА</h1>
        <ul>
          <li>Обо нас</li>
          <li>Контакт с нами</li>
          <li>Политика Конфиденциальности</li>
        </ul>
      </div>
    </div>
  );
}
