import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stamp } from './entities/stamp.entity';
import { StampsService } from './stamps.service';
import { StampsController } from './stamps.controller';
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stamp])],
  controllers: [StampsController],
  providers: [StampsService, S3ServiceService],
})
export class StampsModule {}
