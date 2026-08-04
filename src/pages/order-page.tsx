import { OrderInfo } from '@components/order-info/order-info';

import styles from './order-page.module.css';

type TOrderPageProps = {
  source: 'feed' | 'profile';
};

export const OrderPage = ({ source }: TOrderPageProps): React.JSX.Element => (
  <main className={styles.page}>
    <OrderInfo source={source} />
  </main>
);
