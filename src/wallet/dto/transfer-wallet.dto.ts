import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

/**
 * DTO for transferring money between wallets.
 */
export class TransferWalletDto {
  // Wallet sending the money
  @IsString()
  fromWalletId: string;

  // Wallet receiving the money
  @IsString()
  toWalletId: string;

  // Amount must be positive
  @IsNumber()
  @IsPositive()
  amount: number;

  // Optional idempotency key
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
