const { GET_SECRET } = require('../actions/types');

const initState = {
  secret: ''
};

export const dashboardReducer = (state = initState, action) => {
  switch(action.type) {
    case GET_SECRET:
      return { ...state, secret: action.secret };
    default: 
      return state
  }
};