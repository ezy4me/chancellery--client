import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>Добро пожаловать в СКАУТ</h1>
      <p className={styles.home__text}>Качественная печатная продукция для вас</p>
      <Link to="/catalog" className={styles.home__button}>Перейти в каталог</Link>
    </div>
  );
};

export default Home;
