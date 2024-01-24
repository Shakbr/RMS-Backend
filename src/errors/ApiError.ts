import { HttpStatusCodeEnum } from '@/constants/HttpStatusCodeConstants';
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message);
  }

  static badRequest(msg: string): ApiError {
    return new ApiError(HttpStatusCodeEnum.BAD_REQUEST, msg);
  }

  static notFound(msg: string): ApiError {
    return new ApiError(HttpStatusCodeEnum.NOT_FOUND, msg);
  }

  static unauthorized(msg: string): ApiError {
    return new ApiError(HttpStatusCodeEnum.UNAUTHORIZED, msg);
  }

  static forbidden(msg: string): ApiError {
    return new ApiError(HttpStatusCodeEnum.FORBIDDEN, msg);
  }
}
