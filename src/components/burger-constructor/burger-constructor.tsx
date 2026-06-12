import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { DND_TYPES } from '@utils/constants';

import {
  addConstructorIngredient,
  clearConstructor,
  moveConstructorIngredient,
  removeConstructorIngredient,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
  type TConstructorIngredient,
} from '../../services/burger-constructor/burger-constructor-slice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  clearOrder,
  createOrder,
  selectOrderError,
  selectOrderIsLoading,
  selectOrderNumber,
} from '../../services/order/order-slice';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TConstructorDragItem = {
  constructorId: string;
  index: number;
};

type TConstructorIngredientItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
  moveIngredient: (fromIndex: number, toIndex: number) => void;
  onRemove: (constructorId: string) => void;
};

const ConstructorIngredientItem = ({
  ingredient,
  index,
  moveIngredient,
  onRemove,
}: TConstructorIngredientItemProps): React.JSX.Element => {
  const itemRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<
    TConstructorDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DND_TYPES.constructorIngredient,
      item: { constructorId: ingredient.constructorId, index },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient.constructorId, index]
  );

  const [, dropRef] = useDrop<TConstructorDragItem>(
    () => ({
      accept: DND_TYPES.constructorIngredient,
      drop: (item): void => {
        const dragIndex = item.index;
        const dropIndex = index;

        if (dragIndex === dropIndex) {
          return;
        }

        moveIngredient(dragIndex, dropIndex);
        item.index = dropIndex;
      },
    }),
    [index, moveIngredient]
  );

  dragRef(dropRef(itemRef));

  return (
    <li
      ref={itemRef}
      className={`${styles.item} ${isDragging ? styles.item_dragging : ''}`}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.constructorId)}
      />
    </li>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const constructorRef = useRef<HTMLElement>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const bun = useAppSelector(selectConstructorBun);
  const burgerConstructorItems = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);
  const orderNumber = useAppSelector(selectOrderNumber);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const orderError = useAppSelector(selectOrderError);

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

  const handleCreateOrder = async (): Promise<void> => {
    if (!bun) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...burgerConstructorItems.map((ingredient) => ingredient._id),
      bun._id,
    ];

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
      dispatch(clearConstructor());
      setIsOrderModalOpen(true);
    } catch {
      setIsOrderModalOpen(false);
    }
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
    dispatch(clearOrder());
  };

  const handleMoveIngredient = (fromIndex: number, toIndex: number): void => {
    dispatch(moveConstructorIngredient({ fromIndex, toIndex }));
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
            Перетащите булку
          </p>
        </div>
      )}

      <ul className={`${styles.items} custom-scroll`}>
        {burgerConstructorItems.length > 0 ? (
          burgerConstructorItems.map((ingredient, index) => (
            <ConstructorIngredientItem
              key={ingredient.constructorId}
              ingredient={ingredient}
              index={index}
              moveIngredient={handleMoveIngredient}
              onRemove={(constructorId) =>
                dispatch(removeConstructorIngredient(constructorId))
              }
            />
          ))
        ) : (
          <li
            className={`${styles.placeholder} ${
              isOver ? styles.placeholder_active : ''
            }`}
          >
            <p className="text text_type_main-default text_color_inactive">
              Перетащите начинку или соус
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
            Перетащите булку
          </p>
        </div>
      )}

      <div className={`${styles.order} mt-10 pr-4`}>
        <p className={`${styles.price} text text_type_digits-medium`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </p>

        <div>
          <Button
            htmlType="button"
            type="primary"
            size="large"
            disabled={!bun || burgerConstructorItems.length === 0 || isOrderLoading}
            onClick={() => {
              void handleCreateOrder();
            }}
          >
            {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
          </Button>
        </div>
      </div>

      {orderError && (
        <p className="text text_type_main-default text_color_inactive mt-4 pr-4">
          {orderError}
        </p>
      )}

      {isOrderModalOpen && orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};
