class CustomeError extends Error {
  constructor(name) {
    super();
    this.name = name;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomeError;
