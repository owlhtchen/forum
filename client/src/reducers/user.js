const { SIGN_UP, SIGN_ERROR, SIGN_OUT, SIGN_IN } = require('../actions/types');

const initState = {
  userID: "",
  token: "",
  isAuthed: false,
  isAdmin: false,
  errorMsg: ""
}

export const userReducer = (state = initState, action) => {
  switch(action.type) {
    case SIGN_UP:
      return { ...state, token : action.token, isAuthed: true, errorMsg: "", userID: action.userID,
            isAdmin: action.isAdmin }
    case SIGN_ERROR:
      return { ...state, token: "", isAuthed: false, errorMsg: action.errorMsg, userID: "",
            isAdmin: false }
    case SIGN_OUT:
      return { ...state, token: "", isAuthed: false, errorMsg: "", userID: "", isAdmin: false }
    case SIGN_IN:
      return { ...state, token: action.token, isAuthed: true, errorMsg: "", userID: action.userID,
            isAdmin: action.isAdmin  }
    default:
      return state
  }
}