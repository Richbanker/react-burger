import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logoutUser } from '@services/auth/auth-actions';
import { useAppDispatch } from '@services/hooks';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      void navigate('/login', { replace: true });
    }
  };

  return (
    <main className="page_profile">
      <aside>
        <nav className="page_profile_nav">
          <NavLink
            end
            className={({ isActive }) =>
              `page_profile_link ${
                isActive ? 'page_profile_active' : ''
              } text text_type_main-medium`
            }
            to="/profile"
          >
            Профиль
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `page_profile_link ${
                isActive ? 'page_profile_active' : ''
              } text text_type_main-medium`
            }
            to="/profile/orders"
          >
            История заказов
          </NavLink>
          <button
            className="page_profile_button text text_type_main-medium"
            type="button"
            onClick={() => void handleLogout()}
          >
            Выход
          </button>
        </nav>

        <p className="page_profile_hint text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <Outlet />
    </main>
  );
};
