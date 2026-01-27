import { createStore, applyMiddleware } from "redux";
// import thunk from 'redux-thunk';
import rootReducer from "./root-reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const middlewares = [];

const bindMiddleware = (middleware) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   const { composeWithDevTools } = require('redux-devtools-extension');
  //   return composeWithDevTools(applyMiddleware(...middleware));
  // }
  return applyMiddleware(...middleware);
};

const persistConfig = {
  key: "outletPersistor",
  storage: storage,
  whitelist: [
    "Auth",
    "autoAssignReducer",
    "Profile",
    "MapReducer",
    "ThemeSwitcher",
    "LanguageSwitcher",
    
    
   
    "Properties",
  ], // which reducer want to store
};
const pReducer = persistReducer(persistConfig, rootReducer as any);

const store = createStore(pReducer, bindMiddleware(middlewares));
const outletPersistor = persistStore(store);

export { store, outletPersistor };
