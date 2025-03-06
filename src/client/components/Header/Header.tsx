import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import LoginModal from "../LoginModal/LoginModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import styles from "./Header.module.scss";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  // Определяем путь к профилю в зависимости от роли
  const getProfilePath = () => {
    if (user?.role === "ADMIN") return "/admin";
    if (user?.role === "MANAGER") return "/manager";
    return "/auth/profile";
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__logo}>
          СКАУТ
        </Link>
        <nav className={styles.header__nav}>
          <Link to="/catalog" className={styles.header__link}>
            Каталог
          </Link>
          <Link to="/checkout" className={styles.header__link}>
            Заказы
          </Link>
          <Link to="/favorites" className={styles.header__link}>
            <AiOutlineHeart size={20} />
          </Link>

          {user ? (
            <Link to={getProfilePath()} className={styles.header__button}>
              Профиль
            </Link>
          ) : (
            <button
              className={styles.header__button}
              onClick={() => setIsModalOpen(true)}>
              Войти
            </button>
          )}
        </nav>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
