import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => Post, (post) => post.postBlocks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  post: Post;

  @ManyToOne((type) => User, (user) => user.postBlocks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
