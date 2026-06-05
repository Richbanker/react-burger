import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getIngredients = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/ingredients`);

        if (!response.ok) {
          throw new Error('Ошибка загрузки ингредиентов');
        }

        const result = (await response.json()) as TIngredientsResponse;

        if (!result.success) {
          throw new Error('API вернул ошибку');
        }

        setIngredients(result.data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void getIngredients();
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className="text text_type_main-medium mt-10">
          Произошла ошибка при загрузке ингредиентов
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
};

export default App;
