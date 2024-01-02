import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stamp } from './entities/stamp.entity';
import { MakeStampInput, MakeStampOutput } from './dtos/make-stamp.dto';
import { User } from 'src/users/entities/user.entity';
import { DeleteStampInput, DeleteStampOutput } from './dtos/delete-stamp.dto';
import { UsersStampOutput } from './dtos/users-stamp.dto';
import { S3ServiceService } from 'src/s3-service/s3-service.service';

@Injectable()
export class StampsService {
  constructor(
    private readonly s3ServiceService: S3ServiceService,
    @InjectRepository(Stamp) private readonly stamps: Repository<Stamp>,
  ) {}

  async usersStamp(authUser: User): Promise<UsersStampOutput> {
    try {
      if (!authUser) {
        return { ok: true, stamps: [], msg: 'good work' };
      }

      const stamps = await this.stamps.find({
        where: { owner: { id: authUser.id } },
        order: { createdAt: 'DESC' },
      });

      return { ok: true, stamps, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async makeStamp(
    authUser: User,
    images: Array<Express.Multer.File>,
    makeStampInput: MakeStampInput,
  ): Promise<MakeStampOutput> {
    try {
      if (!authUser) {
        return { ok: false, msg: '잘못된 요청이에요!' };
      }

      const imageUrls = await this.s3ServiceService.uploadImages(images);

      const stampColumn = {
        images: imageUrls,
        title: makeStampInput.title,
        content: makeStampInput.content,
        lat: Number(makeStampInput.lat),
        lng: Number(makeStampInput.lng),
        owner: authUser,
      };

      if (makeStampInput.restaurantId) {
        const stampRestaurantInfoColumn = {
          restaurantId: makeStampInput.restaurantId,
          restaurantName: makeStampInput.restaurantName,
          address: makeStampInput.address,
        };

        Object.assign(stampColumn, stampRestaurantInfoColumn);
      }

      await this.stamps.save(this.stamps.create(stampColumn));

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
