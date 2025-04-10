import React from 'react';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import styles from './Contacts.module.scss';
import { FaTelegramPlane } from 'react-icons/fa';

const Contacts: React.FC = () => {
  return (
    <div className={styles.contactsPage}>
      <div className={styles.heroSection}>
        <h1>Свяжитесь с нами</h1>
        <p>Мы всегда рады помочь и ответить на ваши вопросы</p>
      </div>

      <div className={styles.contactsContainer}>
        <div className={styles.contactInfo}>
          <div className={styles.contactCard}>
            <MailOutlined className={styles.icon} />
            <h3>Электронная почта</h3>
            <p>support@example.com</p>
          </div>

          <div className={styles.contactCard}>
            <PhoneOutlined className={styles.icon} />
            <h3>Телефон</h3>
            <p>+7 (123) 456-78-90</p>
          </div>

          <div className={styles.contactCard}>
            <EnvironmentOutlined className={styles.icon} />
            <h3>Адрес</h3>
            <p>г. Москва, ул. Примерная, д. 123</p>
          </div>

          <div className={styles.contactCard}>
            <ClockCircleOutlined className={styles.icon} />
            <h3>Часы работы</h3>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб-Вс: выходной</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2>Напишите нам</h2>
          <form>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Ваше имя" required />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Ваш email" required />
            </div>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Тема сообщения" />
            </div>
            <div className={styles.formGroup}>
              <textarea placeholder="Ваше сообщение" rows={5} required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>

      <div className={styles.mapSection}>
        <iframe
          title="Офис на карте"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&amp;source=constructor"
          width="100%"
          height="400"
          frameBorder="0"
        ></iframe>
      </div>

      <div className={styles.socialSection}>
        <h2>Мы в социальных сетях</h2>
        <div className={styles.socialIcons}>
          <a href="#"><InstagramOutlined className={styles.socialIcon} /></a>
          <a href="#"><FaTelegramPlane className={styles.socialIcon} /></a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;