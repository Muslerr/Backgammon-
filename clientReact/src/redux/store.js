// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import boardReducer from './reducers/boardReducer';

const rootReducer = combineReducers({
  board: boardReducer,
  
});

const store = createStore(rootReducer);

export default store;
