/* eslint-disable css-modules/no-unused-class */
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import styles from './pages.module.css';

export const IngredientPage = (): React.JSX.Element => {
  return (
    <main className={styles.full_page}>
      <h1 className="text text_type_main-large mb-6">Детали ингредиента</h1>
      <IngredientDetails />
    </main>
  );
};
