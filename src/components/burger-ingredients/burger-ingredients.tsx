import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useInView } from 'react-intersection-observer';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { DND_TYPES } from '@utils/constants';

import { selectConstructorIngredientCounts } from '../../services/burger-constructor/burger-constructor-slice';
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
  count: number;
  onClick: (ingredient: TIngredient) => void;
};

type TIngredientType = 'bun' | 'sauce' | 'main';

const inViewOptions = {
  rootMargin: '-80px 0px -70% 0px',
  threshold: 0,
};

const IngredientCard = ({
  ingredient,
  count,
  onClick,
}: TIngredientCardProps): React.JSX.Element => {
  const cardRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<TIngredient, void, { isDragging: boolean }>(
    () => ({
      type: DND_TYPES.ingredient,
      item: ingredient,
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  dragRef(cardRef);

  return (
    <li
      ref={cardRef}
      className={`${styles.card} ${isDragging ? styles.card_dragging : ''}`}
    >
      <button
        className={styles.card_button}
        type="button"
        onClick={() => onClick(ingredient)}
      >
        {count > 0 && (
          <Counter count={count} size="default" extraClass={styles.counter} />
        )}
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
  const ingredientCounts = useAppSelector(selectConstructorIngredientCounts);
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const sectionRefs = useRef<Record<TIngredientType, HTMLElement | null>>({
    bun: null,
    sauce: null,
    main: null,
  });

  const { ref: bunsInViewRef, inView: isBunsInView } = useInView(inViewOptions);
  const { ref: saucesInViewRef, inView: isSaucesInView } = useInView(inViewOptions);
  const { ref: mainsInViewRef, inView: isMainsInView } = useInView(inViewOptions);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');

  useEffect(() => {
    if (isMainsInView) {
      setCurrentTab('main');
      return;
    }

    if (isSaucesInView) {
      setCurrentTab('sauce');
      return;
    }

    if (isBunsInView) {
      setCurrentTab('bun');
    }
  }, [isBunsInView, isMainsInView, isSaucesInView]);

  const setBunsRefs = useCallback(
    (node: HTMLElement | null): void => {
      sectionRefs.current.bun = node;
      bunsInViewRef(node);
    },
    [bunsInViewRef]
  );

  const setSaucesRefs = useCallback(
    (node: HTMLElement | null): void => {
      sectionRefs.current.sauce = node;
      saucesInViewRef(node);
    },
    [saucesInViewRef]
  );

  const setMainsRefs = useCallback(
    (node: HTMLElement | null): void => {
      sectionRefs.current.main = node;
      mainsInViewRef(node);
    },
    [mainsInViewRef]
  );

  const handleTabClick = (value: string): void => {
    const ingredientType = value as TIngredientType;

    setCurrentTab(ingredientType);
    sectionRefs.current[ingredientType]?.scrollIntoView({ behavior: 'smooth' });
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
        count={ingredientCounts[ingredient._id] ?? 0}
        onClick={handleIngredientClick}
      />
    ));

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.tabs}>
        <div>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
        </div>
        <div>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
        </div>
        <div>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </div>
      </nav>

      <section className={`${styles.ingredients_list} custom-scroll`}>
        <section ref={setBunsRefs}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>
          <ul className={styles.grid}>{renderIngredients(buns)}</ul>
        </section>

        <section ref={setSaucesRefs}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>
          <ul className={styles.grid}>{renderIngredients(sauces)}</ul>
        </section>

        <section ref={setMainsRefs}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>
          <ul className={styles.grid}>{renderIngredients(mains)}</ul>
        </section>
      </section>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
