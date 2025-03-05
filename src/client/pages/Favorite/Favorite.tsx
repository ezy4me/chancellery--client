import React from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import styles from "./Favorite.module.scss";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../../api/WishlistAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Favorites: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const {
    data: wishlist,
    isLoading,
    error,
    refetch,
  } = useGetWishlistQuery(userId!, {
    skip: !userId,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (!userId) {
    return <div className={styles.message}>Пожалуйста, войдите в аккаунт.</div>;
  }

  if (isLoading) {
    return <div className={styles.message}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.message}>Ошибка при загрузке данных.</div>;
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className={styles.message}>
        Вы пока ничего не добавили в избранное.
      </div>
    );
  }

  const handleRemove = async (productId: number) => {
    await removeFromWishlist({ userId, productId });
    await refetch(); // 🔥 Обновляем список после удаления
  };

  return (
    <div className={styles.favoritesPage}>
      <h1 className={styles.title}>Избранные товары</h1>
      <div className={styles.favoritesGrid}>
        {wishlist.map((item) => (
          <div key={item.product.id} className={styles.favoritesItem}>
            <img
              src={item.product.image || "/public/placeholder.jpg"}
              alt={item.product.name}
              className={styles.favoritesImage}
              onError={(e) => (e.currentTarget.src = "/public/placeholder.jpg")}
            />
            <div className={styles.favoritesInfo}>
              <h3 className={styles.favoritesName}>{item.product.name}</h3>
              <p className={styles.favoritesDescription}>
                {item.product.description}
              </p>
              <div className={styles.favoritesPrice}>
                {item.product.price} ₽
              </div>
              <Link
                to={`/product/${item.product.id}`}
                className={styles.favoritesLink}>
                Подробнее
              </Link>
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(item.product.id)}>
                <FaTrash className={styles.trashIcon} /> Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
