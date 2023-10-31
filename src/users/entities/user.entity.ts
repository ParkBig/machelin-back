import { IsBoolean, IsEmail, IsEnum } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Post } from 'src/posts/entities/post.entity';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_IMAGE } from 'src/const/default';

export enum UserRole {
  admin = 'ADMIN',
  user = 'USER',
}

export interface Bookmark {
  id: string;
  lat: number;
  lng: number;
  restaurantName: string;
  img: string;
  address: string;
  rating: number;
  totalUserRatings: number;
}

@Entity()
export class User {
  constructor(private readonly config: ConfigService) {}

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  nickName: string;

  @Column({
    default: DEFAULT_IMAGE,
  })
  pfp: string;

  @Column({ default: '초급 모험가' })
  rank: string;

  @Column('text', { array: true, default: [] })
  follows: string[];

  @Column('text', { array: true, default: [] })
  followers: string[];

  @Column('text', { array: true, default: [] })
  bookmarks: string[];

  @OneToMany((type) => Post, (post) => post.owner)
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
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
