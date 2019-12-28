//  mapDispatchToProps() receives the dispatch() method and returns callback props 
// that you want to inject into the presentational component
import axios from 'axios';
const { SIGN_UP, SIGN_ERROR } = require("../actions/types");

export const signUp = (formData) => {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post("http://localhost:5000/users/signup", formData);
      console.log(res);
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
       token: res.data.token
     });

    } catch(err) {
      dispatch({
        type: SIGN_ERROR,
        errorMsg: "email already in use"
      })
    }
  }
}