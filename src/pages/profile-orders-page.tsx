/* eslint-disable css-modules/no-unused-class */
import styles from './pages.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  return (
    <section className={styles.placeholder}>
      <h1 className="text text_type_main-medium mb-6">История заказов</h1>
      <p className="text text_type_main-default text_color_inactive">
        Здесь будет история ваших заказов.
      </p>
    </section>
  );
};
