import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage'
import authReducer from './AuthSlice';

const persistConfig = {
  key: 'root',
  storage,
  // transforms: [
  //     encryptTransform({
  //       secretKey: 'my-super-secret-key-123!@#',
  //       onError: function (error) {
  //         // Handle the error.
  //       },
  //     }),
  // ],
}

const persistedReducer = persistReducer(persistConfig, authReducer)

let store = configureStore({ reducer: { authReducer: persistedReducer } })
let persistor = persistStore(store)

export default store
export { persistor }
