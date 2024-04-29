import { IsEmail, IsEnum } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Dislike } from 'src/posts/entities/dislike.entity';
import { Like } from 'src/posts/entities/like.entity';
import { Report } from 'src/posts/entities/report.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Stamp } from 'src/stamps/entities/stamp.entity';
import { UserBlock } from './userBlock.entity';
import { UserPostBlock } from './userPostBlock.entity';

export enum UserRole {
  admin = 'ADMIN',
  user = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  latestLogin: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  mobile: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  loginId: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  pfp: string;

  @Column({ default: '초급 모험가' })
  rank: string;

  @Column({ nullable: true })
  activityZone: string;

  @Column('text', { array: true, default: [] })
  preferFoods: string[];

  @Column({ nullable: true })
  preferRestaurant: string;

  @Column('text', { array: true, default: [] })
  medalsEarned: string[];

  @ManyToMany((type) => User)
  @JoinTable()
  follows: User[];

  @ManyToMany((type) => User)
  @JoinTable()
  followers: User[];

  @OneToMany((type) => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany((type) => Bookmark, (bookmark) => bookmark.owner)
  bookmarks: Bookmark[];

  @OneToMany((type) => Stamp, (stamp) => stamp.owner)
  stamps: Stamp[];

  @OneToMany((type) => Comment, (comment) => comment.owner)
  comments: Comment[];

  @OneToMany((type) => Like, (like) => like.owner)
  likes: Like[];

  @OneToMany((type) => Dislike, (like) => like.owner, { eager: true })
  dislikes: Dislike[];

  @OneToMany((type) => Report, (report) => report.owner)
  reports: Report[];

  @OneToMany((type) => UserPostBlock, (userPostBlock) => userPostBlock.owner)
  userPostBlocks: UserPostBlock[];

  @OneToMany((type) => UserBlock, (userBlock) => userBlock.owner)
  userBlocks: UserBlock[];

  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const right = await bcrypt.compare(password, this.password);
      return right;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
