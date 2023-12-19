import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import phone from 'phone';
import {
  CheckVerificationInput,
  CheckVerificationOutput,
} from './dtos/check-verification.dto';
import {
  SendVerificationInput,
  SendVerificationOutput,
} from './dtos/send-verification.dto';

@Injectable()
export class TwilioService {
  private readonly twilioClient: Twilio;
  private readonly serviceSid: string;

  constructor(private readonly config: ConfigService) {
    this.serviceSid = this.config.get('TWILIO_SERVICE_SID');
    this.twilioClient = new Twilio(
      this.config.get('TWILIO_ACCOUNT_SID'),
      this.config.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendVerification({
    phoneNumber,
  }: SendVerificationInput): Promise<SendVerificationOutput> {
    console.log(phoneNumber);
    try {
      const korPhoneNumber = phone(phoneNumber, { country: 'KOR' });
      if (!korPhoneNumber.isValid) {
        return { ok: false, msg: '유효하지 않은 번호에요.' };
      }

      await this.twilioClient.verify.v2
        .services(this.serviceSid)
        .verifications.create({
          to: korPhoneNumber.phoneNumber,
          channel: 'sms',
        });

      return { ok: true, msg: 'good word' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }

  async checkVerification({
    phoneNumber,
    verificationCode,
  }: CheckVerificationInput): Promise<CheckVerificationOutput> {
    try {
      const korPhoneNumber = phone(phoneNumber, { country: 'KOR' });
      if (!korPhoneNumber.isValid) {
        return { ok: false, msg: '유효하지 않은 번호에요.' };
      }

      const result = await this.twilioClient.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({
          to: korPhoneNumber.phoneNumber,
          code: verificationCode,
        });

      if (!result.valid || result.status !== 'approved') {
        return { ok: false, msg: '잘못된 코드 번호에요.' };
      }

      return { ok: true, msg: 'good work' };
    } catch (error) {
      return { ok: false, error, msg: '서버가 잠시 아픈거 같아요...' };
    }
  }
}
