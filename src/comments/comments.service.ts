import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { MakeCommentInput, MakeCommentOutput } from './dtos/make-comment.dto';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PostsCommentsInput,
  PostsCommentsOutput,
} from './dtos/posts-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
  ) {}

  async postsComments({
    postId,
  }: PostsCommentsInput): Promise<PostsCommentsOutput> {
    try {
      const post = await this.posts.findOne({
        where: { id: postId },
        relations: ['comments.owner'],
      });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      return { ok: true, comments: post.comments, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async makeComment(
    authUser: User,
    makeCommentInput: MakeCommentInput,
  ): Promise<MakeCommentOutput> {
    try {
      if (!authUser) return { ok: false, msg: '잘못된 요청이에요!' };
      const user = await this.users.findOne({ where: { id: authUser.id } });
      if (!user) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const { postId, comment } = makeCommentInput;

      const post = await this.posts.findOne({ where: { id: postId } });
      if (!post) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.comments.save(
        this.comments.create({ postId: post, comment, owner: user }),
      );

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
