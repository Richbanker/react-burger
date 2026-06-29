import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page';
import { HomePage } from '@pages/home-page';
import { IngredientPage } from '@pages/ingredient-page';
import { LoginPage } from '@pages/login-page';
import { NotFoundPage } from '@pages/not-found-page';
import { ProfileFormPage } from '@pages/profile-form-page';
import { ProfileOrdersPage } from '@pages/profile-orders-page';
import { ProfilePage } from '@pages/profile-page';
import { RegisterPage } from '@pages/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page';
import { checkUserAuth } from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients/ingredients-actions';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const state = location.state as TLocationState | null;
  const backgroundLocation = state?.backgroundLocation;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseIngredientModal = (): void => {
    void navigate(-1);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className="text text_type_main-medium mt-10">
          Произошла ошибка при загрузке ингредиентов
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<HomePage ingredients={ingredients} />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileFormPage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
