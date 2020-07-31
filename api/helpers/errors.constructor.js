export class BaseError extends Error {
  constructor(name, message, status) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class NotFound extends BaseError {
  constructor(message) {
    super('NotFoundError', message, 404);
  }
}

export class Conflict extends BaseError {
  constructor(message) {
    super('ConflictError', message, 409);
  }
}

export class Unauthorized extends BaseError {
  constructor(message) {
    super('UnauthorizedError', message, 401);
  }
}

export class BadRequest extends BaseError {
  constructor(message) {
    super('BadRequestError', message, 400);
  }
}
