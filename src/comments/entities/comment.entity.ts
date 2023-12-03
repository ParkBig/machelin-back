import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  comment: string;

  @ManyToOne((type) => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  postId: Post;

  @ManyToOne((type) => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
