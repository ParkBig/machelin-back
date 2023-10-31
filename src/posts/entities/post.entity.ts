import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface Comment {
  pfp: string;
  nickName: string;
  comment: string;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  contents: string;

  @Column('text', { array: true, default: [] })
  photos: string[];

  @Column('text', { array: true, default: [] })
  comments: Comment[];

  @Column()
  likes: number;

  @Column()
  report: number;

  @ManyToOne((type) => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
