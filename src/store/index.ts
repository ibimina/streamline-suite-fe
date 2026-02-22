import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { baseApi } from './api'
import authSlice from './slices/auth/index'
import dashboardSlice from './slices/dashboard/index'
import uiSlice from './slices/uiSlice'
import companySlice from './slices/companySlice'
import customerSlice from './slices/customer/index'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: [
    'authReducer',
    'cartReducer',
    'utilReducer',
    'bookingReducer',
    'profileReducer',
    'dashboardReducer',
    'customerReducer',
  ],
  // Don't persist RTK Query cache - it handles its own caching
  blacklist: [baseApi.reducerPath],
}

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  authReducer: authSlice,
  dashboardReducer: dashboardSlice,
  customerReducer: customerSlice,
  ui: uiSlice,
  company: companySlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
