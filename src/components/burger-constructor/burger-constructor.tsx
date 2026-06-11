import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { DND_TYPES } from '@utils/constants';

import {
  addConstructorIngredient,
  removeConstructorIngredient,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
} from '../../services/burger-constructor/burger-constructor-slice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const constructorRef = useRef<HTMLElement>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const bun = useAppSelector(selectConstructorBun);
  const burgerConstructorItems = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);

  const [{ isOver }, dropTarget] = useDrop<TIngredient, void, { isOver: boolean }>(
    () => ({
      accept: DND_TYPES.ingredient,
      drop: (ingredient): void => {
        dispatch(addConstructorIngredient(ingredient));
      },
      collect: (monitor): { isOver: boolean } => ({
        isOver: monitor.isOver(),
      }),
    }),
    [dispatch]
  );

  dropTarget(constructorRef);

  const handleOpenOrderModal = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return (
    <section ref={constructorRef} className={`${styles.burger_constructor} pt-25`}>
      {bun ? (
        <div className={`${styles.locked_item} pl-8 pr-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${
            isOver ? styles.placeholder_active : ''
          } ml-8 mr-4`}
        >
          <p className="text text_type_main-default text_color_inactive">
            еретащите булку
          </p>
        </div>
      )}

      <ul className={`${styles.items} custom-scroll`}>
        {burgerConstructorItems.length > 0 ? (
          burgerConstructorItems.map((ingredient) => (
            <li className={styles.item} key={ingredient.constructorId}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
                handleClose={() =>
                  dispatch(removeConstructorIngredient(ingredient.constructorId))
                }
              />
            </li>
          ))
        ) : (
          <li
            className={`${styles.placeholder} ${
              isOver ? styles.placeholder_active : ''
            }`}
          >
            <p className="text text_type_main-default text_color_inactive">
              еретащите начинку или соус
            </p>
          </li>
        )}
      </ul>

      {bun ? (
        <div className={`${styles.locked_item} pl-8 pr-4`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${
            isOver ? styles.placeholder_active : ''
          } ml-8 mr-4`}
        >
          <p className="text text_type_main-default text_color_inactive">
            еретащите булку
          </p>
        </div>
      )}

      <div className={`${styles.order} mt-10 pr-4`}>
        <p className={`${styles.price} text text_type_digits-medium`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </p>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          disabled={!bun || burgerConstructorItems.length === 0}
          onClick={handleOpenOrderModal}
        >
          формить заказ
        </Button>
      </div>

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
