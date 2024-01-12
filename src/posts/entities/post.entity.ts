import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Report } from './report.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'post' })
  postType: 'post' | 'localAd' | 'allAd' | 'notice';

  @Column({ default: 0 })
  views: number;

  @Column()
  ownerSubLocality: string;

  @Column({ nullable: true })
  restaurantSubLocality: string;

  @Column({ nullable: true })
  hasRestaurantTag: boolean;

  @Column({ nullable: true, type: 'decimal' })
  restaurantLat: number;

  @Column({ nullable: true, type: 'decimal' })
  restaurantLng: number;

  @Column({ nullable: true })
  restaurantId: string;

  @Column({ nullable: true })
  restaurantName: string;

  @Column({ nullable: true })
  restaurantAddress: string;

  @Column({ nullable: true })
  rating: number;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column()
  contents: string;

  @Column('text', { array: true, default: [] })
  hashtags: string[];

  @Column()
  isPublic: boolean;

  @OneToMany((type) => Like, (like) => like.post, { eager: true })
  likes: Like[];

  @OneToMany((type) => Dislike, (like) => like.post, { eager: true })
  dislikes: Dislike[];

  @OneToMany((type) => Report, (report) => report.post, { eager: true })
  report: Report;

  @OneToMany((type) => Comment, (comment) => comment.postId, { eager: true })
  comments: Comment[];

  @ManyToOne((type) => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
