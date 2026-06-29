import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  forgotPassword,
  selectAuthError,
  selectAuthIsLoading,
} from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { PASSWORD_RESET_ALLOWED_KEY } from '@utils/constants';

import type { ChangeEvent, FormEvent } from 'react';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await dispatch(forgotPassword(email)).unwrap();
    sessionStorage.setItem(PASSWORD_RESET_ALLOWED_KEY, 'true');
    void navigate('/reset-password', { replace: true });
  };

  return (
    <main className="page_auth">
      <form className="page_form" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-3">Восстановление пароля</h1>
        <EmailInput
          required
          name="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Отправляем...' : 'Восстановить'}
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
