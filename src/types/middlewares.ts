const MIDDLEWARE_TYPES = {
  ValidationErrorHandlerMiddleware: Symbol.for('ValidationErrorHandlerMiddleware'),
  AuthMiddleware: Symbol.for('AuthMiddleware'),
  ErrorHandlerMiddleware: Symbol.for('ErrorHandlerMiddleware'),
};

export { MIDDLEWARE_TYPES };
