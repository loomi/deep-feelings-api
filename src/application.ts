import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { TokenServiceBindings, TokenServiceConstants } from './keys';
import { JWTService } from './services';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './strategies/jwt.strategy';

export {ApplicationConfig};

export class DeepFeelingsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.setUpBindings();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Authentication
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // JWT Service
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE ?? '',
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE ?? '',
    );
    this.bind(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.REFRESH_TOKEN_EXPIRES_IN_VALUE ?? '',
    );
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    }
}
