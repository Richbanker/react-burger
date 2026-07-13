import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

export const IngredientPage = (): React.JSX.Element => {
  return (
    <main className="page_full">
      <h1 className="text text_type_main-large mb-6">Детали ингредиента</h1>
      <IngredientDetails />
    </main>
  );
};
