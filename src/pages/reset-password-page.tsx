import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { resetPassword } from '@services/auth/auth-actions';
import { selectAuthError, selectAuthIsLoading } from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { PASSWORD_RESET_ALLOWED_KEY } from '@utils/constants';

import type { ChangeEvent, FormEvent } from 'react';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const [form, setForm] = useState({ password: '', token: '' });

  if (sessionStorage.getItem(PASSWORD_RESET_ALLOWED_KEY) !== 'true') {
    return <Navigate replace to="/forgot-password" />;
  }

  const handleChange =
    (field: 'password' | 'token') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await dispatch(resetPassword(form)).unwrap();
    sessionStorage.removeItem(PASSWORD_RESET_ALLOWED_KEY);
    void navigate('/login', { replace: true });
  };

  return (
    <main className="page_auth">
      <form className="page_form" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-3">Восстановление пароля</h1>
        <PasswordInput
          required
          name="password"
          placeholder="Введите новый пароль"
          value={form.password}
          onChange={handleChange('password')}
        />
        <Input
          required
          name="token"
          placeholder="Введите код из письма"
          type="text"
          value={form.token}
          onChange={handleChange('token')}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>

      <p className="page_message text text_type_main-default mt-6">{error ?? ''}</p>

      <p className="text text_type_main-default text_color_inactive mt-20">
        Вспомнили пароль?{' '}
        <Link className="page_link" to="/login">
          Войти
        </Link>
      </p>
    </main>
  );
};
