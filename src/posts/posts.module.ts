import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { Dislike } from './entities/dislike.entity';
import { Report } from './entities/report.entity';
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like, Dislike, Report])],
  controllers: [PostsController],
  providers: [PostsService, S3ServiceService],
  exports: [PostsService],
})
export class PostsModule {}
