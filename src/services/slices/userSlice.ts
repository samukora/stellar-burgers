import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean; //флаг для проверки авторизации
  isLoading: boolean; // флаг для прелоадера
  isAuthenticated: boolean; // статус авторизации пользователя
  user: TUser | null; // данные пользователя
  error: string | null; //ошибки
};

const initialState: TUserState = {
  isAuthChecked: false,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null
};

type TTokens = {
  accessToken: string;
  refreshToken: string;
};

const saveTokens = ({ accessToken, refreshToken }: TTokens) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const userRegistration = createAsyncThunk(
  'user/registration',
  async (registerData: TRegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerUserApi(registerData);
      saveTokens(response);

      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка регистрации пользователя');
    }
  }
);

export const userLogin = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      saveTokens(response);

      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка авторизации пользователя');
    }
  }
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await logoutApi();
      removeTokens();

      return response.success;
    } catch (err) {
      return rejectWithValue('Ошибка выхода из учетной записи');
    }
  }
);

export const userGetInfo = createAsyncThunk(
  'user/getInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();

      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка получения данных пользователя');
    }
  }
);

export const userUpdateInfo = createAsyncThunk(
  'user/updateInfo',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);

      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка обновления данных пользователя');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUserInfo: (state) => state.user,
    selectError: (state) => state.error,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsLoading: (state) => state.isLoading,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserName: (state) => state.user?.name
  },
  extraReducers: (builder) => {
    builder
      // userRegistration
      .addCase(userRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      //userLogin
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      //userLogout
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      //userGetInfo
      .addCase(userGetInfo.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(userGetInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(userGetInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      //userUpdateInfo
      .addCase(userUpdateInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userUpdateInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(userUpdateInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      });
  }
});

export default userSlice.reducer;
export const {
  selectUserInfo,
  selectError,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectIsLoading,
  selectUserName
} = userSlice.selectors;
