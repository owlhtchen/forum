const { SIGN_UP, SIGN_ERROR, SIGN_OUT } = require('../actions/types');

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
    case SIGN_OUT:
      return { ...state, token: "", isAuthed: false, errorMsg: "" }
    default:
      return state
  }
}