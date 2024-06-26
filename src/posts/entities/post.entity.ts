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

export enum PostType {
  post = 'POST',
  localAd = 'LOCAL_AD',
  allAd = 'ALL_AD',
  localNotice = 'LOCAL_NOTICE',
  allNotice = 'ALL_NOTICE',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: PostType, default: PostType.post })
  postType: PostType;

  @Column({ default: 99999 })
  expirationDate: number;

  @Column({ default: false })
  hasProblem: boolean;

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

  @OneToMany((type) => Dislike, (like) => like.post)
  dislikes: Dislike[];

  @OneToMany((type) => Comment, (comment) => comment.postId, { eager: true })
  comments: Comment[];

  @OneToMany((type) => Report, (report) => report.post)
  reports: Report[];

  @ManyToOne((type) => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
