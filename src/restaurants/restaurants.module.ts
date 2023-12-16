import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { restaurantsController } from './restaurants.controller';
import { PostsModule } from 'src/posts/posts.module';
import { GoogleApiService } from 'src/google-api/google-api.service';

@Module({
  imports: [PostsModule],
  controllers: [restaurantsController],
  providers: [RestaurantsService, GoogleApiService],
})
export class RestaurantsModule {}
