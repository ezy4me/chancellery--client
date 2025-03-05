import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <p className={styles.footer__text}>© 2024 СКАУТ. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
