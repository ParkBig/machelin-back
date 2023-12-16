import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { S3ServiceService } from 'src/s3-service/s3-service.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { GoogleApiService } from 'src/google-api/google-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, S3ServiceService, TwilioService, GoogleApiService],
  exports: [UsersService],
})
export class UsersModule {}
