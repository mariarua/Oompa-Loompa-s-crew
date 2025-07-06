import { configureStore } from "@reduxjs/toolkit";
import oompaLoompaReducer from "./slices/oompaLoompaSlice";

export const store = configureStore({
  reducer: {
    oompaLoompas: oompaLoompaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
