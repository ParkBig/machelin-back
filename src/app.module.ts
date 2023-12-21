import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { User } from './users/entities/user.entity';
import { PostsModule } from './posts/posts.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Post } from './posts/entities/post.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { TwilioModule } from './twilio/twilio.module';
import { Like } from './posts/entities/like.entity';
import { Dislike } from './posts/entities/dislike.entity';
import { Report } from './posts/entities/report.entity';
import { S3ServiceModule } from './s3-service/s3-service.module';
import { Bookmark } from './bookmarks/entities/bookmark.entity';
import { GoogleApiModule } from './google-api/google-api.module';
import { StampsModule } from './stamps/stamps.module';
import { Stamp } from './stamps/entities/stamp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.production',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'production').required(),
        DATABASE_URL: Joi.string(),
        POSTGRES_HOST: Joi.string(),
        POSTGRES_PORT: Joi.string(),
        POSTGRES_USERNAME: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        POSTGRES_NAME: Joi.string(),
        POSTGRES_PRIVATE_KEY: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_SERVICE_SID: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        GOOGLE_KEY: Joi.string().required(),
        GOOGLE_NEARBY_SEARCH_URL: Joi.string().required(),
        GOOGLE_DETAIL_SEARCH_URL: Joi.string().required(),
        GOOGLE_TEXT_SEARCH_URL: Joi.string().required(),
        GOOGLE_REVERSE_GEOCODING_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_NAME,
          }),
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
      // process.env.NODE_ENV !== 'production' &&
      // process.env.NODE_ENV !== 'test',
      entities: [User, Post, Bookmark, Comment, Like, Report, Dislike, Stamp],
    }),
    JwtModule.forRoot({
      privateKey: process.env.POSTGRES_PRIVATE_KEY,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    RestaurantsModule,
    BookmarksModule,
    CommentsModule,
    TwilioModule,
    S3ServiceModule,
    GoogleApiModule,
    StampsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
