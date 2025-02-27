class ApiResponse {
    constructor(status, message="Success", data) {
      this.status = status;
      this.message = message;
      this.data = data;
      this.success = status >= 200 && status < 300;
  
    }
  }
  export default ApiResponse;