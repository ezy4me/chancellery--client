import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetUserOrdersQuery } from "../../../api/OrderAPI";
import styles from "./Profile.module.scss";

const Profile = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    data: orders,
    isLoading,
    isError,
  } = useGetUserOrdersQuery(userId!, {
    skip: userId === null,
  });

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  if (!user) {
    return (
      <p className={styles.error}>Пожалуйста, войдите в свою учетную запись.</p>
    );
  }

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.title}>Личный кабинет</h1>

      <div className={styles.profileInfo}>
        <p className={styles.infoItem}>
          <strong>Имя:</strong> {user.name}
        </p>
        <p className={styles.infoItem}>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <h2 className={styles.ordersTitle}>Ваши заказы</h2>
      {isLoading && <p className={styles.loading}>Загрузка заказов...</p>}
      {isError && (
        <p className={styles.error}>
          Ошибка при загрузке заказов. Попробуйте позже.
        </p>
      )}

      {orders && orders.length > 0 ? (
        <ul className={styles.ordersList}>
          {orders.map((order) => (
            <li key={order.id} className={styles.orderItem}>
              <p className={styles.orderDetails}>
                <strong>Заказ #{order.id}</strong>
              </p>
              <p className={styles.orderDetails}>Статус: {order.status}</p>
              <p className={styles.orderDetails}>Сумма: {order.totalPrice} ₽</p>
              <p className={styles.orderDetails}>
                Дата создания: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noOrders}>У вас нет заказов.</p>
      )}
    </div>
  );
};

export default Profile;
