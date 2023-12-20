import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MakeStampInput, MakeStampOutput } from './dtos/make-stamp.dto';
import { DeleteStampInput, DeleteStampOutput } from './dtos/delete-stamp.dto';
import { UsersStampOutput } from './dtos/users-stamp.dto';

@Controller('stamps')
export class StampsController {
  constructor(private readonly stampsService: StampsService) {}

  @Get('usersStamp')
  @Role(['Any'])
  usersStamp(@AuthUser() authUser: User): Promise<UsersStampOutput> {
    return this.stampsService.usersStamp(authUser);
  }

  @Post('makeStamp')
  @Role(['Any'])
  makeStamp(
    @AuthUser() authUser: User,
    @Body() makeStampInput: MakeStampInput,
  ): Promise<MakeStampOutput> {
    return this.stampsService.makeStamp(authUser, makeStampInput);
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
