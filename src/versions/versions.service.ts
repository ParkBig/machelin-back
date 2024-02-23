import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VersionsCheckOutput } from './dtos/versions-check.dto';

@Injectable()
export class VersionsService {
  private readonly machelinCurrentVersion: string;

  constructor(private readonly configService: ConfigService) {
    this.machelinCurrentVersion = this.configService.get(
      'MACHELIN_CURRENT_VERSION',
    );
  }

  async versionsCheck(): Promise<VersionsCheckOutput> {
    try {
      return {
        ok: true,
        msg: 'good work',
        machelinCurrentVersion: this.machelinCurrentVersion,
      };
    } catch (error) {
      return { ok: false, msg: '서버가 잠시 아픈거 같아요...', error };
    }
  }
}
