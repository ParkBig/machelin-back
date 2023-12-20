import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stamp } from './entities/stamp.entity';
import { StampsService } from './stamps.service';
import { StampsController } from './stamps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stamp])],
  controllers: [StampsController],
  providers: [StampsService],
})
export class StampsModule {}
