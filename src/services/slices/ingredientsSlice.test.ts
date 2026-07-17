import { expect, test, describe } from '@jest/globals';
import ingredientReducer, { getIngredients } from './ingredientsSlice';

describe('тестирование несуществующего экшена', () => {
  test('должно возвращать начальное состояние', () => {
    const initialState = undefined;
    const newState = ingredientReducer(initialState, { type: 'UNKNOWN' });

    expect(newState).toEqual({
      error: null,
      ingredients: [],
      isIngredientsLoading: false
    });
  });
});

describe('тестирование ассинхронного экшена', () => {
  test('должен указывать корректный стейт при *.pending', () => {
    const initialState = {
      error: null,
      ingredients: [],
      isIngredientsLoading: false
    };
    const newState = ingredientReducer(
      initialState,
      getIngredients.pending('')
    );

    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.error).toBe(null);
  });
  test('должен указывать корректный стейт при *.reject', () => {
    const errorMessage = 'Ошибка загрузки данных';
    const initialState = {
      error: null,
      ingredients: [],
      isIngredientsLoading: true
    };
    const newState = ingredientReducer(initialState, {
      type: 'ingredients/getAll/rejected',
      error: new Error(errorMessage),
      payload: errorMessage
    });

    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.error).toEqual('Ошибка загрузки данных');
  });
  test('должен указывать корректный стейт при *.fulfilled', () => {
    const ingredients = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 42,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        __v: 0
      }
    ];
    const initialState = {
      error: null,
      ingredients: [],
      isIngredientsLoading: true
    };
    const newState = ingredientReducer(
      initialState,
      getIngredients.fulfilled(ingredients, '')
    );

    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.ingredients).toEqual(ingredients);
  });
});
