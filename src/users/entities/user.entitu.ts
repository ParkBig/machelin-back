import { IsBoolean, IsEmail, IsEnum } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

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

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  nickName: string;

  @Column()
  @IsBoolean()
  verified: boolean;

  @Column()
  rank: number;

  @Column('text', { array: true, default: [] })
  followers: string[];

  // 나중에 타입바꿔줘야함 => 레스토랑id, 레스토랑이름
  @Column('text', { array: true, default: [] })
  bookmarks: string[];

  // 릴레이션으로
  // @OneToMany()
  // posts:

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
