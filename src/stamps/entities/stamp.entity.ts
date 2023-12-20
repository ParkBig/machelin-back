import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stamp {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lng: number;

  @Column()
  restaurantId: string;

  @Column()
  restaurantName: string;

  @Column()
  address: string;

  @Column({ type: 'decimal' })
  rating: number;

  @Column({ type: 'decimal' })
  totalRatings: number;

  @ManyToOne((type) => User, (user) => user.stamps, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
