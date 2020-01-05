//  mapDispatchToProps() receives the dispatch() method and returns callback props 
// that you want to inject into the presentational component
import axios from 'axios';
const { SIGN_UP, SIGN_ERROR, GET_SECRET, SIGN_OUT, SIGN_IN } = require("./types");

const setSignInStatus = (res) => {
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('userID', res.data.userID);
  localStorage.setItem('isAdmin', res.data.isAdmin);
  axios.defaults.headers.common['authorization'] = res.data.token;
}

const setSignOutStatus = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userID');
  localStorage.removeItem('isAdmin');
  axios.defaults.headers.common['authorization'] = "";
}

export const signIn = (formData) => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post("http://localhost:5000/users/signin", formData);
     if(!res.data || !res.data.token) {
       throw new Error("user not found");
     }
     dispatch({
       type: SIGN_IN,
       token: res.data.token,
       userID: res.data.userID,
       isAdmin: res.data.isAdmin
     });
     setSignInStatus(res);
    } catch(err) {
      dispatch({
        type: SIGN_ERROR,
        errorMsg: "user not found"
      })
    }
  }
}

export const googleOauth = (response) => {
  return async (dispatch, getState) => {
    let res;
    try {
      res = await axios.post("http://localhost:5000/users/oauth/google", response);
     if(!res.data || !res.data.token) {
       throw new Error(res.data.errorMsg);
     }
     dispatch({
       type: SIGN_IN,
       token: res.data.token,
       isAdmin: res.data.isAdmin,
       userID: res.data.userID
     });
     setSignInStatus(res);
    } catch(err) {
      dispatch({
        type: SIGN_ERROR,
        errorMsg: res.data.errorMsg
      })
    }
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SIGN_OUT
    });
    setSignOutStatus();
  }
}

export const getSecret = () => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.get("http://localhost:5000/users/secret");
      
      dispatch({
        type: GET_SECRET,
        secret: res.data.secret
      });
    } catch(err) {
      dispatch({
        type: GET_SECRET,
        secret: ''
      });
    }
  }
}

export const signUp = (formData) => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post("http://localhost:5000/users/signup", formData);
      /*
      data: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmb…zc5fQ.SToYM5V88ieefcoEzBcZnIIkpIFvX-jpcXqyypPioSo"}
      status: 200
      statusText: "OK"
      headers: {content-length: "211", content-type: "application/json; charset=utf-8"}
      config: {url: "http://localhost:5000/users/signup", method: "post", headers: {…}, transformRequest: Array(1), transformResponse: Array(1), …}
      request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
      __proto__: Object
      */
     if(!res.data || !res.data.token) {
       throw new Error("email already in use");
     }
     dispatch({
       type: SIGN_UP,
       token: res.data.token,
       userID: res.data.userID,
       isAdmin: res.data.isAdmin
     });
     setSignInStatus(res);
    } catch(err) {
      dispatch({
        type: SIGN_ERROR,
        errorMsg: "email already in use"
      })
    }
  }
}