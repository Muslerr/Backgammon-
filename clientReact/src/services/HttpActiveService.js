import AbstractApiService from "./baseApi";

class HttpActiveService extends AbstractApiService {
  constructor() {
    super(process.env.REACT_APP_ACTIVE_SERVICE_BASE_URL); 
  }
  getActiveUsers(token) {
    return this.get("/activeUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default HttpActiveService;