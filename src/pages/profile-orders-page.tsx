import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersIsConnecting,
} from '@services/profile-orders/profile-orders-slice';

import type { TOrder } from '@utils/types';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useAppSelector(selectProfileOrders);
  const isConnecting = useAppSelector(selectProfileOrdersIsConnecting);
  const error = useAppSelector(selectProfileOrdersError);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    dispatch(connectProfileOrders());

    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  const handleOrderClick = (order: TOrder): void => {
    void navigate(`/profile/orders/${order._id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <section className={styles.page}>
      {isConnecting && orders.length === 0 ? (
        <div className={styles.loading}>
          <Preloader />
        </div>
      ) : (
        <ul className={`${styles.orders} custom-scroll`}>
          {[...orders].reverse().map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredients={ingredients}
              showStatus
              onClick={handleOrderClick}
            />
          ))}
        </ul>
      )}

      {error && (
        <p className="text text_type_main-default text_color_inactive mt-6">{error}</p>
      )}
    </section>
  );
};
