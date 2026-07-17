import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addItem,
  removeItem,
  clearConstructor,
  moveUpItem,
  moveDownItem
} from './burgerConstructorSlice';

// let ingredients = [];
// beforeEach(() => {
//   ingredients = [
//     {
//       _id: '643d69a5c3f7b9001cfa093c',
//       name: 'Краторная булка N-200i',
//       type: 'bun',
//       proteins: 80,
//       fat: 24,
//       carbohydrates: 53,
//       calories: 420,
//       price: 1255,
//       image: 'https://code.s3.yandex.net/react/code/bun-02.png',
//       image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
//       image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
//       __v: 0
//     },
//     {
//       _id: '643d69a5c3f7b9001cfa0941',
//       name: 'Биокотлета из марсианской Магнолии',
//       type: 'main',
//       proteins: 42,
//       fat: 142,
//       carbohydrates: 242,
//       calories: 4242,
//       price: 424,
//       image: 'https://code.s3.yandex.net/react/code/meat-01.png',
//       image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
//       image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
//       __v: 0
//     },
//     {
//       _id: '643d69a5c3f7b9001cfa0942',
//       name: 'Соус Spicy-X',
//       type: 'sauce',
//       proteins: 30,
//       fat: 20,
//       carbohydrates: 40,
//       calories: 30,
//       price: 90,
//       image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
//       image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
//       image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
//       __v: 0
//     }
//   ];
// });

const main = {
  id: '1',
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 42,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const sauce = {
  id: '2',
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const bun = {
  id: '3',
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

describe('тестирование несуществующего экшена', () => {
  test('должно возвращать начальное состояние', () => {
    const initialState = undefined;
    const newState = constructorReducer(initialState, { type: 'UNKNOWN' });

    expect(newState).toEqual({
      bun: null,
      ingredients: []
    });
  });
});

describe('тестирование простого экшена', () => {
  test('addItem(main) должен добавлять новый элемент в список ingredients ', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const newState = constructorReducer(initialState, addItem(main));

    expect(newState.ingredients.length).toBe(1);
    expect(newState.bun).toBe(null);
  });

  test('addItem(sauce) должен добавлять новый элемент в список ingredients ', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const newState = constructorReducer(initialState, addItem(sauce));

    expect(newState.ingredients.length).toBe(1);
    expect(newState.bun).toBe(null);
  });

  test('addItem(bun) должен добавлять новый элемент в bun ', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const newState = constructorReducer(initialState, addItem(bun));

    expect(newState.ingredients.length).toBe(0);
    expect(newState.bun).not.toEqual(null);
    expect(newState.bun?.id).toEqual('3');
  });

  test('removeItem должен удалять элемент из списка ingredients ', () => {
    const initialState = {
      bun: null,
      ingredients: [main]
    };
    const newState = constructorReducer(initialState, removeItem(main));

    expect(newState.ingredients.length).toBe(0);
    expect(newState.bun).toEqual(null);
  });

  test('removeItem не должен удалять элемент из списка ingredients при неккоректном параметре', () => {
    const initialState = {
      bun: null,
      ingredients: [main]
    };
    const newState = constructorReducer(initialState, removeItem(sauce));

    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0].id).toBe('1');
    expect(newState.bun).toEqual(null);
  });

  test('moveUpItem должен перемещать элемент вверх по списку', () => {
    const initialState = {
      bun: null,
      ingredients: [main, { ...main, id: '4' }, sauce]
    };
    const newState = constructorReducer(initialState, moveUpItem(1));

    expect(newState.ingredients.length).toBe(3);
    expect(newState.ingredients[0].id).toBe('4');
    expect(newState.ingredients[1].id).toBe('1');
    expect(newState.ingredients[2].id).toBe('2');
    expect(newState.bun).toEqual(null);
  });

  test('moveUpItem не должен перемещать элемент вверх по списку при индексе 0', () => {
    const initialState = {
      bun: null,
      ingredients: [main, { ...main, id: '4' }, sauce]
    };
    const newState = constructorReducer(initialState, moveUpItem(0));

    expect(newState.ingredients.length).toBe(3);
    expect(newState.ingredients[0].id).toBe('1');
    expect(newState.ingredients[1].id).toBe('4');
    expect(newState.ingredients[2].id).toBe('2');
    expect(newState.bun).toEqual(null);
  });

  test('moveDownItem должен перемещать элемент вниз по списку', () => {
    const initialState = {
      bun: null,
      ingredients: [main, { ...main, id: '4' }, sauce]
    };
    const newState = constructorReducer(initialState, moveDownItem(1));

    expect(newState.ingredients.length).toBe(3);
    expect(newState.ingredients[0].id).toBe('1');
    expect(newState.ingredients[1].id).toBe('2');
    expect(newState.ingredients[2].id).toBe('4');
    expect(newState.bun).toEqual(null);
  });

  test('moveDownItem не должен перемещать элемент вниз по списку при индексе > length', () => {
    const initialState = {
      bun: null,
      ingredients: [main, { ...main, id: '4' }, sauce]
    };
    const newState = constructorReducer(initialState, moveDownItem(2));

    expect(newState.ingredients.length).toBe(3);
    expect(newState.ingredients[0].id).toBe('1');
    expect(newState.ingredients[1].id).toBe('4');
    expect(newState.ingredients[2].id).toBe('2');
    expect(newState.bun).toEqual(null);
  });

  test('clearConstructor должен очищать стейт', () => {
    const initialState = {
      bun: bun,
      ingredients: [main, { ...main, id: '4' }, sauce]
    };

    const newState = constructorReducer(initialState, clearConstructor());

    expect(newState.ingredients.length).toBe(0);
    expect(newState.bun).toEqual(null);
  });
});
