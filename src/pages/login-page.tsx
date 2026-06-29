import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  loginUser,
  selectAuthError,
  selectAuthIsLoading,
} from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { ChangeEvent, FormEvent } from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: Location;
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange =
    (field: 'email' | 'password') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await dispatch(loginUser(form)).unwrap();

    const state = location.state as TLocationState | null;

    void navigate(state?.from?.pathname ?? '/', { replace: true });
  };

  return (
    <main className="page_auth">
      <form className="page_form" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-3">Вход</h1>
        <EmailInput
          required
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange('email')}
        />
        <PasswordInput
          required
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange('password')}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>
      </form>

      <p className="page_message text text_type_main-default mt-6">{error ?? ''}</p>

      <div className="page_links mt-15">
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link className="page_link" to="/register">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link className="page_link" to="/forgot-password">
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
};
