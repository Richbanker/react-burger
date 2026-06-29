import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  registerUser,
  selectAuthError,
  selectAuthIsLoading,
} from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { ChangeEvent, FormEvent } from 'react';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange =
    (field: 'name' | 'email' | 'password') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await dispatch(registerUser(form)).unwrap();
    void navigate('/', { replace: true });
  };

  return (
    <main className="page_auth">
      <form className="page_form" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="text text_type_main-medium mb-3">Регистрация</h1>
        <Input
          required
          name="name"
          placeholder="Имя"
          type="text"
          value={form.name}
          onChange={handleChange('name')}
        />
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
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <p className="page_message text text_type_main-default mt-6">{error ?? ''}</p>

      <p className="text text_type_main-default text_color_inactive mt-20">
        Уже зарегистрированы?{' '}
        <Link className="page_link" to="/login">
          Войти
        </Link>
      </p>
    </main>
  );
};
