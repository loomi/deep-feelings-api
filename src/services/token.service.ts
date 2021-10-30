import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';
import {TokenServiceBindings} from '../keys';
import {UserRepository} from '../repositories';

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    try {
      const decodedToken = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      const user = await this.userRepository.findOne({
        where: {email: decodedToken.email},
      });

      if (!user) {
        throw new HttpErrors.Forbidden('blacklisted');
      }

      return {[securityId]: '', ...user};
    } catch (err) {
      throw new HttpErrors.BadRequest((err as {message: string}).message);
    }
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('userProfile is null');
    }

    const userInfoForToken = {
      name: userProfile.name,
      roles: userProfile.roles,
    };

    return jwt.sign(userInfoForToken, this.jwtSecret);
  }

  extractCredentials(request: Request): string {
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

    return token;
  }
}
