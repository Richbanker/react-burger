/* eslint-disable css-modules/no-unused-class */
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logoutUser } from '@services/auth/auth-slice';
import { useAppDispatch } from '@services/hooks';

import styles from './pages.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await dispatch(logoutUser()).unwrap();
    void navigate('/login', { replace: true });
  };

  return (
    <main className={styles.profile}>
      <aside>
        <nav className={styles.profile_nav}>
          <NavLink
            end
            className={({ isActive }) =>
              `${styles.profile_link} ${
                isActive ? styles.profile_link_active : ''
              } text text_type_main-medium`
            }
            to="/profile"
          >
            Профиль
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${styles.profile_link} ${
                isActive ? styles.profile_link_active : ''
              } text text_type_main-medium`
            }
            to="/profile/orders"
          >
            История заказов
          </NavLink>
          <button
            className={`${styles.profile_button} text text_type_main-medium`}
            type="button"
            onClick={() => void handleLogout()}
          >
            Выход
          </button>
        </nav>

        <p
          className={`${styles.profile_hint} text text_type_main-default text_color_inactive mt-20`}
        >
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <Outlet />
    </main>
  );
};
