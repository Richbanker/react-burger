import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import {
  connectFeed,
  disconnectFeed,
  selectFeedError,
  selectFeedIsConnecting,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

import type { TOrder } from '@utils/types';

import styles from './feed-page.module.css';

const MAX_STATUS_ORDERS = 20;

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const isConnecting = useAppSelector(selectFeedIsConnecting);
  const error = useAppSelector(selectFeedError);
  const ingredients = useAppSelector(selectIngredients);
  const doneOrders = orders
    .filter((order) => order.status === 'done')
    .slice(0, MAX_STATUS_ORDERS);
  const pendingOrders = orders
    .filter((order) => order.status !== 'done')
    .slice(0, MAX_STATUS_ORDERS);

  useEffect(() => {
    dispatch(connectFeed());

    return (): void => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  const handleOrderClick = (order: TOrder): void => {
    void navigate(`/feed/${order._id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>

      {isConnecting && orders.length === 0 ? (
        <div className={styles.loading}>
          <Preloader />
        </div>
      ) : (
        <div className={styles.content}>
          <ul className={`${styles.orders} custom-scroll`}>
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                ingredients={ingredients}
                onClick={handleOrderClick}
              />
            ))}
          </ul>

          <section className={styles.statistics}>
            <div className={styles.statuses}>
              <div>
                <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
                <ol className={`${styles.numbers} ${styles.numbers_done}`}>
                  {doneOrders.map((order) => (
                    <li className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h2 className="text text_type_main-medium mb-6">В работе:</h2>
                <ol className={styles.numbers}>
                  {pendingOrders.map((order) => (
                    <li className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <h2 className="text text_type_main-medium mt-15">Выполнено за всё время:</h2>
            <p className={`${styles.total} text text_type_digits-large`}>{total}</p>

            <h2 className="text text_type_main-medium mt-15">Выполнено за сегодня:</h2>
            <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
          </section>
        </div>
      )}

      {error && (
        <p className="text text_type_main-default text_color_inactive mt-6">{error}</p>
      )}
    </main>
  );
};
