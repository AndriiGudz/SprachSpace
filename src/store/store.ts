import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./redux/userSlice/userSlice";

// Объединяем слайсы (в данном случае только userSlice)
const rootReducer = combineSlices(userSlice);

// Тип корневого состояния
export type RootState = ReturnType<typeof rootReducer>;

// Получаем сохраненное состояние из localStorage (если оно есть)
// Здесь мы пытаемся прочитать строку из localStorage и преобразовать её в объект.
// Если ничего не сохранено, то используем пустой объект.
const persistedState: Partial<RootState> = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState")!)
  : {};

// Функция для создания store с возможным предзагруженным состоянием
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState, // передаем сохраненное состояние, если оно есть
  });
  return store;
};

// Создаем store, передавая persistedState в качестве preloadedState
export const store = makeStore(persistedState);

// Подписываемся на изменения состояния и сохраняем актуальное состояние в localStorage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
