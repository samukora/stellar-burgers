import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient } from '@utils-types';

type TBurgerConstructor = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructor = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    selectBurgerItems: (store) => ({
      bun: store.bun,
      ingredients: store.ingredients
    })
  },
  reducers: {
    addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = null;
      } else {
        state.ingredients = state.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
      }
    },
    moveUpItem: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      if (currentIndex === 0) return;
      const currentIngredient = state.ingredients[currentIndex];
      state.ingredients[currentIndex] = state.ingredients[currentIndex - 1];
      state.ingredients[currentIndex - 1] = currentIngredient;
    },
    moveDownItem: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      if (currentIndex === state.ingredients.length - 1) return;
      const currentIngredient = state.ingredients[currentIndex];
      state.ingredients[currentIndex] = state.ingredients[currentIndex + 1];
      state.ingredients[currentIndex + 1] = currentIngredient;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export default burgerConstructorSlice.reducer;

export const { selectBurgerItems } = burgerConstructorSlice.selectors;
export const {
  addItem,
  removeItem,
  clearConstructor,
  moveUpItem,
  moveDownItem
} = burgerConstructorSlice.actions;
