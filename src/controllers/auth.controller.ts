import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {TokenServiceBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';

dotenv.config();

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
    @inject(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN)
    private refreshJwtExpiresIn: string,
  ) {}

  @post('/auth/login')
  @response(200, {
    description: 'User with tokens',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: getModelSchemaRef(User),
            accessToken: {type: 'string'},
            refreshToken: {type: 'string'},
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    body: {
      email: string;
      password: string;
    },
  ): Promise<LoginResponse | HttpErrors.HttpError> {
    const {email, password} = body;

    const user = await this.userRepository.findOne({where: {email}});

    if (!user) {
      return new HttpErrors.BadRequest('Invalid Credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new HttpErrors.BadRequest('Invalid Credentials');
    }

    const accessToken = jwt.sign({email, type: 'accessToken'}, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });

    const refreshToken = jwt.sign(
      {email, type: 'refreshToken'},
      this.jwtSecret,
      {
        expiresIn: this.refreshJwtExpiresIn,
      },
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @post('/auth/refresh-token')
  @response(200, {
    description: 'User with tokens',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: getModelSchemaRef(User),
            accessToken: {type: 'string'},
            refreshToken: {type: 'string'},
          },
        },
      },
    },
  })
  async refreshToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {type: 'string'},
            },
          },
        },
      },
    })
    body: {
      refreshToken: string;
    },
  ) {
    try {
      const decodedToken = jwt.verify(
        body.refreshToken,
        this.jwtSecret,
      ) as jwt.JwtPayload;

      if (decodedToken.type !== 'refreshToken') {
        return new HttpErrors.BadRequest('Token is not of type "refreshToken"');
      }

      const user = await this.userRepository.findOne({
        where: {email: decodedToken.email},
      });

      if (!user) {
        throw new HttpErrors.BadRequest('Unknown user');
      }

      const accessToken = jwt.sign(
        {email: user.email, type: 'accessToken'},
        this.jwtSecret,
        {
          expiresIn: this.jwtExpiresIn,
        },
      );

      const refreshToken = jwt.sign(
        {email: user.email, type: 'refreshToken'},
        this.jwtSecret,
        {
          expiresIn: this.refreshJwtExpiresIn,
        },
      );

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new HttpErrors.BadRequest((err as {message: string}).message);
    }
  }
}
