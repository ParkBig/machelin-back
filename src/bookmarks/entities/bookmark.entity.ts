import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  restaurantId: string;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lng: number;

  @Column()
  restaurantName: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column()
  address: string;

  @Column({ type: 'decimal' })
  rating: number;

  @Column({ type: 'decimal' })
  totalRatings: number;

  @ManyToOne((type) => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
