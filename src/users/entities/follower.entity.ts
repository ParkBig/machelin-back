import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.followers)
  owner: User;

  @ManyToOne((type) => User, { eager: true })
  follower: User;
}
