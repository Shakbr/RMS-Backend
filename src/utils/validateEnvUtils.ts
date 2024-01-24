import { cleanEnv, port, str } from 'envalid';

export class ValidateEnvUtils {
  static validateEnv() {
    cleanEnv(process.env, {
      NODE_ENV: str(),
      PORT: port(),
      DB_TYPE: str(),
      DB_HOST: str(),
      DB_PORT: port(),
      DB_USERNAME: str(),
      DB_PASSWORD: str(),
      DB_DATABASE: str(),
    });
  }
}
