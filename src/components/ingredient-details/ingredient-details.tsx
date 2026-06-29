import { useParams } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient?: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const currentIngredient =
    ingredient ?? ingredients.find((item) => item._id === id) ?? null;

  if (!currentIngredient) {
    return (
      <p className="text text_type_main-medium text_color_inactive">
        Ингредиент не найден
      </p>
    );
  }

  return (
    <article className={styles.details}>
      <img
        className={styles.image}
        src={currentIngredient.image_large}
        alt={currentIngredient.name}
      />

      <h3 className="text text_type_main-medium mt-4 mb-8">{currentIngredient.name}</h3>

      <ul className={styles.nutrients}>
        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.calories}
          </span>
        </li>
        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.proteins}
          </span>
        </li>
        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.fat}
          </span>
        </li>
        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {currentIngredient.carbohydrates}
          </span>
        </li>
      </ul>
    </article>
  );
};
