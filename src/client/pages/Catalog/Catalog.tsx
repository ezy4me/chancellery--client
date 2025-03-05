import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Catalog.module.scss";
import { useGetProductsQuery } from "../../../api/ProductAPI";

const Catalog: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  useEffect(() => {
    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  }, [error]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке товаров!</div>;
  }

  return (
    <div className="catalog-page">
      <h1>Каталог товаров</h1>
      <div className="catalog-grid">
        {products?.map((product: any) => (
          <div key={product.id} className="catalog-item">
            <img
              src={product.image} 
              alt={product.name}
              className="catalog-item__image"
            />
            <div className="catalog-item__info">
              <h3 className="catalog-item__name">{product.name}</h3>
              <p className="catalog-item__description">{product.description}</p>
              <div className="catalog-item__price">{product.price} ₽</div>
              <Link to={`/product/${product.id}`} className="catalog-item__link">
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
