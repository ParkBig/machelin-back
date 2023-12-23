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

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lng: number;

  @Column({ nullable: true })
  restaurantId: string;

  @Column({ nullable: true })
  restaurantName: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne((type) => User, (user) => user.stamps, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;
}
