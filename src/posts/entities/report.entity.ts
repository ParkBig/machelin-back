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
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  report: string;

  @ManyToOne((type) => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  post: Post;

  @ManyToOne((type) => User, (user) => user.reports, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
