import './util/module-alias';
import { Application } from 'express';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import * as http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import { PortaConfig } from '@src/util/porta-conf';
import cors from 'cors';
import config from 'config';
import { CreationUserController } from '@src/useCases/creationUser/CreationUserController';
import { apiErrorValidator } from '@src/middlewares/api-error-validator';
import { AuthenticateUserController } from './useCases/authenticateUser/AuthenticateUserController';

class SetupServer extends Server {
  private server?: http.Server;

  // Aqui a porta tem que ser fixa por causa do heroku
  private port = PortaConfig.normalizePort(
    process.env.PORT || config.get('App.port')
  );

  public async init(): Promise<void> {
    this.setupSecurity();
    this.setupExpress();
    this.setupControllers();
    //must be the last
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private setupSecurity(): void {
    this.app.use(
      cors({
        origin: '*',
      })
    );
    this.app.use(helmet());
    this.app.disable('x-powered-by');
  }

  private setupExpress(): void {
    this.app.use(compression());
    this.app.use(bodyParser.json({ limit: '50mb' }));
  }

  private setupControllers(): void {
    const creationUserController = new CreationUserController();
    const authenticateUserController = new AuthenticateUserController();
    this.addControllers([creationUserController]);
    this.addControllers([authenticateUserController]);
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log('Server listening on port: ' + this.port);
    });
  }
}

export { SetupServer };
