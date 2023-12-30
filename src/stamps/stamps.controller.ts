import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MakeStampInput, MakeStampOutput } from './dtos/make-stamp.dto';
import { DeleteStampInput, DeleteStampOutput } from './dtos/delete-stamp.dto';
import { UsersStampOutput } from './dtos/users-stamp.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('stamps')
export class StampsController {
  constructor(private readonly stampsService: StampsService) {}

  @Get()
  hello() {
    return 'good work';
  }

  @Get('usersStamp')
  @Role(['Any'])
  usersStamp(@AuthUser() authUser: User): Promise<UsersStampOutput> {
    return this.stampsService.usersStamp(authUser);
  }

  @Post('makeStamp')
  @Role(['Any'])
  @UseInterceptors(FilesInterceptor('images'))
  makeStamp(
    @AuthUser() authUser: User,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() makeStampInput: any,
  ): Promise<MakeStampOutput> {
    return this.stampsService.makeStamp(authUser, images, makeStampInput);
  }

  @Delete('deleteStamp')
  @Role(['Any'])
  deleteStamp(
    @AuthUser() authUser: User,
    @Query() deleteStampInput: DeleteStampInput,
  ): Promise<DeleteStampOutput> {
    return this.stampsService.deleteStamp(authUser, deleteStampInput);
  }
}
