import { Dialog } from "@headlessui/react";
import { useState } from "react";
import styles from "./LoginModal.module.scss";

const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.modal__overlay} />
      <div className={styles.modal__content}>
        <h2 className={styles.modal__title}>
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        <form className={styles.modal__form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Имя"
              className={styles.modal__input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className={styles.modal__input}
          />
          <input
            type="password"
            placeholder="Пароль"
            className={styles.modal__input}
          />
          <button type="submit" className={styles.modal__button}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <p
          className={styles.modal__toggle}
          onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Нет аккаунта? Зарегистрируйтесь!"
            : "Уже есть аккаунт? Войти"}
        </p>
      </div>
    </Dialog>
  );
};

export default LoginModal;
