import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import {
  selectAuthError,
  selectAuthIsLoading,
  selectUser,
  updateUser,
} from '@services/auth/auth-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { ChangeEvent, FormEvent } from 'react';

export const ProfileFormPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthIsLoading);
  const error = useAppSelector(selectAuthError);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user]);

  const hasChanges = useMemo(
    () =>
      form.name !== (user?.name ?? '') ||
      form.email !== (user?.email ?? '') ||
      form.password.length > 0,
    [form, user]
  );

  const handleChange =
    (field: 'name' | 'email' | 'password') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleReset = (): void => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const data = {
      email: form.email,
      name: form.name,
      ...(form.password ? { password: form.password } : {}),
    };

    await dispatch(updateUser(data)).unwrap();
    setForm((currentForm) => ({
      ...currentForm,
      password: '',
    }));
  };

  return (
    <section className="page_profile_form">
      <form className="page_form" onSubmit={(event) => void handleSubmit(event)}>
        <Input
          required
          icon="EditIcon"
          name="name"
          placeholder="Имя"
          type="text"
          value={form.name}
          onChange={handleChange('name')}
        />
        <EmailInput
          required
          isIcon
          name="email"
          placeholder="Логин"
          value={form.email}
          onChange={handleChange('email')}
        />
        <PasswordInput
          icon="EditIcon"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange('password')}
        />

        {hasChanges && (
          <div className="page_actions">
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={handleReset}
            >
              Отмена
            </Button>
            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
              {isLoading ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </div>
        )}
      </form>

      <p className="page_message text text_type_main-default mt-6">{error ?? ''}</p>
    </section>
  );
};
