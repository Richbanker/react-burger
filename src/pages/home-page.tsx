import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@utils/types';

type THomePageProps = {
  ingredients: TIngredient[];
};

export const HomePage = ({ ingredients }: THomePageProps): React.JSX.Element => {
  return (
    <main className="page_home">
      <h1 className="page_title text text_type_main-large mt-10 mb-5 pl-5">
        Соберите бургер
      </h1>
      <div className="page_main pl-5 pr-5">
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor />
      </div>
    </main>
  );
};
