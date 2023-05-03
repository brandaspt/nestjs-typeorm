import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const redisClient = createClient({
    url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
      'REDIS_PORT',
    )}`,
  });

  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      //cookie: { secure: true },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
