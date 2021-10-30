import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import * as dotenv from 'dotenv';

dotenv.config();

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = process.env.JWT_SECRET;
  export const TOKEN_EXPIRES_IN_VALUE = process.env.TOKEN_EXPIRES_IN;
  export const REFRESH_TOKEN_EXPIRES_IN_VALUE =
    process.env.REFRESH_TOKEN_EXPIRES_IN;
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );

  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );

  export const REFRESH_TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.refresh.expires.in.seconds',
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}