import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.follows)
  owner: User;

  @ManyToOne((type) => User, { eager: true })
  follow: User;
}
