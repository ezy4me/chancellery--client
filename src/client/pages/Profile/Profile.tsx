import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetUserOrdersQuery } from "../../../api/OrderAPI";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiLogOut, FiClock, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { Spin, Card, Tag } from "antd";
import styles from "./Profile.module.scss";
import { FaArrowRight } from "react-icons/fa";

const Profile = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'завершен':
        return 'green';
      case 'в обработке':
        return 'orange';
      case 'отменен':
        return 'red';
      default:
        return 'blue';
    }
  };

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <Card className={styles.errorCard}>
          <h2>Доступ ограничен</h2>
          <p>Пожалуйста, войдите в свою учетную запись</p>
          <button 
            onClick={() => navigate('/auth/login')} 
            className={styles.loginButton}
          >
            Войти
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.userAvatar}>
          <FiUser size={48} />
        </div>
        <h1 className={styles.title}>Личный кабинет</h1>
      </div>

      <div className={styles.profileContent}>
        <Card className={styles.infoCard} title="Контактная информация">
          <div className={styles.infoItem}>
            <FiPhone className={styles.infoIcon} />
            <span className={styles.infoText}>{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <FiMail className={styles.infoIcon} />
            <span className={styles.infoText}>{user.email}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            <FiLogOut className={styles.logoutIcon} />
            Выйти из аккаунта
          </button>
        </Card>

        <div className={styles.ordersSection}>
          <h2 className={styles.ordersTitle}>
            <FiCheckCircle className={styles.titleIcon} />
            История заказов
          </h2>
          
          {isLoading && (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          )}

          {isError && (
            <Card className={styles.errorCard}>
              <p>Ошибка при загрузке заказов. Попробуйте позже.</p>
            </Card>
          )}

          {orders && orders.length > 0 ? (
            <div className={styles.ordersGrid}>
              {orders.map((order) => (
                <Card 
                  key={order.id} 
                  className={styles.orderCard}
                  hoverable
                >
                  <div className={styles.orderHeader}>
                    <h3>Заказ #{order.id}</h3>
                    <Tag color={getStatusColor(order.status)}>
                      {order.status}
                    </Tag>
                  </div>
                  
                  <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                      <FiDollarSign className={styles.detailIcon} />
                      <span>{order.totalPrice} ₽</span>
                    </div>
                    <div className={styles.detailItem}>
                      <FiClock className={styles.detailIcon} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className={styles.detailsButton}
                  >
                    Подробнее
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            !isLoading && (
              <Card className={styles.emptyCard}>
                <p>У вас пока нет заказов</p>
                <button 
                  onClick={() => navigate('/catalog')}
                  className={styles.catalogButton}
                >
                  Перейти в каталог
                  <FaArrowRight className={styles.arrowIcon}/>
                </button>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;