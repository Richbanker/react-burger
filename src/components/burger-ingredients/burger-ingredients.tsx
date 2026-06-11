import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import {
  clearCurrentIngredient,
  selectCurrentIngredient,
  setCurrentIngredient,
} from '../../services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TIngredientCardProps = {
  ingredient: TIngredient;
  onClick: (ingredient: TIngredient) => void;
};

type TIngredientType = 'bun' | 'sauce' | 'main';

const IngredientCard = ({
  ingredient,
  onClick,
}: TIngredientCardProps): React.JSX.Element => {
  const count = ingredient.type === 'bun' ? 2 : 1;

  return (
    <li className={styles.card}>
      <button
        className={styles.card_button}
        type="button"
        onClick={() => onClick(ingredient)}
      >
        <Counter count={count} size="default" extraClass={styles.counter} />
        <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
        <p className={`${styles.price} text text_type_digits-default mt-1 mb-1`}>
          {ingredient.price}
          <CurrencyIcon type="primary" />
        </p>
        <h3 className={`${styles.name} text text_type_main-default`}>
          {ingredient.name}
        </h3>
      </button>
    </li>
  );
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');

  const handleTabClick = (value: string): void => {
    setCurrentTab(value as TIngredientType);
  };

  const handleIngredientClick = (ingredient: TIngredient): void => {
    dispatch(setCurrentIngredient(ingredient));
  };

  const handleCloseModal = (): void => {
    dispatch(clearCurrentIngredient());
  };

  const renderIngredients = (items: TIngredient[]): React.JSX.Element[] =>
    items.map((ingredient) => (
      <IngredientCard
        key={ingredient._id}
        ingredient={ingredient}
        onClick={handleIngredientClick}
      />
    ));

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.tabs}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
          улки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
          ачинки
        </Tab>
      </nav>

      <section className={`${styles.ingredients_list} custom-scroll`}>
        <section>
          <h2 className="text text_type_main-medium mt-10 mb-6">улки</h2>
          <ul className={styles.grid}>{renderIngredients(buns)}</ul>
        </section>

        <section>
          <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>
          <ul className={styles.grid}>{renderIngredients(sauces)}</ul>
        </section>

        <section>
          <h2 className="text text_type_main-medium mt-10 mb-6">ачинки</h2>
          <ul className={styles.grid}>{renderIngredients(mains)}</ul>
        </section>
      </section>

      {selectedIngredient && (
        <Modal title="етали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
