import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./Catalog.module.scss";
import { useGetProductsQuery } from "../../../api/ProductAPI";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../../api/WishlistAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Catalog: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: wishlist } = useGetWishlistQuery(userId!, {
    skip: !userId,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  useEffect(() => {
    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  }, [error]);

  if (isLoading) {
    return <div className={styles.loader}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка при загрузке товаров!</div>;
  }

  const isInWishlist = (productId: number) => {
    return wishlist?.some((item) => item.product.id === productId);
  };

  const handleWishlistToggle = async (productId: number) => {
    if (!userId) {
      alert("Войдите в аккаунт, чтобы добавить в избранное.");
      return;
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist({ userId, productId });
    } else {
      await addToWishlist({ userId, productId });
    }
  };

  return (
    <div className={styles.catalogPage}>
      <h1 className={styles.title}>Каталог товаров</h1>
      <div className={styles.catalogGrid}>
        {products?.map((product) => (
          <div key={product.id} className={styles.catalogItem}>
            <img
              src={product.image || "/public/placeholder.jpg"}
              alt={product.name}
              className={styles.catalogImage}
              onError={(e) => (e.currentTarget.src = "/public/placeholder.jpg")}
            />
            <div className={styles.catalogInfo}>
              <h3 className={styles.catalogName}>{product.name}</h3>
              <p className={styles.catalogDescription}>{product.description}</p>
              <div className={styles.catalogPrice}>{product.price} ₽</div>
              <Link
                to={`/product/${product.id}`}
                className={styles.catalogLink}>
                Подробнее
              </Link>
              <button
                className={styles.wishlistButton}
                onClick={() => handleWishlistToggle(product.id)}>
                {isInWishlist(product.id) ? (
                  <FaHeart className={styles.heartIconFilled} />
                ) : (
                  <FaRegHeart className={styles.heartIcon} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
