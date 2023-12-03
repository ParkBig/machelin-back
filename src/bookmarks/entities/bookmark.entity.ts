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

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column()
  restaurantName: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column()
  address: string;

  @Column()
  rating: string;

  @Column()
  totalRatings: string;

  @ManyToOne((type) => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
