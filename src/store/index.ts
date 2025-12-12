import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authSlice from './slices/auth/index'
import dashboardSlice from './slices/dashboard/index'
import uiSlice from './slices/uiSlice'
import companySlice from './slices/companySlice'
import invoiceSlice from './slices/invoiceSlice'
import quotationSlice from './slices/quotationSlice'
import inventorySlice from './slices/inventorySlice'

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
  ],
}

const rootReducer = combineReducers({
  authReducer: authSlice,
  dashboardReducer: dashboardSlice,
  ui: uiSlice,
  company: companySlice,
  invoice: invoiceSlice,
  quotation: quotationSlice,
  inventory: inventorySlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
