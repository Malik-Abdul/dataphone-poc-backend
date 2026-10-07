import { ConflictException } from '@nestjs/common';
import { USER_MESSAGES } from 'src/common/constants/messages';

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super(USER_MESSAGES.EMAIL_ALREADY_EXISTS);
  }
}
