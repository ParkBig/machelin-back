import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsService } from './restaurants.service';
import { restaurantsController } from './restaurants.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [restaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
