import * as crypto from 'crypto';

function hashPhoneNumber(phoneNumber: string): string {
  const normalizedPhoneNumber = Buffer.from(phoneNumber, 'utf-8');
  const hash = crypto.createHash('sha256');
  hash.update(normalizedPhoneNumber);
  const phoneHash = hash.digest('hex');
  return phoneHash;
}