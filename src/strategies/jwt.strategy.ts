import {
  asAuthStrategy,
  AuthenticationStrategy,
  TokenService,
} from '@loopback/authentication';
import {bind, inject} from '@loopback/context';
import {
  asSpecEnhancer,
  mergeSecuritySchemeToSpec,
  OASEnhancer,
  OpenApiSpec,
} from '@loopback/openapi-v3';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '../keys';

@bind(asAuthStrategy, asSpecEnhancer)
export class JWTAuthenticationStrategy
  implements AuthenticationStrategy, OASEnhancer
{
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const {authorization} = request.headers;
    if (!authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found');
    }

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not of type: Bearer',
      );
    }

    return this.tokenService.verifyToken(token);
  }

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    return mergeSecuritySchemeToSpec(spec, this.name, {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    });
  }
}
