const { SIGN_UP, SIGN_ERROR } = require('../actions/types');

const initState = {
  token: "",
  isAuthed: false,
  errorMsg: ""
}

export const userReducer = (state = initState, action) => {
  switch(action.type) {
    case SIGN_UP:
      return { ...state, token : action.token, isAuthed: true, errorMsg: ""}
    case SIGN_ERROR:
      return { ...state, token: "", isAuthed: false, errorMsg: action.errorMsg}
    default:
      return state
  }
}