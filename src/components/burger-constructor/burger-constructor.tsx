import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectBurgerItems } from '../../services/slices/burgerConstructorSlice';
import {
  closeOrderModalData,
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/ordersSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const constructorItems = useSelector(selectBurgerItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientsList: string[] = constructorItems.ingredients.reduce(
      (acc: string[], item) => {
        acc.push(item._id);
        return acc;
      },
      []
    );
    dispatch(
      createOrder([
        constructorItems.bun._id,
        ...ingredientsList,
        constructorItems.bun._id
      ])
    );
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
