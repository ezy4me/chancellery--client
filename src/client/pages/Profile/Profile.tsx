import styles from "./Profile.module.scss";

const orders = [
  { id: 1, date: "2024-03-01", total: 1500, status: "Доставлено" },
  { id: 2, date: "2024-03-05", total: 2500, status: "В пути" },
];

const Profile = () => {
  return (
    <div className={styles.profile}>
      <h1 className={styles.profile__title}>Личный кабинет</h1>
      <h2 className={styles.profile__subtitle}>Мои заказы</h2>
      <table className={styles.profile__table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.total} ₽</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
