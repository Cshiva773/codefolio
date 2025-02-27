class ApiError extends Error {
    constructor(status, message="into the blackhole",errors=[],stack="") {
      super(message);
      this.status = status;
      this.data = null;
      this.message = message;
      this.success=false;
      this.errors=errors;
      if(stack) this.stack = stack;
      else Error.captureStackTrace(this, this.constructor);
    }
  }
  export default ApiError;