/* eslint-disable css-modules/no-unused-class */
import styles from './pages.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <main className={styles.full_page}>
      <h1 className="text text_type_main-large mb-6">Лента заказов</h1>
      <p className="text text_type_main-default text_color_inactive">
        Раздел будет реализован в следующих спринтах.
      </p>
    </main>
  );
};
