import { Link } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../LoginModal/LoginModal";
import styles from "./Header.module.scss";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__logo}>СКАУТ</Link>
        <nav className={styles.header__nav}>
          <Link to="/catalog" className={styles.header__link}>Каталог</Link>
          <Link to="/orders" className={styles.header__link}>Заказы</Link>
          <button className={styles.header__button} onClick={() => setIsModalOpen(true)}>Войти</button>
        </nav>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
