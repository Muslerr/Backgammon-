import axios from "axios";
import AbstractApiService from "./baseApi";


class HttpLoginService extends AbstractApiService {
  constructor() {
    super(process.env.REACT_APP_LOGIN_SERVICE_BASE_URL); 
    
  }

  login(username, password) {
    return this.post(`/login`, {  
      username: username,
      password: password,});
  }
 
  signIn(username, password, email, blevel,icon) {
    return this.post(`/signIn`, { 
      username: username,
      password: password,
      email:email,
      blevel:blevel,
      icon:icon
    });
  }
  
  logout(username){
    return this.post(`/logout`, { username});
  }
  
 
}

export default HttpLoginService;
