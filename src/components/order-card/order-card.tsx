import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import {
  formatOrderDate,
  getOrderIngredients,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/order';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-card.module.css';

const MAX_VISIBLE_INGREDIENTS = 6;

type TOrderCardProps = {
  order: TOrder;
  ingredients: TIngredient[];
  showStatus?: boolean;
  onClick: (order: TOrder) => void;
};

export const OrderCard = ({
  order,
  ingredients,
  showStatus = false,
  onClick,
}: TOrderCardProps): React.JSX.Element => {
  const orderIngredients = getOrderIngredients(order.ingredients, ingredients);
  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = orderIngredients.length - visibleIngredients.length;
  const totalPrice = getOrderPrice(order.ingredients, ingredients);

  return (
    <li>
      <button className={styles.card} type="button" onClick={() => onClick(order)}>
        <span className={styles.meta}>
          <span className="text text_type_digits-default">#{order.number}</span>
          <span className="text text_type_main-default text_color_inactive">
            {formatOrderDate(order.createdAt)}
          </span>
        </span>

        <span className={`${styles.name} text text_type_main-medium mt-6`}>
          {order.name}
        </span>

        {showStatus && (
          <span
            className={`${styles.status} ${
              order.status === 'done' ? styles.status_done : ''
            } text text_type_main-default mt-2`}
          >
            {getOrderStatusText(order.status)}
          </span>
        )}

        <span className={`${styles.summary} mt-6`}>
          <span className={styles.ingredients}>
            {visibleIngredients.map((ingredient, index) => {
              const isLast = index === visibleIngredients.length - 1;

              return (
                <span
                  className={styles.ingredient}
                  key={`${ingredient._id}-${index}`}
                  style={{ zIndex: MAX_VISIBLE_INGREDIENTS - index }}
                >
                  <img src={ingredient.image_mobile} alt={ingredient.name} />
                  {isLast && hiddenCount > 0 && (
                    <span
                      className={`${styles.more} text text_type_main-default`}
                    >{`+${hiddenCount}`}</span>
                  )}
                </span>
              );
            })}
          </span>

          <span className={`${styles.price} text text_type_digits-default`}>
            {totalPrice}
            <CurrencyIcon type="primary" />
          </span>
        </span>
      </button>
    </li>
  );
};
