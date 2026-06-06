import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const bun = ingredients.find((ingredient) => ingredient.type === 'bun');
  const burgerConstructorItems = ingredients
    .filter((ingredient) => ingredient.type !== 'bun')
    .slice(0, 6);

  const totalPrice =
    burgerConstructorItems.reduce((sum, ingredient) => sum + ingredient.price, 0) +
    (bun ? bun.price * 2 : 0);

  const handleOpenOrderModal = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return (
    <section className={`${styles.burger_constructor} pt-25`}>
      {bun && (
        <div className={`${styles.locked_item} pl-8 pr-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <ul className={`${styles.items} custom-scroll mt-4 mb-4`}>
        {burgerConstructorItems.map((ingredient) => (
          <li className={styles.item} key={ingredient._id}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>

      {bun && (
        <div className={`${styles.locked_item} pl-8 pr-4`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
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
          onClick={handleOpenOrderModal}
        >
          Оформить заказ
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
