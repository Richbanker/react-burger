import { Link } from 'react-router-dom';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className="page_full">
      <h1 className="text text_type_digits-large mb-6">404</h1>
      <p className="text text_type_main-medium mb-6">Страница не найдена</p>
      <Link className="page_link text text_type_main-default" to="/">
        Вернуться к конструктору
      </Link>
    </main>
  );
};
