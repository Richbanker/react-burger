import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import {
  connectFeed,
  disconnectFeed,
  selectFeedIsConnected,
  selectFeedOrders,
} from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  selectProfileOrders,
  selectProfileOrdersIsConnected,
} from '@services/profile-orders/profile-orders-slice';
import { formatOrderDate, getOrderIngredients, getOrderStatusText } from '@utils/order';

import type { TIngredient } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  source: 'feed' | 'profile';
};

type TIngredientWithCount = {
  ingredient: TIngredient;
  count: number;
};

export const OrderInfo = ({ source }: TOrderInfoProps): React.JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);
  const isFeedConnected = useAppSelector(selectFeedIsConnected);
  const isProfileConnected = useAppSelector(selectProfileOrdersIsConnected);
  const orders = source === 'feed' ? feedOrders : profileOrders;
  const isConnected = source === 'feed' ? isFeedConnected : isProfileConnected;
  const ownsConnection = useRef(!isConnected);
  const order = orders.find((item) => item._id === id || String(item.number) === id);

  useEffect(() => {
    if (!ownsConnection.current) {
      return;
    }

    dispatch(source === 'feed' ? connectFeed() : connectProfileOrders());

    return (): void => {
      dispatch(source === 'feed' ? disconnectFeed() : disconnectProfileOrders());
    };
  }, [dispatch, source]);

  if (!order) {
    return (
      <div className={styles.loading}>
        <Preloader />
      </div>
    );
  }

  const groupedIngredients = getOrderIngredients(order.ingredients, ingredients).reduce<
    Map<string, TIngredientWithCount>
  >((result, ingredient) => {
    const existing = result.get(ingredient._id);

    result.set(ingredient._id, {
      ingredient,
      count: (existing?.count ?? 0) + 1,
    });

    return result;
  }, new Map());

  const ingredientRows = Array.from(groupedIngredients.values());
  const totalPrice = ingredientRows.reduce(
    (total, item) => total + item.ingredient.price * item.count,
    0
  );

  return (
    <article className={styles.content}>
      <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>
      <h1 className="text text_type_main-medium mt-10">{order.name}</h1>
      <p
        className={`${styles.status} ${
          order.status === 'done' ? styles.status_done : ''
        } text text_type_main-default mt-3`}
      >
        {getOrderStatusText(order.status)}
      </p>
      <h2 className="text text_type_main-medium mt-15 mb-6">Состав:</h2>

      <ul className={`${styles.ingredients} custom-scroll`}>
        {ingredientRows.map(({ ingredient, count }) => (
          <li className={styles.ingredient} key={ingredient._id}>
            <span className={styles.image}>
              <img src={ingredient.image_mobile} alt={ingredient.name} />
            </span>
            <span className={`${styles.ingredient_name} text text_type_main-default`}>
              {ingredient.name}
            </span>
            <span className={`${styles.price} text text_type_digits-default`}>
              {count} x {ingredient.price}
              <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>

      <footer className={`${styles.footer} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
        <span className={`${styles.price} text text_type_digits-default`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </span>
      </footer>
    </article>
  );
};
