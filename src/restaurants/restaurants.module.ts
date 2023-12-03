import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { restaurantsController } from './restaurants.controller';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [restaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
