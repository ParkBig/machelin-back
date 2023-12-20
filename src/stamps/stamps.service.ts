import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stamp } from './entities/stamp.entity';
import { MakeStampInput, MakeStampOutput } from './dtos/make-stamp.dto';
import { User } from 'src/users/entities/user.entity';
import { DeleteStampInput, DeleteStampOutput } from './dtos/delete-stamp.dto';
import { UsersStampOutput } from './dtos/users-stamp.dto';

@Injectable()
export class StampsService {
  constructor(
    @InjectRepository(Stamp) private readonly stamps: Repository<Stamp>,
  ) {}

  async usersStamp(authUser: User): Promise<UsersStampOutput> {
    try {
      if (!authUser) {
        return { ok: true, stamps: [], msg: 'good work' };
      }

      const stamps = await this.stamps.find({
        where: { owner: { id: authUser.id } },
      });

      return { ok: true, stamps, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async makeStamp(
    authUser: User,
    makeStampInput: MakeStampInput,
  ): Promise<MakeStampOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.stamps.save(
        this.stamps.create({ ...makeStampInput, owner: authUser }),
      );

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async deleteStamp(
    authUser: User,
    { id }: DeleteStampInput,
  ): Promise<DeleteStampOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const stamp = await this.stamps.findOne({ where: { id } });
      if (!stamp) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      await this.stamps.remove(stamp);

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
