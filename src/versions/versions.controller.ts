import { Controller, Get } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { VersionsCheckOutput } from './dtos/versions-check.dto';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get()
  versionsCheck(): Promise<VersionsCheckOutput> {
    return this.versionsService.versionsCheck();
  }
}
