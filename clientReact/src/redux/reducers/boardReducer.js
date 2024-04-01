import Board from "../../models/Board";


const initialState = {
    boardData:  [],
  };
  
  const boardReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_BOARD':
        return {
          ...state,
          boardData: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default boardReducer;