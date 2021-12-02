class AppError extends Error {
  status = 500;

  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status ?? this.status;
  }
}

export default AppError;
