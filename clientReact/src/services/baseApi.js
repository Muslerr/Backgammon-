import axios from "axios";

class AbstractApiService {
  constructor(baseURL) {
    this.axios = axios.create({
      baseURL: baseURL,
    });
  }

  get(endpoint, config = {}) {
    return this.axios.get(endpoint, config);
  }

  post(endpoint, data, config = {}) {
    return this.axios.post(endpoint, data, config);
  }

  delete(endpoint, config = {}) {
    return this.axios.delete(endpoint, config);
  }

  
}

export default AbstractApiService;